# GEMINI.md

## Project Overview

This is a **React-based Personal Portfolio** website for Mustafa Ali Mirza. It is designed to be easily customizable and deployable, showcasing the user's career highlights, projects, skills, and resume. The application uses **React Bootstrap** for responsive layout and **EmailJS** for handling contact form submissions.

**Key Features:**
*   **Dynamic Content:** Most textual content and configuration are centralized in `src/content_option.js`.
*   **Routing:** Client-side routing via `react-router-dom` with page transitions.
*   **Contact Form:** Functional contact form integrated with EmailJS.
*   **Responsive Design:** Mobile-friendly layout using Bootstrap.

## Building and Running

The project uses `react-scripts` (Create React App). Ensure you have Node.js installed.

### Install Dependencies
```bash
npm install
# or
yarn install
```

### Development Server
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
```bash
npm start
# or
yarn start
```

### Production Build
Builds the app for production to the `build` folder.
```bash
npm run build
# or
yarn build
```

## Architecture & Key Files

### 1. Content Configuration (`src/content_option.js`)
**This is the most important file for content updates.** It exports objects containing:
*   `meta`: Site title and description.
*   `introdata`: Homepage hero section text.
*   `dataabout`: "About Myself" section.
*   `worktimeline`, `skills`, `milestones`: Data for the Resume/About pages.
*   `dataportfolio`: List of projects with images and links.
*   `contactConfig`: Configuration for the contact form (though see note below).
*   `socialprofils`: Social media links.

### 2. Routing (`src/app/routes.js`)
Defines the application routes:
*   `/`: Home
*   `/about`: About
*   `/contact`: Contact Us
*   `/portfolio`: Portfolio
*   `/resume`: Resume
*   `/api`: API Page

### 3. Pages (`src/pages/`)
Each directory (e.g., `home`, `about`, `contact`) typically contains:
*   `index.js`: The React component for the page.
*   `style.css`: Page-specific styles.

### 4. Components (`src/components/`)
Reusable UI elements like `socialicons` and `themetoggle`.

## Development Conventions

*   **Content Updates:** Prefer modifying `src/content_option.js` over hardcoding text in components whenever possible.
*   **Styling:** The project uses a mix of Bootstrap utility classes and custom CSS found in `style.css` files within component directories. Global styles are in `src/index.css` and `src/app/App.css`.
*   **Contact Form Discrepancy:**
    *   **Note:** While `src/content_option.js` contains a `contactConfig` object, the `ContactUs` component (`src/pages/contact/index.js`) currently **hardcodes** the EmailJS Service ID, Template ID, and Public Key.
    *   **Action:** When updating EmailJS credentials, you must update `src/pages/contact/index.js` directly, or refactor it to use the config file.

## Deployment
The project is configured for deployment on **Vercel**.
