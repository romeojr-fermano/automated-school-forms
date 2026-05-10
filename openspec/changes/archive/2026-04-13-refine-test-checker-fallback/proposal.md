## Why

The current live grid implementation in the Test Checker shows an empty grid when the "No. of Items" input is 0 or empty. This can be jarring and doesn't align with the "Build" button's safety logic, which enforces a minimum of 5 items.

## What Changes

- **Live Grid Fallback**: Update the reactive grid logic to display 5 items by default when the input is empty or 0.
- **Consistency**: Ensure the live visual state matches the behavior of the manual commit (Build button).

## Capabilities

### New Capabilities

- `live-grid-fallback`: Ensures a minimum item count is displayed during live updates.

### Modified Capabilities

- `live-answer-grid`: Refines the reactive behavior to include the fallback.

## Impact

- `src/renderer/src/components/pages/TestCheckerPage.tsx`: Update `onChange` handler for the item count input.
