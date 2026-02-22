import { useEffect } from "react";

const isEditableTarget = (target) => {
  if (!(target instanceof Element)) {
    return false;
  }

  const tagName = target.tagName?.toLowerCase();
  if (tagName === "input" || tagName === "textarea" || tagName === "select") {
    return true;
  }

  return target.isContentEditable || Boolean(target.closest("[contenteditable='true']"));
};

const isDesktopCapable = () => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }

  const desktopWidth = window.matchMedia("(min-width: 992px)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  return desktopWidth && !coarsePointer;
};

export const useGlobalTerminalShortcut = ({ onTrigger, enabled = true }) => {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (!isDesktopCapable()) {
        return;
      }

      if (event.defaultPrevented) {
        return;
      }

      if (!(event.metaKey || event.ctrlKey) || event.altKey) {
        return;
      }

      if (String(event.key || "").toLowerCase() !== "k") {
        return;
      }

      if (isEditableTarget(event.target)) {
        return;
      }

      event.preventDefault();
      onTrigger?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onTrigger]);
};

