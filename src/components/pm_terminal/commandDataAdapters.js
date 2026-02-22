import {
  contactConfig,
  dataportfolio,
  decisionLog,
  logotext,
  meta,
  operatingPrinciples,
  skills,
  socialprofils,
  worktimeline,
} from "../../content_option";

const line = (text, tone = "default") => ({ kind: "line", text, tone });
const spacer = () => ({ kind: "spacer" });
const link = (label, href, tone = "link") => ({ kind: "link", label, href, tone });

const normalizeToken = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\\/g, "/")
    .replace(/\s+/g, "-");

const deriveProjectStatus = (project) => {
  const sourceText = `${project.description || ""} ${project.details || ""}`.toLowerCase();
  if (sourceText.includes("concept") || sourceText.includes("independent")) {
    return "CONCEPT";
  }
  return "SHIPPED";
};

const STATUS_OVERRIDES = {
  "goblue-ai-redesign": "CONCEPT",
  "lantern-ai-walking-tour": "CONCEPT",
  "snowgo-community-platform": "CONCEPT",
};

const projectStatusFor = (project) =>
  STATUS_OVERRIDES[project.id] || deriveProjectStatus(project);

const topProjects = dataportfolio.slice(0, 6);

const projectFileAliasMap = (() => {
  const entries = new Map();

  const register = (alias, projectId) => {
    if (!alias) {
      return;
    }
    entries.set(normalizeToken(alias), projectId);
  };

  dataportfolio.forEach((project) => {
    register(project.id, project.id);
    register(`${project.id}.txt`, project.id);
    register(project.title, project.id);
    register(`${project.title}.txt`, project.id);

    const compactTitle = String(project.title || "").replace(/[^\w]+/g, "");
    register(compactTitle, project.id);
    register(`${compactTitle}.txt`, project.id);
  });

  register("goblue", "goblue-ai-redesign");
  register("goblue.txt", "goblue-ai-redesign");
  register("carforce", "carforce-crm");
  register("carforce.txt", "carforce-crm");
  register("whatsapp", "crm-whatsapp-integration");
  register("whatsapp.txt", "crm-whatsapp-integration");
  register("crm-whatsapp", "crm-whatsapp-integration");
  register("crm-whatsapp.txt", "crm-whatsapp-integration");

  return entries;
})();

const projectById = new Map(dataportfolio.map((project) => [project.id, project]));

const virtualFiles = [
  "resume.txt",
  "contact.txt",
  "projects.txt",
  "principles.txt",
  "decision-log.txt",
  "resume.pdf",
  ...dataportfolio.map((project) => `${project.id}.txt`),
];

export const terminalOutputBuilders = {
  line,
  spacer,
  link,
};

export const getTerminalCommandNames = () => [
  "help",
  "clear",
  "whoami",
  "pwd",
  "date",
  "ls",
  "cat",
  "open",
  "fetch",
  "sudo",
  "theme",
];

export const getTerminalCatTargets = () => [...new Set(virtualFiles)];

export const buildWelcomeBlocks = (initialPath) => [
  line("PM Terminal // hidden route unlocked", "accent"),
  line(`Session path: ${initialPath || "/"}`, "muted"),
  spacer(),
  line("Type `help` to see commands. Try `fetch projects` or `sudo hire mustafa`.", "muted"),
];

export const buildHelpBlocks = () => [
  line("Available commands", "accent"),
  spacer(),
  line("Core", "section"),
  line("  help               List available commands", "muted"),
  line("  clear              Clear terminal screen", "muted"),
  line("  whoami             Quick intro", "muted"),
  line("  pwd                Print current route path", "muted"),
  line("  date               Local date and time", "muted"),
  spacer(),
  line("Portfolio", "section"),
  line("  ls                 List virtual files and directories", "muted"),
  line("  cat <file>         Read a text summary (try `cat resume.txt`)", "muted"),
  line("  open <target>      Open a route or action (e.g. `open contact`)", "muted"),
  line("  fetch projects     Print structured project list", "muted"),
  line("  sudo hire mustafa  Easter egg with a hiring CTA", "muted"),
  spacer(),
  line("Theme", "section"),
  line("  theme --goblue     Switch terminal accent palette to maize/blue", "muted"),
];

export const buildWhoAmIBlocks = () => [
  line(
    "Mustafa Ali Mirza - Product Manager & Builder. Currently: Incoming @ UMich MSI.",
    "success"
  ),
  line(meta.description, "muted"),
];

export const buildPwdBlocks = (currentPath) => [line(currentPath || "/", "success")];

export const buildDateBlocks = () => [line(new Date().toLocaleString(), "success")];

export const buildLsBlocks = () => [
  line("about/   projects/   writing/   experiments/", "muted"),
  line("resume.txt   resume.pdf   contact.txt   principles.txt   decision-log.txt   projects.txt", "muted"),
  spacer(),
  line("projects/", "section"),
  ...topProjects.map((project) =>
    line(
      `  ${project.id}.txt  [${projectStatusFor(project)}]`,
      projectStatusFor(project) === "CONCEPT" ? "warning" : "success"
    )
  ),
];

