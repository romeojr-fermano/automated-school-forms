## Context

The current Test Checker implementation in `TestCheckerPage.tsx` uses a single `answerKey` array that is updated only when the "Build" button is clicked. This creates a disconnect between the item count input and the visual grid. Additionally, reducing the item count permanently deletes answers beyond the new count.

## Goals / Non-Goals

**Goals:**

- Provide instant visual feedback for the item grid as the user types.
- Ensure answer data is preserved during grid resizing.
- Repurpose the "Build" button as a manual "Save/Commit" action.
- Automatically recalculate student scores after the answer key is committed.
- Maintain focus on the "No. of Items" input during live updates.

**Non-Goals:**

- Removing the "Build" button entirely (it will remain as the "Save" trigger).
- Implementing complex multi-test management in this change.

## Decisions

- **State Separation (Draft vs. Committed)**: Use a separate `draftAnswers` state (likely `Record<number, string>`) to store user input in the grid. The existing `answerKey` will only be updated when "Build" is clicked.
- **Reactive Grid Rendering**: The number of input boxes in the grid will be driven by a `displayItems` count that updates `onChange` of the "No. of Items" field.
- **Focus Management**: Use a controlled input for "No. of Items" that updates the `displayItems` state instantly without triggering a full component re-render that would steal focus.
- **Data Preservation**: The `draftAnswers` record will NOT be cleared when `displayItems` is reduced. This ensures answers are recovered if the count is increased again.
- **Recalculation Trigger**: The `Build` button handler will sync `draftAnswers` into the official `answerKey` and then loop through the `students` array to re-calculate their scores and pass/fail status.

## Risks / Trade-offs

- **Memory Usage**: Keeping all draft answers in memory could theoretically grow large, but with a hard limit of 100 items, this is negligible.
- **User Confusion**: Users might expect the "Build" button to still be required for the grid to appear. Clear UI feedback (instant grid) should mitigate this.
- **Performance**: Instant re-rendering of up to 100 inputs might cause a slight flicker on very slow machines, but the lightweight nature of the inputs makes this unlikely.
