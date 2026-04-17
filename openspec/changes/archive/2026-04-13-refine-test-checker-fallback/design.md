## Context

The "Live Build" system in `TestCheckerPage.tsx` instantly updates the number of items in the answer grid as the user types. However, when the input is cleared or set to 0, the grid currently disappears.

## Goals / Non-Goals

**Goals:**

- Implement a minimum of 5 items for the live grid display.
- Ensure visual consistency between the draft grid and the finalized answer key.

## Decisions

- **Fallback Value in onChange**: The `onChange` handler for the item count input will parse the value and, if it is `NaN` or `<= 0`, it will set the `numItems` state to 5.
- **Preserve Input Value**: The `inputValue` state will still allow an empty string or "0" so the user can continue typing without the input field itself being forced to "5".

## Risks / Trade-offs

- **Brief Visual Jump**: Clearing the field will cause the grid to jump to 5 items instantly. This is acceptable as it matches the "Commit" logic and avoids a broken-looking UI.