export const buildResumeBlocks = () => {
  const blocks = [
    line(`${logotext} // resume.txt`, "accent"),
    spacer(),
    line("Recent roles", "section"),
    ...worktimeline.map((role) => line(`  ${role.date}  ${role.jobtitle} @ ${role.where}`, "muted")),
    spacer(),
    line("Strengths", "section"),
    ...skills.slice(0, 6).map((skill) => line(`  ${skill.name.padEnd(26, " ")} ${skill.value}%`, "muted")),
    spacer(),
    line("Open /resume for the full recruiter-readable version.", "muted"),
    link("Open Resume Page", "/resume"),
  ];

  return blocks;
};

export const buildContactBlocks = () => [
  line("contact.txt", "accent"),
  spacer(),
  line(contactConfig.description, "muted"),
  spacer(),
  line(`email: ${contactConfig.YOUR_EMAIL}`, "success"),
  line(`phone: ${contactConfig.YOUR_FONE}`, "muted"),
  spacer(),
  link("Open Contact Page", "/contact"),
  link("Email Mustafa", `mailto:${contactConfig.YOUR_EMAIL}`),
  link("LinkedIn", socialprofils.linkedin),
];

export const buildPrinciplesBlocks = () => [
  line("operating-principles.txt", "accent"),
  spacer(),
  ...operatingPrinciples.flatMap((item) => [
    line(`- ${item.principle}`, "section"),
    line(`  ${item.example}`, "muted"),
  ]),
];

export const buildDecisionLogBlocks = () => [
  line("decision-log.txt", "accent"),
  spacer(),
  ...decisionLog.flatMap((entry) => [
    line(`- ${entry.title}`, "section"),
    line(`  Call: ${entry.call}`, "muted"),
    line(`  Outcome: ${entry.outcome}`, "muted"),
    entry.projectId ? link(`  Open /project/${entry.projectId}`, `/project/${entry.projectId}`) : null,
    spacer(),
  ]).filter(Boolean),
];

export const buildProjectsBlocks = () => [
  line("projects.txt", "accent"),
  spacer(),
  ...dataportfolio.slice(0, 8).flatMap((project) => [
    line(`${project.id}`, "section"),
    line(`  title: ${project.title}`, "muted"),
    line(`  status: [${projectStatusFor(project)}]`, projectStatusFor(project) === "CONCEPT" ? "warning" : "success"),
    line(`  role: ${project.role}`, "muted"),
    line(`  timeline: ${project.timeline}`, "muted"),
    spacer(),
  ]),
];

const buildProjectBlocks = (project) => {
  const glance = Array.isArray(project.quickGlance) && project.quickGlance.length
    ? project.quickGlance.join(" | ")
    : "N/A";
  const tradeoffCount = Array.isArray(project.tradeoffs) ? project.tradeoffs.length : 0;

  const blocks = [
    line(`${project.id}.txt`, "accent"),
    spacer(),
    line(project.title, "section"),
    line(`status: [${projectStatusFor(project)}]`, projectStatusFor(project) === "CONCEPT" ? "warning" : "success"),
    line(`role: ${project.role || "N/A"}`, "muted"),
    line(`timeline: ${project.timeline || "N/A"}`, "muted"),
    line(`glance: ${glance}`, "muted"),
    spacer(),
    line(project.description || "", "muted"),
  ];

  if (project.details) {
    blocks.push(spacer(), line(project.details, "muted"));
  }

  if (tradeoffCount > 0) {
    blocks.push(spacer(), line(`tradeoffs: ${tradeoffCount} (see project page)`, "muted"));
  }

  blocks.push(spacer(), link(`Open /project/${project.id}`, `/project/${project.id}`));

  return blocks;
};

export const buildCatBlocks = (rawTarget) => {
  const target = String(rawTarget || "").trim();
  if (!target) {
    return [line("[ERROR] Usage: cat <file>", "error")];
  }

  const normalized = normalizeToken(target);

  if (normalized === "resume.txt") {
    return buildResumeBlocks();
  }
  if (normalized === "resume.pdf") {
    return [
      line("Binary file output suppressed: resume.pdf", "warning"),
      link("Open Resume Page", "/resume"),
    ];
  }
  if (normalized === "contact.txt") {
    return buildContactBlocks();
  }
  if (normalized === "principles.txt") {
    return buildPrinciplesBlocks();
  }
  if (normalized === "decision-log.txt") {
    return buildDecisionLogBlocks();
  }
  if (normalized === "projects.txt") {
    return buildProjectsBlocks();
  }

  const projectId = projectFileAliasMap.get(normalized);
  if (projectId && projectById.has(projectId)) {
    return buildProjectBlocks(projectById.get(projectId));
  }

  return [
    line(`[ERROR] File not found: ${target}`, "error"),
    line("Try `ls` to see available files.", "muted"),
  ];
};

export const buildUnknownCommandBlocks = (command) => [
  line(`[ERROR] Command not found: ${command}`, "error"),
  line("Type `help` to list commands.", "muted"),
];

