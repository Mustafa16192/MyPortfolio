const HOME_PROJECT_RETURN_SCROLL_KEY = "home-project-return-scroll-v1";
const HOME_PROJECT_RETURN_SCROLL_TTL_MS = 10 * 60 * 1000;

const getSessionStorageSafe = () => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.sessionStorage;
  } catch (error) {
    return null;
  }
};

export const isHomeProjectReturnScrollFresh = (payload) => {
  if (!payload || typeof payload !== "object") {
    return false;
  }
  if (!Number.isFinite(payload.y) || !Number.isFinite(payload.ts)) {
    return false;
  }
  return Date.now() - payload.ts <= HOME_PROJECT_RETURN_SCROLL_TTL_MS;
};

export const saveHomeProjectReturnScroll = ({ y, projectId = null }) => {
  const storage = getSessionStorageSafe();
  if (!storage || !Number.isFinite(y)) {
    return;
  }

  const payload = {
    y: Math.max(0, Math.round(y)),
    ts: Date.now(),
    fromPath: "/",
    section: "projects",
    projectId: typeof projectId === "string" ? projectId : null,
  };

  try {
    storage.setItem(HOME_PROJECT_RETURN_SCROLL_KEY, JSON.stringify(payload));
  } catch (error) {
    // Ignore private-mode/quota storage failures.
  }
};

export const clearHomeProjectReturnScroll = () => {
  const storage = getSessionStorageSafe();
  if (!storage) {
    return;
  }
  try {
    storage.removeItem(HOME_PROJECT_RETURN_SCROLL_KEY);
  } catch (error) {
    // Ignore storage failures.
  }
};

export const readHomeProjectReturnScroll = () => {
  const storage = getSessionStorageSafe();
  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(HOME_PROJECT_RETURN_SCROLL_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!isHomeProjectReturnScrollFresh(parsed)) {
      clearHomeProjectReturnScroll();
      return null;
    }
    return parsed;
  } catch (error) {
    clearHomeProjectReturnScroll();
    return null;
  }
};
