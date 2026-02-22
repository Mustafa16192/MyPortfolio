# Product Requirements Document: "The PM Terminal" Easter Egg

## 1. Overview

**Product Name:** PM Terminal (Easter Egg)
**Platform:** Web (Portfolio Site - React/GSAP)
**Status:** Discovery / Ideation
**Target Audience:** Technical Recruiters, Hiring Managers, Engineers, and Design Partners.

### 1.1 Objective
To embed a delightful, hidden Command Line Interface (CLI) within the portfolio. This feature serves as a high-signal "Easter Egg" that demonstrates technical literacy, product thinking, and a deep appreciation for hacker culture and developer workflows. It signals: *"I don't just write PRDs; I understand the systems they define."*

### 1.2 The "Why"
Most PM portfolios are static documents or over-designed case studies. The PM Terminal breaks the fourth wall. By giving users a familiar developer tool (the CLI) loaded with personalized, playful commands, we create a memorable micro-interaction that differentiates the candidate from the crowd. It’s an immediate conversation starter.

---

## 2. User Experience & Design

### 2.1 Activation & Entry
The terminal must be hidden but discoverable by those who know the language of the web.

*   **Trigger 1 (Keyboard):** `Cmd + K` (Mac) or `Ctrl + K` (Windows/Linux). This is the universal shortcut for command palettes/search in modern apps (Slack, Notion, Linear, VScode).
*   **Trigger 2 (Navigation):** Navigating to the hidden route `/terminal`.
*   **Animation:** The terminal should invoke with a smooth, snappy GSAP animation. It shouldn't just "appear"; it should slide down from the top (like Quake console) or expand from the center with a slight CRT screen flicker or a clean, modern glassmorphic blur depending on the active theme.

### 2.2 Visual Language
The terminal should feel like a premium, modern developer tool, not a raw MS-DOS prompt. Think *Warp*, *Hyper*, or *iTerm2* with a beautifully customized Zsh theme.

*   **Typography:** A crisp, legible monospace font (e.g., Fira Code, JetBrains Mono, or SF Mono).
*   **Color Palette:**
    *   *Dark Mode:* Deep charcoal/obsidian background `#0d1117`, vibrant syntax highlighting (neon green for success, cyberpunk pink for errors, electric blue for the prompt).
    *   *Light Mode:* (Optional, but terminal usually stays dark for the vibe. If implemented, off-white background with bold, high-contrast text).
*   **Prompt String:** `mustafa@portfolio ~/buildwithmustafa % ` or `➜  ~ `
*   **Cursor:** A classic blinking block `█` or underline `_`.

---

## 3. Features & Command Specifications

The core of the terminal is the commands it accepts. It must simulate a real shell environment but respond with portfolio-specific data.

### 3.1 Core Commands (The Essentials)

| Command | Action / Response | Description |
| :--- | :--- | :--- |
| `help` | Prints a stylized list of available commands. | The onboarding mechanism. |
| `clear` | Clears the terminal screen buffer. | Standard CLI behavior. |
| `whoami` | Returns: `Mustafa Ali Mirza - Product Manager & Builder. Currently: Incoming @ UMich MSI.` | A quick elevator pitch. |
| `pwd` | Returns the current route path (e.g., `/home` or `/portfolio/carforce`). | Contextual awareness. |
| `date` | Returns the current local date and time. | Standard CLI behavior. |

### 3.2 Product & Portfolio Commands (The Flex)

| Command | Action / Response | Description |
| :--- | :--- | :--- |
| `ls` | Lists sections of the site or current projects (e.g., `about/`, `projects/`, `resume.pdf`). | Simulates directory listing. |
| `cat <file>` | E.g., `cat resume.txt`. Outputs a stylized, text-only summary of the resume or a specific project. | Bypasses the UI to read content directly. |
| `fetch projects` | Initiates a fake "loading" sequence (progress bar or spinner), then outputs a JSON-like or tabular list of top projects (CarForce, GoBlue AI, etc.) with their status (`[SHIPPED]`). | Shows data structuring and API mentality. |
| `sudo hire mustafa` | **Easter Egg within an Easter Egg.** Returns a playful access denied or a direct link to the `mailto:` or contact page. E.g., `[ERROR] You lack sufficient equity to execute this command. Try /contact instead.` or `Initiating contract generation... just kidding, email me.` | Pure personality. |

### 3.3 The "Go Blue" Integration

| Command | Action / Response | Description |
| :--- | :--- | :--- |
| `theme --goblue` | Changes the terminal's syntax highlighting to Maize (`#FFCB05`) and Blue (`#00274C`). Prints `Hail to the Victors!`. | A nod to the upcoming UMich chapter. |

### 3.4 Interactive Elements (Optional but highly recommended)
*   **Autocomplete:** Hitting `Tab` should auto-complete available commands (e.g., typing `wh` + `Tab` -> `whoami`).
*   **Command History:** Using the `Up` and `Down` arrow keys should cycle through previously entered commands.

---

## 4. Technical Implementation Notes

### 4.1 Architecture
*   **State Management:** React state (`useState`, `useRef`) to manage the array of command history (input + output pairs) and the current input string.
*   **Input Handling:** A hidden `<input>` field or a controlled content-editable `<div>` that captures keystrokes, specifically listening for `Enter` (to submit), `Tab` (to complete), and Arrows (for history).
*   **Command Parser:** A utility function or simple switch statement that takes the raw string, splits it into the command and arguments, and returns the appropriate JSX response block.

### 4.2 Libraries
*   While we *could* use a heavy terminal emulation library, building a bespoke, lightweight React component is preferred to maintain total control over the styling, GSAP animations, and integration with the existing `content_option.js` data.
*   *Framer Motion / GSAP:* Use for the entrance/exit animations of the terminal overlay itself.

### 4.3 Security & Constraints
*   **No Real Execution:** This is entirely client-side simulation. No actual shell commands are executed.
*   **Sanitization:** Ensure user input is sanitized if reflected back into the DOM to prevent basic XSS (though mostly harmless on a static portfolio, it's good practice).
*   **Mobile Experience:** The terminal is primarily a desktop flex. On mobile, `Cmd+K` is impossible. The `/terminal` route should either render a simplified, touch-friendly version (with a soft keyboard prompt) or politely display a message like *"The terminal is best experienced on a larger screen."*

---

## 5. Success Metrics

Since this is an Easter Egg, standard engagement metrics (DAU/MAU) don't apply. We measure success by:
1.  **The "Smile" Metric:** Qualitative feedback from interviews or messages ("I loved the hidden terminal!").
2.  **Time on Site:** A slight increase in session duration for users who discover and interact with the CLI.
3.  **Discovery Rate:** Tracking how many sessions fire the `Cmd+K` event or visit `/terminal` (can be logged via basic analytics).

---
*Document prepared for Mustafa Ali Mirza. v1.0. Status: Ready for Development.*
