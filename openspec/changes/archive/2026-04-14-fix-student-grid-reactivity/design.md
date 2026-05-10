## Context

The current `TestCheckerPage` maintains two separate counts for item grids: `numItems` (the current draft value being typed into the "No. of Items" field) and the `answerKey` (the list of committed items). The Student Answer grid is currently using a complex conditional logic that sometimes maps over `numItems` as a fallback. This results in the Student Answer grid changing its size incorrectly or prematurely.

## Goals / Non-Goals

**Goals:**

- Make the Student Answer grid size exclusively dependent on the committed `answerKey`.
- Ensure the Student Answer grid updates immediately when the "Build" button is clicked (because "Build" updates the `answerKey`).
- Provide an empty state for the Student Answer grid when no items are committed.

**Non-Goals:**

- Removing the "live update" capability from the Answer Key grid (draft grid).
- Automating the "Build" process (keeping it manual is a requirement).

## Decisions

### 1. Single Source of Truth for Student Grid

The student input area will now only map over the committed `answerKey`.

- **Alternative:** Allowing the student grid to follow `numItems` (the draft count).
- **Rationale:** If the system is grading against the committed key, showing more or fewer input boxes than there are items in the key is confusing for the user.

### 2. State Mapping Logic

The logic in the `JSX` will be simplified:

- If `answerKey.length > 0`, map over `answerKey`.
- Else, show the empty state message.

### 3. Data Safety

Existing answers for a student are stored in an object `Record<number, string>`. Reducing the item count (by re-building the key) will hide the inputs for the removed items, but the data will remain in the student's `answers` object if they were already added to the students list. For the "Current Student" being entered, clearing the `currentStudentAnswers` state when the key is re-built is a sensible default.

## Risks / Trade-offs

- **Risk**: User types a new count but forgets to hit "Build" and wonders why the student grid hasn't updated.
- **Mitigation**: The "Build" button is clearly visible, and clicking it already provides a visual "✓ Updated" confirmation. The setup workflow naturally flows from Answer Key -> Test Settings -> Student Answers.
