import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { Link, useNavigate } from "react-router-dom";
import {
  buildFetchProjectsIntroBlocks,
  buildFetchProjectsProgressBlock,
  buildWelcomeBlocks,
} from "./commandDataAdapters";
import {
  executeTerminalCommand,
  getAutocompleteResolution,
  resolveTerminalAsyncSequence,
} from "./commandEngine";
import "./style.css";

const OVERLAY_Z_INDEX = 1000005;

const PROMPT_HOST = "mustafa@portfolio";
const PROMPT_REPO = "~/buildwithmustafa";

const normalizePath = (value) => {
  const path = String(value || "/").trim();
  return path || "/";
};

const isInternalHref = (href) => String(href || "").startsWith("/");
const shouldOpenInNewTab = (href) => {
  const value = String(href || "");
  if (!value) {
    return false;
  }

  if (isInternalHref(value) || value.startsWith("mailto:") || value.startsWith("tel:")) {
    return false;
  }

  return true;
};

const initialSessionEntries = (initialPath) => [
  {
    id: "boot-output",
    kind: "output",
    blocks: buildWelcomeBlocks(initialPath),
  },
];

const Prompt = ({ currentPath, className = "" }) => (
  <span className={`pm_terminal_prompt ${className}`.trim()} aria-hidden="true">
    <span className="pm_terminal_prompt_host">{PROMPT_HOST}</span>
    <span className="pm_terminal_prompt_repo">{PROMPT_REPO}</span>
    <span className="pm_terminal_prompt_path">{currentPath}</span>
    <span className="pm_terminal_prompt_symbol">%</span>
  </span>
);