export const resolveOpenTarget = (rawTarget) => {
  const target = normalizeToken(rawTarget);

  if (!target) {
    return null;
  }

  const openTargetMap = {
    contact: {
      href: "/contact",
      label: "Contact page",
      internal: true,
      successMessage: "Opening /contact...",
    },
    "/contact": {
      href: "/contact",
      label: "Contact page",
      internal: true,
      successMessage: "Opening /contact...",
    },
    about: {
      href: "/about",
      label: "About page",
      internal: true,
      successMessage: "Opening /about...",
    },
    "/about": {
      href: "/about",
      label: "About page",
      internal: true,
      successMessage: "Opening /about...",
    },
    home: {
      href: "/",
      label: "Home page",
      internal: true,
      successMessage: "Opening /...",
    },
    "/": {
      href: "/",
      label: "Home page",
      internal: true,
      successMessage: "Opening /...",
    },
    resume: {
      href: "/resume",
      label: "Resume page",
      internal: true,
      successMessage: "Opening /resume...",
    },
    "/resume": {
      href: "/resume",
      label: "Resume page",
      internal: true,
      successMessage: "Opening /resume...",
    },
    terminal: {
      href: "/terminal",
      label: "PM Terminal route",
      internal: true,
      successMessage: "Opening /terminal...",
    },
    "/terminal": {
      href: "/terminal",
      label: "PM Terminal route",
      internal: true,
      successMessage: "Opening /terminal...",
    },
    email: {
      href: `mailto:${contactConfig.YOUR_EMAIL}`,
      label: "Email Mustafa",
      internal: false,
      successMessage: "Opening mail client...",
    },
    mail: {
      href: `mailto:${contactConfig.YOUR_EMAIL}`,
      label: "Email Mustafa",
      internal: false,
      successMessage: "Opening mail client...",
    },
    linkedin: {
      href: socialprofils.linkedin,
      label: "LinkedIn",
      internal: false,
      successMessage: "Opening LinkedIn...",
    },
    github: {
      href: socialprofils.github,
      label: "GitHub",
      internal: false,
      successMessage: "Opening GitHub...",
    },
  };

  if (openTargetMap[target]) {
    return openTargetMap[target];
  }

  if (target.startsWith("/project/")) {
    return {
      href: target,
      label: target,
      internal: true,
      successMessage: `Opening ${target}...`,
    };
  }

  if (projectById.has(target)) {
    return {
      href: `/project/${target}`,
      label: `Project ${target}`,
      internal: true,
      successMessage: `Opening /project/${target}...`,
    };
  }

  if (target.startsWith("/") && !target.includes(" ")) {
    return {
      href: target,
      label: target,
      internal: true,
      successMessage: `Opening ${target}...`,
    };
  }

  return null;
};

export const getOpenTargetSuggestions = () => [
  "contact",
  "email",
  "about",
  "resume",
  "home",
  "linkedin",
  "github",
  "/contact",
  "/about",
  "/resume",
];

export const buildOpenUsageBlocks = () => [
  line("[ERROR] Usage: open <target>", "error"),
  line("Examples: `open contact`, `open email`, `open /resume`, `open goblue-ai-redesign`", "muted"),
];

export const buildOpenNotFoundBlocks = (rawTarget) => [
  line(`[ERROR] Unknown open target: ${rawTarget}`, "error"),
  line("Try: contact, email, about, resume, home, linkedin, github", "muted"),
];

export const buildSudoHireBlocks = () => [
  line("[ERROR] You lack sufficient equity to execute this command.", "error"),
  line("Try /contact instead. Or better: send a sharp role + scope note.", "muted"),
  spacer(),
  link("Open Contact Page", "/contact"),
  link("Email Mustafa", `mailto:${contactConfig.YOUR_EMAIL}`),
];

export const buildThemeGoBlueBlocks = () => [
  line("Hail to the Victors!", "maize"),
  line("Terminal palette switched to Go Blue mode.", "blue"),
];

export const buildThemeDefaultBlocks = () => [
  line("Terminal palette reset to default.", "success"),
];

export const buildFetchProjectsIntroBlocks = () => [
  line("fetch projects", "muted"),
  line("Initializing portfolio endpoint...", "muted"),
];

export const buildFetchProjectsProgressBlock = (label, percent) => [
  line(`[${String(percent).padStart(3, " ")}%] ${label}`, "muted"),
];

export const buildFetchProjectsFinalBlocks = () => {
  const rows = topProjects.map((project) => ({
    id: project.id,
    status: `[${projectStatusFor(project)}]`,
    role: project.role || "N/A",
    title: project.title,
  }));

  const blocks = [
    line("200 OK // /api/projects (simulated)", "success"),
    line("[", "muted"),
  ];

  rows.forEach((row, index) => {
    blocks.push(
      line(
        `  { id: "${row.id}", status: "${row.status}", role: "${row.role}", title: "${row.title}" }${
          index < rows.length - 1 ? "," : ""
        }`,
        "muted"
      )
    );
  });

  blocks.push(line("]", "muted"));

  return blocks;
};
