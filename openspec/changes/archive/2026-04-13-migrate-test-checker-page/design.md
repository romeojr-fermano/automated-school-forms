## Context

The Test Paper Checker is being migrated from the legacy HTML file (`shs_sf_generator.html` lines 1354-2914) to the
React-based Electron app. The original implementation is a self-contained JavaScript module with:

- Two-column layout: Setup panel (320px) + Results panel
- Answer key input with two modes: Manual grid (5-column) or CSV upload
- Student answer entry with individual or bulk CSV import
- Results table with score calculation and pass/fail status
- Item analysis showing frequently wrong answers
- CSV export functionality

## Goals / Non-Goals

**Goals:**

- Replicate all functionality from the original HTML implementation
- Maintain the same UI/UX (two-column layout, navy/gold color scheme)
- Persist all state to localStorage so data survives page refresh
- Integrate seamlessly with existing navigation and app structure

**Non-Goals:**

- Add new features beyond what's in the original
- Change the visual design or layout
- Add backend/database storage (localStorage only)

## Decisions

### 1. State Management Approach

**Decision**: Store checker state in AppContext, persisted to localStorage

**Rationale**:

- Follows existing pattern used for school, students, grades
- Simpler than creating a separate context
- Already have persistence mechanism in place

**Alternative considered**: Component-local state only

- Rejected because user explicitly requested persistence

### 2. Type Definitions

**Decision**: Add new interfaces to `types/index.ts`

```typescript
export interface TestCheckerAnswer {
  item: number
  answer: string
}

export interface TestCheckerStudent {
  id: string
  name: string
  answers: Record<number, string>
  score: number
  pct: number
  passed: boolean
}

export interface TestCheckerState {
  mode: 'manual' | 'csv'
  answerKey: TestCheckerAnswer[]
  students: TestCheckerStudent[]
  testName: string
  subject: string
  passingPct: number
  date: string
}
```

### 3. Component Structure

**Decision**: Single `TestCheckerPage.tsx` component

**Rationale**:

- Original is a single panel in the HTML
- Easier to manage shared state between setup and results sections
- Can use local component state for UI-only concerns (e.g., current input mode)

### 4. CSV Parsing

**Decision**: Implement custom CSV parsing (no external library)

**Rationale**:

- Simple format: `item,answer` and `name,A,B,C,D,...`
- Avoid adding new dependencies
- Original implementation uses native JS FileReader

## Risks / Trade-offs

| Risk                                         | Mitigation                                             |
| -------------------------------------------- | ------------------------------------------------------ |
| Large CSV files may cause performance issues | Limit input to reasonable sizes, process synchronously |
| User enters invalid answer formats           | Validate on submit, show clear error messages          |
| State becomes too large for localStorage     | Implement cleanup/reset functionality                  |

## Migration Plan

1. Add types to `types/index.ts`
2. Add `testChecker` to `AppContext.tsx` with localStorage persistence
3. Add "Test Checker" tab to `NavTabs.tsx`
4. Add checker route to `App.tsx`
5. Create `TestCheckerPage.tsx` with full implementation
6. Verify by running `npm run typecheck` and `npm run lint`

## Open Questions

- None at this time - all requirements are clear from the original HTML implementation