export const PmTerminalShell = ({
  mode = "page",
  initialPath = "/terminal",
  isOpen = true,
  onRequestClose,
  onCloseComplete,
}) => {
  const navigate = useNavigate();
  const currentPath = useMemo(() => normalizePath(initialPath), [initialPath]);
  const [entries, setEntries] = useState(() => initialSessionEntries(currentPath));
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const [activePalette, setActivePalette] = useState("default");
  const [busySequence, setBusySequence] = useState(null);

  const historyDraftRef = useRef("");
  const idCounterRef = useRef(1);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const overlayRef = useRef(null);
  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const closeTweenRef = useRef(null);
  const mountedRef = useRef(true);
  const timeoutIdsRef = useRef([]);
  const closeCompleteCalledRef = useRef(false);

  const nextId = useCallback((prefix) => {
    const id = `${prefix}-${idCounterRef.current}`;
    idCounterRef.current += 1;
    return id;
  }, []);

  const appendOutputBlocks = useCallback(
    (blocks) => {
      if (!blocks || !blocks.length) {
        return;
      }

      setEntries((prev) => [
        ...prev,
        {
          id: nextId("output"),
          kind: "output",
          blocks,
        },
      ]);
    },
    [nextId]
  );

  const appendCommandLine = useCallback(
    (rawText) => {
      setEntries((prev) => [
        ...prev,
        {
          id: nextId("command"),
          kind: "command",
          text: rawText,
          path: currentPath,
        },
      ]);
    },
    [currentPath, nextId]
  );

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      timeoutIdsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutIdsRef.current = [];
      if (closeTweenRef.current) {
        closeTweenRef.current.kill();
        closeTweenRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [entries, inputValue, busySequence]);

  const runAsyncFetchProjects = useCallback(async () => {
    setBusySequence("fetch-projects");
    appendOutputBlocks(buildFetchProjectsIntroBlocks());

    const wait = (ms) =>
      new Promise((resolve) => {
        const timeoutId = window.setTimeout(() => {
          timeoutIdsRef.current = timeoutIdsRef.current.filter((id) => id !== timeoutId);
          resolve();
        }, ms);
        timeoutIdsRef.current.push(timeoutId);
      });

    const steps = [
      { label: "Resolving project manifest...", percent: 24, delay: 140 },
      { label: "Hydrating product metadata...", percent: 61, delay: 180 },
      { label: "Formatting recruiter-safe payload...", percent: 100, delay: 220 },
    ];

    for (const step of steps) {
      await wait(step.delay);
      if (!mountedRef.current) {
        return;
      }
      appendOutputBlocks(buildFetchProjectsProgressBlock(step.label, step.percent));
    }

    await wait(120);
    if (!mountedRef.current) {
      return;
    }

    const result = resolveTerminalAsyncSequence({ sequenceKey: "fetch-projects" });
    if (result.type === "output") {
      appendOutputBlocks(result.blocks);
    }

    setBusySequence(null);
  }, [appendOutputBlocks]);

  const submitCommand = useCallback(
    (rawValue) => {
      const raw = String(rawValue || "");
      const trimmed = raw.trim();

      appendCommandLine(raw);
      setInputValue("");
      setHistoryIndex(null);
      historyDraftRef.current = "";

      if (!trimmed) {
        return;
      }

      setCommandHistory((prev) => [...prev, trimmed]);

      if (busySequence) {
        appendOutputBlocks([
          { kind: "line", text: "[WARN] Busy processing previous command...", tone: "warning" },
        ]);
        return;
      }

      const result = executeTerminalCommand({
        rawInput: trimmed,
        currentPath,
      });

      if (result.type === "noop") {
        return;
      }

      if (result.type === "clear") {
        setEntries([]);
        return;
      }

      if (result.type === "theme-change") {
        setActivePalette(result.palette || "default");
        appendOutputBlocks(result.blocks || []);
        return;
      }

      if (result.type === "output") {
        appendOutputBlocks(result.blocks || []);
        return;
      }

      if (result.type === "open-target") {
        appendOutputBlocks(result.blocks || []);

        const target = result.target;
        if (!target?.href) {
          return;
        }

        if (target.internal) {
          navigate(target.href);
          if (mode === "overlay") {
            onRequestClose?.();
          }
          return;
        }

        if (typeof window !== "undefined") {
          window.open(
            target.href,
            target.href.startsWith("mailto:") || target.href.startsWith("tel:")
              ? "_self"
              : "_blank",
            target.href.startsWith("mailto:") || target.href.startsWith("tel:")
              ? undefined
              : "noopener,noreferrer"
          );
        }
        return;
      }

      if (result.type === "async-sequence" && result.sequenceKey === "fetch-projects") {
        runAsyncFetchProjects();
      }
    },
    [
      appendCommandLine,
      appendOutputBlocks,
      busySequence,
      currentPath,
      mode,
      navigate,
      onRequestClose,
      runAsyncFetchProjects,
    ]
  );

  const handleInputKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submitCommand(inputValue);
        return;
      }

      if (event.key === "Escape") {
        if (mode === "overlay") {
          event.preventDefault();
          onRequestClose?.();
          return;
        }

        if (inputValue) {
          event.preventDefault();
          setInputValue("");
          setHistoryIndex(null);
          historyDraftRef.current = "";
        }
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        const completion = getAutocompleteResolution({ rawInput: inputValue });
        if (!completion.handled) {
          return;
        }
        if (typeof completion.nextInput === "string") {
          setInputValue(completion.nextInput);
        }
        if (completion.blocks?.length) {
          appendOutputBlocks(completion.blocks);
        }
        return;
      }

      if (event.key === "ArrowUp") {
        if (!commandHistory.length) {
          return;
        }
        event.preventDefault();

        setHistoryIndex((prev) => {
          if (prev === null) {
            historyDraftRef.current = inputValue;
            const nextIndex = commandHistory.length - 1;
            setInputValue(commandHistory[nextIndex]);
            return nextIndex;
          }

          const nextIndex = Math.max(0, prev - 1);
          setInputValue(commandHistory[nextIndex]);
          return nextIndex;
        });
        return;
      }

      if (event.key === "ArrowDown") {
        if (!commandHistory.length) {
          return;
        }

        if (historyIndex === null) {
          return;
        }

        event.preventDefault();
        setHistoryIndex((prev) => {
          if (prev === null) {
            return null;
          }

          if (prev >= commandHistory.length - 1) {
            setInputValue(historyDraftRef.current || "");
            historyDraftRef.current = "";
            return null;
          }

          const nextIndex = prev + 1;
          setInputValue(commandHistory[nextIndex]);
          return nextIndex;
        });
      }
    },
    [
      appendOutputBlocks,
      commandHistory,
      historyIndex,
      inputValue,
      mode,
      onRequestClose,
      submitCommand,
    ]
  );

  const handleShellPointerDown = useCallback((event) => {
    const tagName = event.target?.tagName?.toLowerCase();
    if (tagName === "a" || tagName === "button" || tagName === "input") {
      return;
    }
    focusInput();
  }, [focusInput]);

  useLayoutEffect(() => {
    if (mode !== "overlay") {
      return undefined;
    }

    const overlayEl = overlayRef.current;
    const backdropEl = backdropRef.current;
    const panelEl = panelRef.current;

    if (!overlayEl || !backdropEl || !panelEl) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }

    closeCompleteCalledRef.current = false;

    if (isOpen) {
      overlayEl.style.pointerEvents = "auto";

      if (prefersReducedMotion) {
        gsap.set(overlayEl, { autoAlpha: 1 });
        gsap.set(backdropEl, { autoAlpha: 1 });
        gsap.set(panelEl, { autoAlpha: 1, y: 0, scale: 1 });
        focusInput();
        return undefined;
      }

      gsap.set(overlayEl, { autoAlpha: 1 });
      gsap.set(backdropEl, { autoAlpha: 0 });
      gsap.set(panelEl, {
        autoAlpha: 0,
        y: -20,
        scale: 0.995,
        transformPerspective: 1000,
        force3D: true,
      });

      closeTweenRef.current = gsap.timeline().to(backdropEl, {
        autoAlpha: 1,
        duration: 0.2,
        ease: "power2.out",
      }).to(
        panelEl,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.28,
          ease: "power3.out",
          onComplete: focusInput,
        },
        0.02
      );

      return () => {
        closeTweenRef.current?.kill();
      };
    }

    if (prefersReducedMotion) {
      overlayEl.style.pointerEvents = "none";
      gsap.set(overlayEl, { autoAlpha: 0 });
      gsap.set(backdropEl, { autoAlpha: 0 });
      gsap.set(panelEl, { autoAlpha: 0, y: -10, scale: 0.995 });
      if (!closeCompleteCalledRef.current) {
        closeCompleteCalledRef.current = true;
        onCloseComplete?.();
      }
      return undefined;
    }

    closeTweenRef.current = gsap.timeline({
      onComplete: () => {
        overlayEl.style.pointerEvents = "none";
        if (!closeCompleteCalledRef.current) {
          closeCompleteCalledRef.current = true;
          onCloseComplete?.();
        }
      },
    }).to(panelEl, {
      autoAlpha: 0,
      y: -14,
      scale: 0.992,
      duration: 0.18,
      ease: "power2.inOut",
    }).to(
      backdropEl,
      {
        autoAlpha: 0,
        duration: 0.16,
        ease: "power2.out",
      },
      0.04
    ).to(
      overlayEl,
      {
        autoAlpha: 0,
        duration: 0.01,
      },
      ">-0.01"
    );

    return () => {
      closeTweenRef.current?.kill();
    };
  }, [focusInput, isOpen, mode, onCloseComplete]);

  const renderBlock = useCallback((block, index) => {
    if (!block) {
      return null;
    }

    if (block.kind === "spacer") {
      return <div key={`sp-${index}`} className="pm_terminal_spacer" aria-hidden="true" />;
    }

    if (block.kind === "link") {
      if (isInternalHref(block.href)) {
        return (
          <div
            key={`lnk-${index}`}
            className={`pm_terminal_line pm_terminal_line_link pm_terminal_tone_${block.tone || "link"}`}
          >
            <Link
              to={block.href}
              onClick={() => {
                if (mode === "overlay") {
                  onRequestClose?.();
                }
              }}
            >
              {block.label}
            </Link>
          </div>
        );
      }

      return (
        <div
          key={`lnk-${index}`}
          className={`pm_terminal_line pm_terminal_line_link pm_terminal_tone_${block.tone || "link"}`}
        >
          <a
            href={block.href}
            target={shouldOpenInNewTab(block.href) ? "_blank" : undefined}
            rel={shouldOpenInNewTab(block.href) ? "noopener noreferrer" : undefined}
          >
            {block.label}
          </a>
        </div>
      );
    }

    return (
      <div
        key={`line-${index}`}
        className={`pm_terminal_line pm_terminal_tone_${block.tone || "default"}`}
      >
        {block.text}
      </div>
    );
  }, [mode, onRequestClose]);

  const shellInner = (
    <section
      className={`pm_terminal_shell pm_terminal_mode_${mode} pm_terminal_palette_${activePalette}`}
      data-palette={activePalette}
      onMouseDown={handleShellPointerDown}
      aria-label="PM Terminal"
      aria-live="off"
    >
      <header className="pm_terminal_header">
        <div className="pm_terminal_traffic" aria-hidden="true">
          <span className="pm_terminal_dot pm_terminal_dot_close" />
          <span className="pm_terminal_dot pm_terminal_dot_warn" />
          <span className="pm_terminal_dot pm_terminal_dot_ok" />
        </div>
        <div className="pm_terminal_header_meta">
          <div className="pm_terminal_header_title">PM Terminal</div>
          <div className="pm_terminal_header_subtitle">
            {mode === "overlay" ? "Cmd/Ctrl+K to open • Esc to close" : "Hidden route • /terminal"}
          </div>
        </div>
        {mode === "overlay" ? (
          <button
            type="button"
            className="pm_terminal_close_btn"
            onClick={onRequestClose}
            aria-label="Close PM Terminal"
          >
            Esc
          </button>
        ) : null}
      </header>

      <div className="pm_terminal_screen" ref={scrollRef} role="log" aria-live="polite">
        {entries.map((entry) => {
          if (entry.kind === "command") {
            return (
              <div key={entry.id} className="pm_terminal_entry pm_terminal_entry_command">
                <Prompt currentPath={entry.path || currentPath} />
                <span className="pm_terminal_command_text">{entry.text}</span>
              </div>
            );
          }

          return (
            <div key={entry.id} className="pm_terminal_entry pm_terminal_entry_output">
              {entry.blocks.map(renderBlock)}
            </div>
          );
        })}

        {busySequence ? (
          <div className="pm_terminal_busy_hint" aria-live="polite">
            processing...
          </div>
        ) : null}
      </div>

      <div className="pm_terminal_input_row">
        <Prompt currentPath={currentPath} className="pm_terminal_prompt_input" />
        <label className="pm_terminal_input_label">
          <span className="sr-only">Terminal command input</span>
          <input
            ref={inputRef}
            type="text"
            className="pm_terminal_input"
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value);
              if (historyIndex !== null) {
                setHistoryIndex(null);
              }
            }}
            onKeyDown={handleInputKeyDown}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            aria-label="PM Terminal input"
          />
        </label>
      </div>
    </section>
  );

  if (mode === "overlay") {
    return (
      <div
        ref={overlayRef}
        className="pm_terminal_overlay"
        role="dialog"
        aria-modal="true"
        aria-label="PM Terminal"
        style={{ zIndex: OVERLAY_Z_INDEX }}
      >
        <div
          ref={backdropRef}
          className="pm_terminal_backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onRequestClose?.();
            }
          }}
        />
        <div ref={panelRef} className="pm_terminal_overlay_panel">
          {shellInner}
        </div>
      </div>
    );
  }

  return <div className="pm_terminal_page_frame">{shellInner}</div>;
};

export default PmTerminalShell;
