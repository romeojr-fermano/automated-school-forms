## Why

The Test Paper Checker feature currently exists only in the legacy HTML file (`shs_sf_generator.html`). To provide a
seamless user experience within the Electron app, this feature needs to be migrated to a proper React page that persists
state across sessions.

## What Changes

- **New Page**: Create `TestCheckerPage.tsx` as a full-page component accessible via NavTab
- **New State**: Add `testChecker` state to `AppContext.tsx` persisted in localStorage
- **New Navigation**: Add "Test Checker" tab to `NavTabs.tsx`
- **New Route**: Add checker route to `App.tsx`
- **New Types**: Add TestChecker types to `types/index.ts`

## Capabilities

### New Capabilities

- `test-checker`: Full-featured test paper checking system with:
  - Answer key input (manual grid or CSV upload)
  - Test settings (name, subject, passing percentage, date)
  - Student answer entry (individual or CSV bulk import)
  - Results table with scores, percentages, pass/fail status
  - Item analysis showing frequently wrong answers
  - CSV export of results

### Modified Capabilities

- None - this is a new feature migration

## Impact

- **New file**: `src/renderer/src/components/pages/TestCheckerPage.tsx`
- **Modified files**:
  - `src/renderer/src/types/index.ts` - Add TestChecker interfaces
  - `src/renderer/src/context/AppContext.tsx` - Add testChecker state
  - `src/renderer/src/components/NavTabs.tsx` - Add checker tab
  - `src/renderer/src/App.tsx` - Add checker route
- **Dependencies**: No new npm packages required
- **Persistence**: All checker state saved to localStorage
