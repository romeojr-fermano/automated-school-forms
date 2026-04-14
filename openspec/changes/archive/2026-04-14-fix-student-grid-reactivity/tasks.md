## 1. UI Refactoring

- [x] 1.1 Simplify student input area data source in `TestCheckerPage.tsx`: change the mapping source to use `answerKey` exclusively.
- [x] 1.2 Implement the empty state message for the Student Answer grid when `answerKey` is empty.
- [x] 1.3 Remove the redundant conditional logic and `numItems` fallback from the student input area JSX.

## 2. State Synchronization

- [x] 2.1 Update `handleBuildGrid` to clear `currentStudentAnswers` when a new answer key is built, ensuring no stale data exists for the current student entry.
- [x] 2.2 Verify that clicking "Build" correctly triggers the resizing of the student grid.

## 3. Verification

- [x] 3.1 Verify that the student input area remains stable (does not resize) when typing into "No. of Items" until "Build" is clicked.
- [x] 3.2 Verify that the student input area correctly updates its size upon clicking "Build".
- [x] 3.3 Verify the empty state message is shown when the answer key is cleared.
