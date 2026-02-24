#!/usr/bin/env python3
import math
import os
import random
import struct
import wave


SR = 44100


def clamp(x, lo, hi):
    return lo if x < lo else hi if x > hi else x


def smoothstep(x):
    x = clamp(x, 0.0, 1.0)
    return x * x * (3.0 - 2.0 * x)


def env_exp(t, attack_s, decay_s):
    if t <= 0.0:
        return 0.0
    if attack_s <= 0.0:
        a = 1.0
    else:
        a = smoothstep(t / attack_s)
    if decay_s <= 0.0:
        d = 0.0
    else:
        d = math.exp(-t / decay_s)
    return a * d


def phase_chirp_linear(t, f0, f1, dur_s):
    if dur_s <= 0.0:
        return 0.0
    k = (f1 - f0) / dur_s
    return 2.0 * math.pi * (f0 * t + 0.5 * k * t * t)


def one_pole_alpha(cutoff_hz):
    cutoff_hz = max(1.0, float(cutoff_hz))
    return 1.0 - math.exp(-2.0 * math.pi * cutoff_hz / SR)


def lowpass(samples, cutoff_hz):
    a = one_pole_alpha(cutoff_hz)
    y = 0.0
    out = []
    for x in samples:
        y += a * (x - y)
        out.append(y)
    return out


def highpass(samples, cutoff_hz):
    lp = lowpass(samples, cutoff_hz)
    return [x - l for x, l in zip(samples, lp)]


def normalize(samples, peak=0.92):
    mx = max((abs(x) for x in samples), default=0.0)
    if mx <= 1e-9:
        return samples
    g = float(peak) / mx
    return [x * g for x in samples]


