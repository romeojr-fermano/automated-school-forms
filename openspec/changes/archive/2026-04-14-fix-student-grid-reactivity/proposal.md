## Why

Currently, the Student Answer input grid in the Test Checker page does not react immediately when the "No. of Items" is changed in the manual setup. It only updates its size after a "Build" (commit) action, or sometimes shows inconsistent counts between the draft and the grading area. This creates friction and confusion for the user who expects the student input area to match the test configuration they are currently setting up.

## What Changes

- **Synchronized Student Grid**: The Student Answer input grid will now be strictly bound to the committed `answerKey`.
- **Reactive Resizing**: The student grid will "silently resize" (update its number of items) immediately upon clicking the "Build" button, ensuring it always matches the validated number of items in the answer key.
- **Removed Volatile Logic**: The conditional logic that attempted to toggle between draft `numItems` and committed `answerKey` for the student grid will be removed in favor of a single source of truth (`answerKey`).
- **Empty State Guidance**: If the answer key is empty, the student input area will display a clear message prompting the user to build their answer key first.

## Capabilities

### New Capabilities
- `reactive-student-grid`: Ensures the student answer input area dynamically and correctly reflects the committed test structure.

### Modified Capabilities
- `live-answer-grid`: Updates the relationship between the draft answer key grid and the student answer grid.

## Impact

- `src/renderer/src/components/pages/TestCheckerPage.tsx`: Primary location for the UI logic changes.
- `src/renderer/src/types/index.ts`: Potential minor updates to state interfaces if needed (though existing ones seem sufficient).
