## Context

The existing `shs-forms.html` is a 1300+ line standalone HTML file with:

- Embedded CSS with CSS variables for theming
- Vanilla JavaScript for all functionality
- Direct DOM manipulation for UI updates
- Local storage for data persistence
- Multiple "panels" switched via JavaScript

The Electron + React project uses:

- electron-vite with React 19 and TypeScript
- Component-based architecture
- Existing UI components (Button, Badge, etc.)
- IPC for main-renderer communication

## Goals / Non-Goals

**Goals:**

- Migrate all functionality from shs-forms.html to React components
- Preserve exact visual design and user experience
- Create reusable, maintainable component structure
- Add TypeScript types for all data models
- Ensure print functionality works for all DepEd forms

**Non-Goals:**

- Add new features beyond what's in the HTML
- Change the visual design or color scheme
- Add backend/database - use local storage initially
- Implement authentication or user management

## Decisions

### 1. Component Architecture

**Decision:** Create a page-based routing structure with separate components for each major section.

**Rationale:** The HTML file has clear "panels" (setup, masterlist, grades, sf1, sf2, sf9, sf10, f137, f138). Converting each to a React page component mirrors this structure while enabling proper routing.

**Alternative considered:** Single-page with tab navigation (current approach). Keep similar structure but implement as React state-based navigation.

### 2. State Management

**Decision:** Use React Context for shared state (school info, students, grades) instead of Redux or external state library.

**Rationale:** The data requirements are straightforward - no complex async flows or cross-component communication beyond parent-child. Context provides sufficient power without adding dependencies.

**Alternative considered:** Redux - overkill for this use case. Zustand - adds a dependency when React Context suffices.

### 3. CSS Migration

**Decision:** Extract CSS to CSS modules or maintain as global CSS following existing patterns (component-name.css files).

**Rationale:** Looking at existing components in the project, they use CSS modules (.css files alongside components). The HTML has extensive global CSS with CSS variables - this pattern should be preserved in a global stylesheet.

**Alternative considered:** styled-components - would require adding dependency and rewriting all existing CSS.

### 4. Data Persistence

**Decision:** Implement data persistence via IPC to Electron's main process for file-based storage.

**Rationale:** This enables the Electron app to save/load school data to local files while keeping the renderer secure.

**Alternative considered:** Browser localStorage only - works for demo but doesn't fit desktop app model.

### 5. Form Generation

**Decision:** Render forms as React components with their own print styles rather than using HTML-to-PDF libraries.

**Rationale:** The existing HTML has working print styles. Replicating these as CSS media queries in React components maintains compatibility and simplicity.

**Alternative considered:** jsPDF / html2canvas - adds complexity and may not match exact DepEd form requirements.

## Risks / Trade-offs

**Risk:** Large refactor scope could introduce bugs
→ **Mitigation:** Migrate incrementally - one panel at a time, test thoroughly

**Risk:** Print styles may not transfer perfectly
→ **Mitigation:** Extract and preserve exact print CSS from original HTML

**Risk:** TypeScript types may be incomplete for all data models
→ **Mitigation:** Start with basic types, refine as implementation progresses

**Risk:** State management complexity may grow
→ **Mitigation:** Use Context with clear separation (SchoolContext, StudentsContext, GradesContext)

## Migration Plan

1. Create global styles from HTML CSS variables and base styles
2. Create type definitions for all data models (Student, School, Grade, etc.)
3. Create Context providers for state management
4. Build layout components (Header, Sidebar, Navigation)
5. Create each page component in order:
   - SchoolSetup
   - MasterList
   - GradeEntry
   - SF1Generator
   - SF2Generator
   - SF9Generator
   - SF10Generator
   - Form137Generator
   - Form138Generator
6. Integrate print functionality
7. Test each form's print output

## Open Questions

- Should the app use React Router or state-based navigation?
- How to handle data migration from localStorage if user has existing data?
- Should form templates be JSON-configurable or hardcoded?
