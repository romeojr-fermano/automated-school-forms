<!-- PROJECT LOGO -->
<center>

# AGENTS.md

This file contains project-specific guidelines for AI coding agents (like Cursor, GitHub Copilot, etc.) working on this repository.

---

## 🛠️ Build & Run Commands

| Command              | Description                            |
| -------------------- | -------------------------------------- |
| `npm start`          | Start Electron app in development mode |
| `npm run lint`       | Run ESLint to check code quality       |
| `npm run lint:fix`   | Auto-fix ESLint issues                 |
| `npm run format`     | Check Prettier formatting              |
| `npm run format:fix` | Auto-fix code formatting               |

**Running a single test**: Not configured yet. Test framework should be added when needed.

---

## 📐 Code Style Guidelines

### File Structure & Naming

- **Files**: Use `camelCase` (e.g., `renderer.js`, `config.js`)
- **Components**: Use `PascalCase` (e.g., `MyComponent.jsx`)
- **JavaScript/ESM**: Files use `.js` extension, default to ESM modules
- **CommonJS exception**: `main.js` uses `require()` for Electron API

### Module System

| File           | Syntax            | Reason                                      |
| -------------- | ----------------- | ------------------------------------------- |
| `main.js`      | `require()`       | Electron main process requires CommonJS     |
| `renderer.js`  | `import`/`export` | React renderer uses ESM                     |
| `*.js` (other) | `import`/`export` | Project default is ESM (`"type": "module"`) |

### React Guidelines

- Use functional components with hooks
- Import React: `import React from 'react'`
- Import hooks: `import { useState, useEffect } from 'react'`
- Component files: `PascalCase.js` or `PascalCase.jsx`
- Use React DevTools for debugging

### Formatting (Prettier)

- **Semi-colons**: `true` (always use semicolons)
- **Quotes**: `singleQuote` (use single quotes for strings)
- **Indent**: 2 spaces, no tabs
- **Line width**: 80 characters
- **No trailing commas**: Not specified, defaults to none

---

## 🐛 Error Handling

- **Main process**: Wrap Electron API calls in try-catch
- **Renderer process**: Use React error boundaries for UI errors
- **Async operations**: Always handle promises with `.catch()` or try-catch
- **User-facing errors**: Use native Electron dialogs or UI notifications
- **Logging**: Use `console.error()` for errors, avoid `console.log()` in production

---

## 🔒 Security

- CSP headers in `index.html` restrict script sources to `'self'`
- Never expose Node.js API directly to renderer process
- Use `contextIsolation: true` for Electron window (already set by default in v41)
- Validate all user input before processing
- Use environment variables for sensitive data (create `.env` file, add to `.gitignore`)

---

## 📦 Dependencies

| Type         | Package                         | Purpose               |
| ------------ | ------------------------------- | --------------------- |
| **Main**     | electron@41.1.0                 | Desktop app framework |
| **Renderer** | react@19.2.4                    | UI library            |
| **Dev**      | eslint@9.39.4                   | Code linting          |
| **Dev**      | prettier@3.8.1                  | Code formatting       |
| **Dev**      | @eslint/js, eslint-plugin-react | React linting rules   |

---

## 🚀 Workflow for Adding Features

1. **New feature**: Create branch from main, implement feature
2. **Lint/format**: Run `npm run lint:fix && npm run format:fix` before committing
3. **Testing**: Add tests when appropriate (recommend Jest + React Testing Library)
4. **Electron-specific**: Main process changes in `main.js`, renderer changes in `renderer.js`
5. **Package updates**: Update `package.json` with `npm install --save` or `--save-dev`

---

## 📝 Notes for AI Agents

- This project uses **flat ESLint config** (`.eslint.config.js`) - ESLint v9 format
- Prettier config is at `.prettierrc` - keep rules consistent with existing config
- `index.html` has CSP headers that restrict external scripts
- No build step yet - files load directly (Webpack/Vite not configured)
- Avoid adding new dev dependencies without justification
- When adding tests, prefer Jest or Vitest (lightweight, good Electron support)
- Electron version is pinned at 41.1.0 - check compatibility before updating

---

## 🐳 Common Tasks

### Add a new React component

1. Create `src/components/ComponentName.jsx`
2. Import `React` and hooks as needed
3. Export component as default
4. Add to renderer in `renderer.js`

### Add Electron functionality

1. Modify `main.js` for window/process management
2. Use `ipcMain`/`ipcRenderer` for main/renderer communication
3. Keep Electron-specific code in main process only

### Debugging

- **Main process**: Check terminal for console output
- **Renderer process**: Use Electron DevTools (Cmd+Alt+I on Mac, Ctrl+Shift+I on Windows)
- Enable React DevTools extension for component inspection

---

_Last updated: March 2026_
_Project: automated-school-forms v1.0.0_
