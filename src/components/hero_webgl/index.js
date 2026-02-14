import React, { useEffect, useRef, useState } from "react";
import "./style.css";

const VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SOURCE = `
  precision highp float;

  varying vec2 v_uv;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform sampler2D u_image;
  uniform float u_image_mix;
  uniform float u_hover_mix;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float rect_mask(vec2 uv, vec2 min_corner, vec2 max_corner) {
    vec2 at_least_min = step(min_corner, uv);
    vec2 at_most_max = step(uv, max_corner);
    return at_least_min.x * at_least_min.y * at_most_max.x * at_most_max.y;
  }

  void main() {
    vec2 uv = v_uv;
    vec2 mouse = clamp(u_mouse, 0.0, 1.0);

    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 centered = uv - 0.5;
    centered.x *= aspect;

    float glow_at_mouse = exp(-7.0 * distance(uv, mouse));
    float glow_corner = exp(-4.0 * length(centered + vec2(0.55, 0.35)));

    vec3 color = vec3(0.02, 0.025, 0.038);
    color += vec3(0.07, 0.18, 0.24) * glow_at_mouse;
    color += vec3(0.10, 0.14, 0.21) * glow_corner;

    float grain = (hash(uv * u_resolution.xy + u_time * 60.0) - 0.5) * 0.08;
    color += grain;

    vec2 frame_min = vec2(0.10, 0.07);
    vec2 frame_max = vec2(0.90, 0.94);
    float panel_mask = rect_mask(uv, frame_min, frame_max);

    if (panel_mask > 0.0) {
      vec2 frame_uv = (uv - frame_min) / (frame_max - frame_min);
      vec2 wave = vec2(
        sin(frame_uv.y * 25.0 + u_time * 1.4),
        cos(frame_uv.x * 22.0 + u_time * 1.2)
      ) * (0.007 * u_hover_mix);

      vec2 mouse_push = (frame_uv - mouse) * (0.018 * u_hover_mix) * exp(-9.0 * distance(frame_uv, mouse));
      vec2 sample_uv = clamp(frame_uv + wave - mouse_push, 0.0, 1.0);

      float chroma = (0.004 + glow_at_mouse * 0.004) * u_hover_mix;
      vec3 portrait = vec3(
        texture2D(u_image, clamp(sample_uv + vec2(chroma, 0.0), 0.0, 1.0)).r,
        texture2D(u_image, sample_uv).g,
        texture2D(u_image, clamp(sample_uv - vec2(chroma, 0.0), 0.0, 1.0)).b
      );

      float scan_line = sin((sample_uv.y * u_resolution.y * 0.85) + u_time * 40.0) * (0.02 * u_hover_mix);
      portrait += scan_line;
      portrait += grain * (0.75 * u_hover_mix);

      float edge = min(
        min(frame_uv.x, 1.0 - frame_uv.x),
        min(frame_uv.y, 1.0 - frame_uv.y)
      );
      float border = smoothstep(0.09, 0.0, edge);
      vec3 border_color = mix(vec3(0.09, 0.35, 0.42), vec3(0.74, 0.92, 0.88), frame_uv.x);
      vec3 framed = portrait + border_color * border * 0.9;

      color = mix(color, framed, u_image_mix);
    }

    float vignette = smoothstep(1.2, 0.4, length(centered));
    color *= 0.65 + vignette * 0.45;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const clamp01 = (value) => Math.max(0, Math.min(1, value));

const createShader = (gl, type, source) => {
  const shader = gl.createShader(type);

  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader;
  }

  gl.deleteShader(shader);
  return null;
};

const createProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram();

  if (!program) {
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return program;
  }

  gl.deleteProgram(program);
  return null;
};

export const HeroWebGL = ({ imageSrc, alt }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) {
      return undefined;
    }

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
    });

    if (!gl) {
      setShowFallback(true);
      return undefined;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);

    if (!vertexShader || !fragmentShader) {
      if (vertexShader) {
        gl.deleteShader(vertexShader);
      }
      if (fragmentShader) {
        gl.deleteShader(fragmentShader);
      }
      setShowFallback(true);
      return undefined;
    }

    const program = createProgram(gl, vertexShader, fragmentShader);

    if (!program) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      setShowFallback(true);
      return undefined;
    }

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");
    const imageLocation = gl.getUniformLocation(program, "u_image");
    const imageMixLocation = gl.getUniformLocation(program, "u_image_mix");
    const hoverMixLocation = gl.getUniformLocation(program, "u_hover_mix");

    if (
      positionLocation < 0 ||
      !resolutionLocation ||
      !timeLocation ||
      !mouseLocation ||
      !imageLocation ||
      !imageMixLocation ||
      !hoverMixLocation
    ) {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      setShowFallback(true);
      return undefined;
    }

    const positionBuffer = gl.createBuffer();
    const imageTexture = gl.createTexture();

    if (!positionBuffer || !imageTexture) {
      if (positionBuffer) {
        gl.deleteBuffer(positionBuffer);
      }
      if (imageTexture) {
        gl.deleteTexture(imageTexture);
      }
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      setShowFallback(true);
      return undefined;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    gl.bindTexture(gl.TEXTURE_2D, imageTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([8, 10, 14, 255])
    );

    let disposed = false;
    let imageReady = false;
    const portrait = new Image();
    portrait.decoding = "async";
    portrait.onload = () => {
      if (disposed) {
        return;
      }

      gl.bindTexture(gl.TEXTURE_2D, imageTexture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, portrait);
      imageReady = true;
    };
    portrait.onerror = () => {
      if (disposed) {
        return;
      }
      setShowFallback(true);
    };
    portrait.src = imageSrc;

    const targetMouse = { x: 0.72, y: 0.48 };
    const smoothMouse = { x: targetMouse.x, y: targetMouse.y };
    const targetHover = { value: 0 };
    const smoothHover = { value: 0 };
    const handlePointerEnter = () => {
      targetHover.value = 1;
    };
    const resetMouse = () => {
      targetMouse.x = 0.72;
      targetMouse.y = 0.48;
      targetHover.value = 0;
    };

    const handlePointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();

      if (!rect.width || !rect.height) {
        return;
      }

      targetMouse.x = clamp01((event.clientX - rect.left) / rect.width);
      targetMouse.y = clamp01(1 - (event.clientY - rect.top) / rect.height);
    };

    canvas.addEventListener("pointerenter", handlePointerEnter);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", resetMouse);

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    let resizeObserver = null;
    let usesWindowResize = false;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(resizeCanvas);
      resizeObserver.observe(container);
    } else {
      usesWindowResize = true;
      window.addEventListener("resize", resizeCanvas);
    }
    resizeCanvas();

    const startTime = performance.now();
    let animationFrameId = 0;
    const renderFrame = (now) => {
      if (disposed) {
        return;
      }

      smoothMouse.x += (targetMouse.x - smoothMouse.x) * 0.08;
      smoothMouse.y += (targetMouse.y - smoothMouse.y) * 0.08;
      smoothHover.value += (targetHover.value - smoothHover.value) * 0.12;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, imageTexture);

      gl.uniform1i(imageLocation, 0);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, (now - startTime) * 0.001);
      gl.uniform2f(mouseLocation, smoothMouse.x, smoothMouse.y);
      gl.uniform1f(imageMixLocation, imageReady ? 1 : 0);
      gl.uniform1f(hoverMixLocation, smoothHover.value);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = window.requestAnimationFrame(renderFrame);
    };

    setShowFallback(false);
    animationFrameId = window.requestAnimationFrame(renderFrame);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrameId);

      canvas.removeEventListener("pointerenter", handlePointerEnter);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", resetMouse);

      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (usesWindowResize) {
        window.removeEventListener("resize", resizeCanvas);
      }

      portrait.onload = null;
      portrait.onerror = null;
      gl.deleteTexture(imageTexture);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [imageSrc]);

  return (
    <div ref={containerRef} className="hero-webgl-shell">
      <canvas
        ref={canvasRef}
        className={`hero-webgl-canvas${showFallback ? " is-hidden" : ""}`}
        aria-hidden={showFallback}
      />
      {showFallback && <img src={imageSrc} alt={alt} className="hero-webgl-fallback" />}
    </div>
  );
};
