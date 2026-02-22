export const setupPremiumTiltCards = (cards, options = {}) => {
  const cardList = Array.isArray(cards) ? cards.filter(Boolean) : [];
  if (!cardList.length) {
    return () => {};
  }

  const maxRotateX = Number.isFinite(options.maxRotateX) ? options.maxRotateX : 4;
  const maxRotateY = Number.isFinite(options.maxRotateY) ? options.maxRotateY : 5;
  const easing = Number.isFinite(options.easing) ? options.easing : 0.16;
  const defaultEdgeAlpha = Number.isFinite(options.defaultEdgeAlpha)
    ? options.defaultEdgeAlpha
    : 0.05;
  const defaultSpecAlpha = Number.isFinite(options.defaultSpecAlpha)
    ? options.defaultSpecAlpha
    : 0.08;

  const cardStates = cardList.map((card) => {
    const state = {
      card,
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0,
      targetLX: 50,
      targetLY: 50,
      currentLX: 50,
      currentLY: 50,
      targetEdge: defaultEdgeAlpha,
      currentEdge: defaultEdgeAlpha,
      targetSpec: defaultSpecAlpha,
      currentSpec: defaultSpecAlpha,
      targetSpark: 0,
      currentSpark: 0,
      rafId: 0,
    };

    card.style.setProperty("--lx", "50%");
    card.style.setProperty("--ly", "50%");
    card.style.setProperty("--edge-alpha", String(defaultEdgeAlpha));
    card.style.setProperty("--spec-alpha", String(defaultSpecAlpha));
    card.style.setProperty("--spark-shift", "0%");

    const stopFrame = () => {
      if (state.rafId) {
        cancelAnimationFrame(state.rafId);
        state.rafId = 0;
      }
    };

    const animate = () => {
      state.currentX += (state.targetX - state.currentX) * easing;
      state.currentY += (state.targetY - state.currentY) * easing;
      state.currentLX += (state.targetLX - state.currentLX) * easing;
      state.currentLY += (state.targetLY - state.currentLY) * easing;
      state.currentEdge += (state.targetEdge - state.currentEdge) * easing;
      state.currentSpec += (state.targetSpec - state.currentSpec) * easing;
      state.currentSpark += (state.targetSpark - state.currentSpark) * easing;

      const nearTiltTarget =
        Math.abs(state.targetX - state.currentX) < 0.02 &&
        Math.abs(state.targetY - state.currentY) < 0.02;
      const nearLightTarget =
        Math.abs(state.targetLX - state.currentLX) < 0.08 &&
        Math.abs(state.targetLY - state.currentLY) < 0.08 &&
        Math.abs(state.targetEdge - state.currentEdge) < 0.003 &&
        Math.abs(state.targetSpec - state.currentSpec) < 0.003 &&
        Math.abs(state.targetSpark - state.currentSpark) < 0.05;

      if (nearTiltTarget) {
        state.currentX = state.targetX;
        state.currentY = state.targetY;
      }
      if (nearLightTarget) {
        state.currentLX = state.targetLX;
        state.currentLY = state.targetLY;
        state.currentEdge = state.targetEdge;
        state.currentSpec = state.targetSpec;
        state.currentSpark = state.targetSpark;
      }

      if (Math.abs(state.currentX) < 0.01 && Math.abs(state.currentY) < 0.01) {
        state.card.style.transform = "";
      } else {
        state.card.style.transform = `perspective(980px) rotateX(${state.currentX.toFixed(
          3
        )}deg) rotateY(${state.currentY.toFixed(3)}deg)`;
      }

      state.card.style.setProperty("--lx", `${state.currentLX.toFixed(2)}%`);
      state.card.style.setProperty("--ly", `${state.currentLY.toFixed(2)}%`);
      state.card.style.setProperty("--edge-alpha", state.currentEdge.toFixed(3));
      state.card.style.setProperty("--spec-alpha", state.currentSpec.toFixed(3));
      state.card.style.setProperty("--spark-shift", `${state.currentSpark.toFixed(2)}%`);

      if (
        nearTiltTarget &&
        nearLightTarget &&
        state.targetX === 0 &&
        state.targetY === 0
      ) {
        state.card.classList.remove("is-tilting");
        stopFrame();
        return;
      }

      state.rafId = requestAnimationFrame(animate);
    };

    const startFrame = () => {
      if (!state.rafId) {
        state.rafId = requestAnimationFrame(animate);
      }
    };

    const handlePointerMove = (event) => {
      const bounds = state.card.getBoundingClientRect();
      const relativeX = (event.clientX - bounds.left) / bounds.width;
      const relativeY = (event.clientY - bounds.top) / bounds.height;
      const clampedX = Math.min(Math.max(relativeX, 0), 1);
      const clampedY = Math.min(Math.max(relativeY, 0), 1);
      const dx = clampedX - 0.5;
      const dy = clampedY - 0.5;
      const distanceFromCenter = Math.min(
        1,
        Math.sqrt(dx * dx + dy * dy) * 1.7
      );

      state.targetY = dx * maxRotateY * 2;
      state.targetX = -dy * maxRotateX * 2;
      state.targetLX = clampedX * 100;
      state.targetLY = clampedY * 100;
      state.targetEdge = 0.06 + distanceFromCenter * 0.16;
      state.targetSpec =
        0.09 +
        Math.min(1, (Math.abs(state.targetX) + Math.abs(state.targetY)) / 18) * 0.18;
      state.targetSpark = dx * 7;
      state.card.classList.add("is-tilting");
      startFrame();
    };

    const handlePointerEnter = (event) => {
      handlePointerMove(event);
    };

    const handlePointerLeave = () => {
      state.targetX = 0;
      state.targetY = 0;
      state.targetLX = 50;
      state.targetLY = 50;
      state.targetEdge = defaultEdgeAlpha;
      state.targetSpec = defaultSpecAlpha;
      state.targetSpark = 0;
      startFrame();
    };

    state.handlePointerEnter = handlePointerEnter;
    state.handlePointerMove = handlePointerMove;
    state.handlePointerLeave = handlePointerLeave;

    card.addEventListener("pointerenter", handlePointerEnter);
    card.addEventListener("pointermove", handlePointerMove);
    card.addEventListener("pointerleave", handlePointerLeave);

    return state;
  });

  return () => {
    cardStates.forEach((state) => {
      state.card.removeEventListener("pointerenter", state.handlePointerEnter);
      state.card.removeEventListener("pointermove", state.handlePointerMove);
      state.card.removeEventListener("pointerleave", state.handlePointerLeave);
      if (state.rafId) {
        cancelAnimationFrame(state.rafId);
      }
      state.card.classList.remove("is-tilting");
      state.card.style.transform = "";
      state.card.style.removeProperty("--lx");
      state.card.style.removeProperty("--ly");
      state.card.style.removeProperty("--edge-alpha");
      state.card.style.removeProperty("--spec-alpha");
      state.card.style.removeProperty("--spark-shift");
    });
  };
};
