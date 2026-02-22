import {
  buildCatBlocks,
  buildDateBlocks,
  buildFetchProjectsFinalBlocks,
  buildHelpBlocks,
  buildLsBlocks,
  buildOpenNotFoundBlocks,
  buildOpenUsageBlocks,
  buildPwdBlocks,
  buildSudoHireBlocks,
  buildThemeDefaultBlocks,
  buildThemeGoBlueBlocks,
  buildUnknownCommandBlocks,
  buildWhoAmIBlocks,
  getTerminalCatTargets,
  getTerminalCommandNames,
  getOpenTargetSuggestions,
  resolveOpenTarget,
} from "./commandDataAdapters";

const normalizeCommandToken = (value) => String(value || "").trim().toLowerCase();

export const executeTerminalCommand = ({ rawInput, currentPath }) => {
  const raw = String(rawInput || "");
  const trimmed = raw.trim();

  if (!trimmed) {
    return { type: "noop" };
  }

  const parts = trimmed.split(/\s+/);
  const command = normalizeCommandToken(parts[0]);
  const args = parts.slice(1);

  switch (command) {
    case "help":
      return { type: "output", blocks: buildHelpBlocks() };
    case "clear":
      return { type: "clear" };
    case "whoami":
      return { type: "output", blocks: buildWhoAmIBlocks() };
    case "pwd":
      return { type: "output", blocks: buildPwdBlocks(currentPath) };
    case "date":
      return { type: "output", blocks: buildDateBlocks() };
    case "ls":
      return { type: "output", blocks: buildLsBlocks() };
    case "cat": {
      const target = args.join(" ");
      return { type: "output", blocks: buildCatBlocks(target) };
    }
    case "open": {
      const rawTarget = args.join(" ");
      if (!rawTarget.trim()) {
        return { type: "output", blocks: buildOpenUsageBlocks() };
      }

      const resolved = resolveOpenTarget(rawTarget);
      if (!resolved) {
        return { type: "output", blocks: buildOpenNotFoundBlocks(rawTarget) };
      }

      return {
        type: "open-target",
        target: resolved,
        blocks: [{ kind: "line", text: resolved.successMessage, tone: "success" }],
      };
    }
    case "fetch": {
      if (normalizeCommandToken(args[0]) === "projects") {
        return { type: "async-sequence", sequenceKey: "fetch-projects" };
      }
      return {
        type: "output",
        blocks: [
          { kind: "line", text: "[ERROR] Usage: fetch projects", tone: "error" },
          { kind: "line", text: "Only `fetch projects` is available in this terminal.", tone: "muted" },
        ],
      };
    }
    case "sudo": {
      if (
        normalizeCommandToken(args[0]) === "hire" &&
        normalizeCommandToken(args[1]) === "mustafa" &&
        args.length === 2
      ) {
        return { type: "output", blocks: buildSudoHireBlocks() };
      }
      return {
        type: "output",
        blocks: [
          { kind: "line", text: "[ERROR] sudo is sandboxed in this environment.", tone: "error" },
          { kind: "line", text: "Try `sudo hire mustafa`.", tone: "muted" },
        ],
      };
    }
    case "theme": {
      const flag = normalizeCommandToken(args[0]);
      if (flag === "--goblue") {
        return { type: "theme-change", palette: "goblue", blocks: buildThemeGoBlueBlocks() };
      }
      if (flag === "--default") {
        return { type: "theme-change", palette: "default", blocks: buildThemeDefaultBlocks() };
      }
      return {
        type: "output",
        blocks: [
          { kind: "line", text: "[ERROR] Usage: theme --goblue", tone: "error" },
          { kind: "line", text: "Optional reset: theme --default", tone: "muted" },
        ],
      };
    }
    default:
      return { type: "output", blocks: buildUnknownCommandBlocks(command) };
  }
};

export const resolveTerminalAsyncSequence = ({ sequenceKey }) => {
  if (sequenceKey === "fetch-projects") {
    return { type: "output", blocks: buildFetchProjectsFinalBlocks() };
  }

  return {
    type: "output",
    blocks: [{ kind: "line", text: "[ERROR] Unknown async sequence.", tone: "error" }],
  };
};

const buildSuggestionBlocks = (label, values) => [
  { kind: "line", text: label, tone: "section" },
  { kind: "line", text: `  ${values.join("   ")}`, tone: "muted" },
];

export const getAutocompleteResolution = ({ rawInput }) => {
  const input = String(rawInput || "");
  const endsWithSpace = /\s$/.test(input);
  const trimmed = input.trim();

  if (!trimmed) {
    return { handled: false };
  }

  const tokens = trimmed.split(/\s+/);

  if (tokens.length === 1 && !endsWithSpace) {
    const prefix = normalizeCommandToken(tokens[0]);
    const candidates = getTerminalCommandNames().filter((name) => name.startsWith(prefix));

    if (!candidates.length) {
      return { handled: false };
    }
    if (candidates.length === 1) {
      return { handled: true, nextInput: `${candidates[0]} ` };
    }

    return {
      handled: true,
      nextInput: input,
      blocks: buildSuggestionBlocks("Command suggestions", candidates),
    };
  }

  if (normalizeCommandToken(tokens[0]) !== "cat") {
    if (normalizeCommandToken(tokens[0]) === "open") {
      if (tokens.length === 1 && endsWithSpace) {
        return {
          handled: true,
          nextInput: input,
          blocks: buildSuggestionBlocks("open targets", getOpenTargetSuggestions()),
        };
      }

      const rawTargetPrefix = endsWithSpace ? "" : tokens.slice(1).join(" ");
      const prefix = rawTargetPrefix.toLowerCase();
      const candidates = getOpenTargetSuggestions().filter((target) =>
        target.toLowerCase().startsWith(prefix)
      );

      if (!candidates.length) {
        return { handled: false };
      }

      if (candidates.length === 1) {
        return {
          handled: true,
          nextInput: `open ${candidates[0]}`,
        };
      }

      return {
        handled: true,
        nextInput: input,
        blocks: buildSuggestionBlocks("Open target suggestions", candidates),
      };
    }

    return { handled: false };
  }

  if (tokens.length === 1 && endsWithSpace) {
    return {
      handled: true,
      nextInput: input,
      blocks: buildSuggestionBlocks("cat targets", getTerminalCatTargets().slice(0, 12)),
    };
  }

  const rawTargetPrefix = endsWithSpace ? "" : tokens.slice(1).join(" ");
  const prefix = rawTargetPrefix.toLowerCase();
  const candidates = getTerminalCatTargets().filter((target) =>
    target.toLowerCase().startsWith(prefix)
  );

  if (!candidates.length) {
    return { handled: false };
  }

  if (candidates.length === 1) {
    return {
      handled: true,
      nextInput: `cat ${candidates[0]}`,
    };
  }

  return {
    handled: true,
    nextInput: input,
    blocks: buildSuggestionBlocks("File suggestions", candidates.slice(0, 14)),
  };
};