def fade_edges(samples, fade_ms=2.5):
    n = len(samples)
    fade_n = int(SR * (fade_ms / 1000.0))
    fade_n = max(1, min(fade_n, n // 2))
    out = samples[:]
    for i in range(fade_n):
        w = i / float(fade_n)
        out[i] *= w
        out[n - 1 - i] *= w
    return out


def write_wav_mono_16(path, samples):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    samples = normalize(fade_edges(samples))
    frames = bytearray()
    for x in samples:
        s = int(round(clamp(x, -1.0, 1.0) * 32767.0))
        frames += struct.pack("<h", s)
    with wave.open(path, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(frames)


def render(dur_ms, fn):
    n = int(SR * (dur_ms / 1000.0))
    out = [0.0] * n
    for i in range(n):
        t = i / SR
        out[i] = fn(t)
    return out


def make_glass_tick(seed, dur_ms=75, base_hz=1650.0, amp=0.65, tilt=0.0):
    rng = random.Random(seed)
    ratios = [1.0, 1.27, 1.73, 2.31, 2.88]
    phases = [rng.random() * 2.0 * math.pi for _ in ratios]

    def fn(t):
        dur_s = dur_ms / 1000.0
        e = env_exp(t, 0.0012, 0.028)
        sparkle = 0.0
        for ratio, ph in zip(ratios, phases):
            f = base_hz * ratio * (1.0 + tilt * (t / dur_s))
            sparkle += math.sin(2.0 * math.pi * f * t + ph)
        sparkle /= len(ratios)

        # transient: high-passed noise burst
        if t < 0.012:
            n = rng.uniform(-1.0, 1.0)
            transient = n * env_exp(t, 0.0005, 0.006)
        else:
            transient = 0.0

        return amp * (0.86 * sparkle * e + 0.22 * transient)

    samples = render(dur_ms, fn)
    samples = highpass(samples, 650.0)
    return samples


def make_thuck(seed, dur_ms=110, amp=0.9):
    rng = random.Random(seed)
    f0 = 265.0 + rng.uniform(-10.0, 10.0)
    f1 = 165.0 + rng.uniform(-8.0, 8.0)
    sub = 118.0 + rng.uniform(-6.0, 6.0)

    def fn(t):
        dur_s = dur_ms / 1000.0
        e = env_exp(t, 0.0018, 0.07)
        ph = phase_chirp_linear(min(t, dur_s), f0, f1, dur_s)
        body = 0.85 * math.sin(ph)
        body += 0.42 * math.sin(2.0 * math.pi * sub * t)

        # add a short "tick" at attack for definition
        tick = 0.0
        if t < 0.008:
            tick = rng.uniform(-1.0, 1.0) * env_exp(t, 0.00035, 0.0035)

        return amp * (body * e + 0.22 * tick)

    samples = render(dur_ms, fn)
    samples = lowpass(samples, 5200.0)
    return samples


def make_air(seed, dur_ms=230, amp=0.55, direction=1):
    rng = random.Random(seed)

    def fn(t):
        dur_s = dur_ms / 1000.0
        u = t / dur_s
        if direction < 0:
            u = 1.0 - u
        # airy envelope
        e = smoothstep(min(1.0, u / 0.22)) * math.exp(-t / 0.17)
        noise = rng.uniform(-1.0, 1.0)
        shimmer = math.sin(phase_chirp_linear(t, 980.0, 620.0, dur_s))
        return amp * (0.7 * noise + 0.3 * shimmer) * e

    samples = render(dur_ms, fn)
    samples = highpass(samples, 820.0)
    samples = lowpass(samples, 9800.0)
    return samples


def make_tilt_card_hover_ps(seed, dur_ms=185, amp=0.58):
    rng = random.Random(seed)
    base = 452.0 + rng.uniform(-10.0, 10.0)
    ratios = [1.0, 1.498, 2.01]
    phases = [rng.random() * 2.0 * math.pi for _ in ratios]
    detunes = [1.0, 1.0 + rng.uniform(-0.004, 0.004), 1.0 + rng.uniform(-0.003, 0.003)]

    def fn(t):
        dur_s = dur_ms / 1000.0
        swell = env_exp(t, 0.0055, 0.13)
        bloom = smoothstep(min(1.0, t / 0.045))
        micro_glide = 1.0 + 0.015 * math.exp(-t / 0.035)

        tone = 0.0
        for ratio, ph, detune in zip(ratios, phases, detunes):
            tone += math.sin(2.0 * math.pi * base * ratio * detune * micro_glide * t + ph)
        tone /= len(ratios)

        # subtle second harmonic swell for "grandeur" without becoming a pad
        grandeur = 0.24 * math.sin(2.0 * math.pi * (base * 0.75) * t + phases[0] * 0.5)
        grandeur *= env_exp(t, 0.01, 0.16)

        # airy shimmer that opens then decays
        shimmer_env = env_exp(t, 0.0015, 0.07) * (0.55 + 0.45 * bloom)
        shimmer = 0.0
        shimmer += 0.6 * math.sin(phase_chirp_linear(min(t, dur_s), 2100.0, 1650.0, dur_s))
        shimmer += 0.4 * math.sin(phase_chirp_linear(min(t, dur_s), 2850.0, 2250.0, dur_s))
        shimmer += 0.28 * rng.uniform(-1.0, 1.0)

        return amp * ((0.78 * tone * swell) + grandeur + (0.18 * shimmer * shimmer_env))

    samples = render(dur_ms, fn)
    samples = highpass(samples, 160.0)
    samples = lowpass(samples, 7200.0)
    return samples


def mix(*tracks):
    n = max((len(t) for t in tracks), default=0)
    out = [0.0] * n
    for t in tracks:
        for i, x in enumerate(t):
            out[i] += x
    return normalize(out, peak=0.9)


def main():
    out_dir = os.path.join("src", "assets", "sounds", "v2")

    assets = {
        "glass-hover-soft.wav": mix(
            make_glass_tick("hover", dur_ms=55, base_hz=1750.0, amp=0.55, tilt=-0.03)
        ),
        "tilt-card-hover-ps.wav": mix(
            make_tilt_card_hover_ps("tilt-card-hover", dur_ms=190, amp=0.6),
            make_air("tilt-card-hover-air", dur_ms=165, amp=0.12, direction=1),
        ),
        "glass-tap-soft.wav": mix(
            make_thuck("tap", dur_ms=95, amp=0.72),
            make_glass_tick("tap-glass", dur_ms=65, base_hz=1900.0, amp=0.35, tilt=-0.02),
        ),
        "glass-tick-open.wav": mix(
            make_glass_tick("open", dur_ms=80, base_hz=1620.0, amp=0.66, tilt=0.04)
        ),
        "glass-tick-close.wav": mix(
            make_glass_tick("close", dur_ms=80, base_hz=1580.0, amp=0.62, tilt=-0.05)
        ),
        "terminal-open-soft.wav": mix(
            make_thuck("term-open", dur_ms=140, amp=0.78),
            make_air("term-open-air", dur_ms=210, amp=0.22, direction=1),
        ),
        "terminal-close-soft.wav": mix(
            make_thuck("term-close", dur_ms=125, amp=0.74),
            make_air("term-close-air", dur_ms=180, amp=0.18, direction=-1),
        ),
        "sound-enable-confirm.wav": mix(
            make_glass_tick("enable-a", dur_ms=70, base_hz=1760.0, amp=0.55, tilt=0.03),
            [0.0] * int(SR * 0.03)
            + make_glass_tick("enable-b", dur_ms=85, base_hz=2140.0, amp=0.44, tilt=-0.01),
        ),
        "sound-disable-soft.wav": mix(make_thuck("disable", dur_ms=110, amp=0.62)),
    }

    for name, samples in assets.items():
        path = os.path.join(out_dir, name)
        write_wav_mono_16(path, samples)
        print(f"Wrote {path} ({len(samples) / SR:.3f}s)")


if __name__ == "__main__":
    main()
