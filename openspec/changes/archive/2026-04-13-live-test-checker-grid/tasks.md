## 1. State Refactoring

- [x] 1.1 Add `draftAnswers` state (`Record<number, string>`) to `TestCheckerPage.tsx`
- [x] 1.2 Initialize `draftAnswers` from the current `answerKey` on component mount
- [x] 1.3 Add `isUpdated` state (boolean) to track visual confirmation message

## 2. Live Grid Implementation

- [x] 2.1 Update "No. of Items" `onChange` to instantly update `numItems` and `inputValue`
- [x] 2.2 Ensure the input `onChange` keeps focus and respects the 100-item limit
- [x] 2.3 Refactor the answer grid rendering to use `draftAnswers` instead of `answerKey`
- [x] 2.4 Update `handleAnswerKeyChange` to only update `draftAnswers`

## 3. Build & Recalculate Logic

- [x] 3.1 Refactor `handleBuildGrid` to sync `draftAnswers` into the official `answerKey`
- [x] 3.2 Update `handleBuildGrid` to loop through all `students` and re-calculate their scores, percentages, and pass/fail status
- [x] 3.3 Set `isUpdated` to true after successful build, and set a timeout to reset it (visual confirmation)
- [x] 3.4 Ensure "Clear All" also clears `draftAnswers`

## 4. Verification & Cleanup

- [x] 4.1 Verify grid updates instantly as typing "10", "20", etc.
- [x] 4.2 Verify focus stays in "No. of Items" field during typing
- [x] 4.3 Verify answers are preserved when reducing and then increasing the item count
- [x] 4.4 Verify student scores are correctly updated when clicking "Build"
- [x] 4.5 Verify the "✓ Updated" message appears and disappears correctly
