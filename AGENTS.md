# AGENTS.md - Agentic Coding Guidelines

This document provides guidelines for agents working on this Electron + React + TypeScript project.

## Project Overview

This is an Electron application built with electron-vite, React 19, and TypeScript. It uses a multi-process architecture:

- **Main process** (`src/main/`): Electron main process handling windows, IPC, system integration
- **Preload** (`src/preload/`): Context bridge for secure renderer-main communication
- **Renderer** (`src/renderer/src/`): React 19 frontend UI

## Build Commands

### Development

```bash
npm run dev          # Start electron-vite dev server with hot reload
npm run start        # Preview production build locally
```

### Building

```bash
npm run build        # TypeScript check + electron-vite production build
npm run build:win    # Build Windows executable (.exe)
npm run build:mac    # Build macOS app
npm run build:linux  # Build Linux app
npm run build:unpack # Build unpacked directory (for debugging)
```

### Code Quality

```bash
npm run format       # Format all files with Prettier
npm run lint         # Run ESLint on all files
npm run typecheck    # Run TypeScript type checking
npm run typecheck:node   # Type check main + preload (tsconfig.node.json)
npm run typecheck:web    # Type check renderer (tsconfig.web.json)
```

### Running a Single Test

**Note:** This project does not currently have tests configured.

## Code Style Guidelines

### Formatting (Prettier)

- **Quotes:** Single quotes only
- **Semicolons:** No semicolons
- **Print width:** 100 characters
- **Trailing commas:** None
- **Config:** `.prettierrc.yaml`

### EditorConfig

- **Indent:** 2 spaces
- **Line endings:** LF (Unix-style)
- **Charset:** UTF-8
- **Config:** `.editorconfig`

### TypeScript

- Strict mode enabled via `@electron-toolkit/tsconfig`
- Use explicit return types for React components: `function App(): React.JSX.Element`
- Use explicit types for function parameters when not obvious
- Enable `composite: true` in tsconfig for project references

### React/JSX

- Use JSX runtime: `react-jsx` (no need to import React in every file)
- Prefer functional components with hooks over class components
- Use explicit return type annotation: `function Component(): React.JSX.Element`
- Components go in `src/renderer/src/components/` directory

### Imports

- Use path alias `@renderer/*` for renderer source imports
- Group imports: external libs, then internal modules, then assets/styles
- Example:
  ```typescript
  import { useState, useEffect } from 'react'
  import { join } from 'path'
  import icon from './assets/icon.png?asset'
  import { myModule } from '@/utils/myModule'
  ```

### Naming Conventions

- **Files:** PascalCase for components (`MyComponent.tsx`), camelCase for others (`utils.ts`)
- **Components:** PascalCase (`function MyComponent()`)
- **Variables/functions:** camelCase
- **Constants:** SCREAMING_SNAKE_CASE
- **Interfaces:** PascalCase, prefix with `I` optional (`interface UserProps`)

### Error Handling

- Always wrap contextBridge operations in try-catch
- Log errors with `console.error`
- Use TypeScript types to catch errors at compile time
- Example:
  ```typescript
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
  ```

### Electron-Specific Guidelines

#### Main Process

- Use `electronApp.setAppUserModelId()` for Windows
- Use `optimizer.watchWindowShortcuts()` for dev tools shortcut
- Always handle `window-all-closed` and `activate` events for macOS
- Use `is.dev` check for development vs production behavior

#### Preload

- Expose only necessary APIs via `contextBridge.exposeInMainWorld`
- Never expose sensitive Node.js APIs directly to renderer
- Use TypeScript declaration files (`.d.ts`) for window type augmentation

#### IPC Communication

- Use `ipcMain`/`ipcRenderer` for main-renderer communication
- Validate all IPC messages in main process
- Consider using `invoke`/`handle` for request-response patterns

### Linting (ESLint)

- Config: `eslint.config.mjs` using flat config
- Uses `@electron-toolkit/eslint-config-ts` for TypeScript
- Uses `eslint-plugin-react` and `eslint-plugin-react-hooks`
- Uses `eslint-plugin-react-refresh` for Vite HMR compatibility
- Run `npm run lint` before committing

## Key Dependencies

- **electron-vite**: Build tool integrating Vite with Electron
- **@electron-toolkit/utils**: Electron utilities (`is.dev`, `electronApp`, `optimizer`)
- **@electron-toolkit/preload**: Preload script helpers
- **electron-builder**: Packaging for distribution

## File Structure

```
src/
├── main/              # Main process (Node.js)
│   └── index.ts       # Entry point, window creation
├── preload/           # Preload scripts (runs in sandboxed renderer)
│   ├── index.ts       # Context bridge setup
│   └── index.d.ts     # TypeScript declarations for window
└── renderer/
    └── src/           # React frontend
        ├── App.tsx    # Root component
        ├── main.tsx   # React entry point
        ├── components/
        │   └── *.tsx  # React components
        └── assets/    # Static assets (images, styles)
```

## Common Tasks

### Adding a New Component

1. Create `src/renderer/src/components/MyComponent.tsx`
2. Use functional component with explicit return type
3. Import and use in parent component

### Adding IPC Communication

1. Define API in `src/preload/index.ts` with contextBridge
2. Add type declaration in `src/preload/index.d.ts`
3. Handle in `src/main/index.ts` with ipcMain

### Adding New Dependencies

```bash
npm install <package>    # Regular dependency
npm install -D <package> # Dev dependency
```
