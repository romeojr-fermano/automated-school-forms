# Automated School Forms (SHS SF Generator)

This project is an Electron application built with React and TypeScript, designed to automate the generation of
Department of Education (DepEd) school forms for Senior High School (SHS).

## Project Overview

- **Purpose:** To assist SHS teachers in managing student records and generating required forms such as SF1 (School
  Register), SF2 (Daily Attendance), SF9 (Progress Report Card), SF10 (Learner's Permanent Record), Form 137, and Form
  138.
- **Background:** This is a migration from a legacy standalone HTML/JS project (`shs_sf_generator.html`) to a modern
  React-based Electron application.
- **Main Technologies:**
  - **Electron:** Desktop framework.
  - **React 19:** Frontend library.
  - **TypeScript:** Type safety.
  - **Vite (electron-vite):** Build tool and dev server.
  - **electron-builder:** Distribution packager.
- **Architecture:**
  - `src/main`: Electron main process.
  - `src/preload`: IPC bridge.
  - `src/renderer`: React frontend.
    - `src/context`: Centralized state management using `AppContext.tsx` (persisted to `localStorage`).
    - `src/components/pages`: Dedicated form and feature pages (SF1, SF2, Grade Entry, etc.).
    - `src/components/ui`: Consistent UI components (Button, Card, Modal, etc.).
    - `src/types`: Shared data models (Student, School, Subject, etc.).
  - `openspec/`: Design documents and specifications for feature migrations.

## Building and Running

### Prerequisites

- Node.js (latest LTS)
- npm

### Key Commands

- `npm run dev`: Start development mode with HMR.
- `npm run build`: Typecheck and build for production.
- `npm run build:win`: Package for Windows.
- `npm run typecheck`: Run all TypeScript checks.
- `npm run lint`: Run ESLint checks.
- `npm run format`: Format code with Prettier.

## Development Conventions

- **State Access:** Always use `useApp()` from `src/renderer/src/context/AppContext.tsx` to read or update global
  application data.
- **Design System:** Follow existing UI patterns in `src/renderer/src/components/ui/`.
- **Styles:** Maintain the exact visual design of the original HTML. CSS is divided into `main.css` (global) and
  `shs-forms.css` (form-specific).
- **Forms & Printing:** Forms are rendered as React components with dedicated print styles to ensure DepEd compliance.
- **Persistence:** Currently uses `localStorage`. Future plans include migrating to IPC-based file storage in the main
  process.

## Specialized Skills

This project leverages specialized agent skills for high-quality code generation and audits. Use the `activate_skill`
tool to load these instructions when working on relevant tasks:

- **accessibility:** Audit and improve web accessibility following WCAG 2.2 guidelines.
- **composition-patterns:** Scalable React composition patterns (compound components, lifting state).
- **frontend-design:** Create distinctive, production-grade frontend interfaces with high design quality.
- **nodejs-backend-patterns:** Production-ready Node.js backend patterns (Express/Fastify, middleware, DI).
- **nodejs-best-practices:** Core Node.js development principles and architecture decisions.
- **react-best-practices:** Performance optimization guidelines for React and Next.js (Vercel engineering standards).
- **seo:** Optimize for search engine visibility, metadata, and structured data.
- **typescript-advanced-types:** Master generics, conditional types, and complex type safety.
- **vite:** Vite configuration, plugin API, SSR, and Rolldown migrations.

## Key Files

- `package.json`: Project metadata and scripts.
- `src/renderer/src/App.tsx`: Main page router.
- `src/renderer/src/context/AppContext.tsx`: Central state and persistence log/aic.
- `shs_sf_generator.html`: Legacy source file for migration reference.
