import glassHoverSoft from "../../assets/sounds/glass-hover-soft.wav";
import glassTapSoft from "../../assets/sounds/glass-tap-soft.wav";
import glassTickOpen from "../../assets/sounds/glass-tick-open.wav";
import glassTickClose from "../../assets/sounds/glass-tick-close.wav";
import terminalOpenSoft from "../../assets/sounds/terminal-open-soft.wav";
import terminalCloseSoft from "../../assets/sounds/terminal-close-soft.wav";
import routeOpenAir from "../../assets/sounds/route-open-air.wav";
import routeBackAir from "../../assets/sounds/route-back-air.wav";
import soundEnableConfirm from "../../assets/sounds/sound-enable-confirm.wav";
import soundDisableSoft from "../../assets/sounds/sound-disable-soft.wav";

export const SOUND_ASSETS = {
  glassHoverSoft,
  glassTapSoft,
  glassTickOpen,
  glassTickClose,
  terminalOpenSoft,
  terminalCloseSoft,
  routeOpenAir,
  routeBackAir,
  soundEnableConfirm,
  soundDisableSoft,
};

export const SOUND_EVENT_REGISTRY = {
  "ui.card.hover-enter": {
    asset: "glassHoverSoft",
    volume: 0.2,
    cooldownMs: 150,
    poolSize: 4,
  },
  "ui.card.click": {
    asset: "glassTapSoft",
    volume: 0.34,
    cooldownMs: 50,
    poolSize: 5,
  },
  "ui.card.expand": {
    asset: "glassTickOpen",
    volume: 0.28,
    cooldownMs: 70,
    poolSize: 4,
  },
  "ui.card.collapse": {
    asset: "glassTickClose",
    volume: 0.26,
    cooldownMs: 70,
    poolSize: 4,
  },
  "ui.header.control-click": {
    asset: "glassTapSoft",
    volume: 0.24,
    cooldownMs: 70,
    poolSize: 4,
  },
  "ui.terminal.open": {
    asset: "terminalOpenSoft",
    volume: 0.28,
    cooldownMs: 120,
    poolSize: 4,
  },
  "ui.terminal.close": {
    asset: "terminalCloseSoft",
    volume: 0.25,
    cooldownMs: 100,
    poolSize: 4,
  },
  "ui.route.project-open": {
    asset: "routeOpenAir",
    volume: 0.17,
    cooldownMs: 180,
    poolSize: 3,
  },
  "ui.route.project-back": {
    asset: "routeBackAir",
    volume: 0.15,
    cooldownMs: 180,
    poolSize: 3,
  },
  "ui.sound.enabled": {
    asset: "soundEnableConfirm",
    volume: 0.23,
    cooldownMs: 120,
    poolSize: 3,
  },
  "ui.sound.disabled": {
    asset: "soundDisableSoft",
    volume: 0.2,
    cooldownMs: 120,
    poolSize: 3,
  },
};

export const getUniqueSoundAssetUrls = () =>
  Array.from(
    new Set(
      Object.values(SOUND_EVENT_REGISTRY)
        .map((config) => SOUND_ASSETS[config.asset])
        .filter(Boolean)
    )
  );

