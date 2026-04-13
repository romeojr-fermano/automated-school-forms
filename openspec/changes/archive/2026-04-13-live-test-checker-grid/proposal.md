## Why

The current Test Checker requires a manual "Build" button click to update the answer key grid when the number of items changes. This feels slow and disconnected. Additionally, when the item count is changed, any existing answers for items beyond the new count are permanently lost.

## What Changes

- **Live Grid Updates**: The answer key grid now reacts instantly as the user types in the "No. of Items" field.
- **Data Preservation**: Answers entered in the grid are preserved in a "draft" state, ensuring they aren't lost if the item count is temporarily reduced.
- **Manual Commit**: The "Build" button is repurposed as a "Save/Commit" action that finalizes the answer key and recalculates student scores.
- **Visual Feedback**: Provides immediate visual confirmation ("✓ Updated") after the answer key is committed.

## Capabilities

### New Capabilities
- `live-answer-grid`: Reactive item grid with persistent drafting and manual commit.

### Modified Capabilities
- `test-checker`: Updating the requirements for how the answer key is managed and how students are graded.

## Impact

- `src/renderer/src/components/pages/TestCheckerPage.tsx`: Primary component being updated.
- `src/renderer/src/types/index.ts`: Potential minor changes to state structure if needed, though mostly internal to the component.
