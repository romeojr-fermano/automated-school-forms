## ADDED Requirements

### Requirement: Live Item Count Reactivity
The system SHALL instantly update the number of input boxes in the answer key grid as the user types in the "No. of Items" field.

#### Scenario: Grid updates as user types
- **WHEN** user types "10" in the "No. of Items" field
- **THEN** system instantly displays 10 answer input boxes without requiring a button click

#### Scenario: Focus remains in item count input
- **WHEN** user is typing in the "No. of Items" field and the grid updates
- **THEN** system MUST maintain focus on the "No. of Items" field

#### Scenario: Maximum item count limit
- **WHEN** user enters a number greater than 100 in the "No. of Items" field
- **THEN** system SHALL limit the displayed grid items to 100

### Requirement: Persistent Draft Answers
The system SHALL preserve all answers entered in the grid in a "draft" state, even if the item count is reduced below the item's number.

#### Scenario: Answers preserved when shrinking and regrowing
- **WHEN** user enters "A" for Item 10, changes item count to "5", and then back to "10"
- **THEN** system SHALL still display "A" for Item 10

### Requirement: Manual Commit and Recalculation
The system SHALL only officially update the test answer key and recalculate student scores when the user clicks the "Build" (Save) button.

#### Scenario: Commit answer key
- **WHEN** user clicks the "Build" button after entering draft answers
- **THEN** system updates the official test answer key and recalculates scores for all students in the results table

#### Scenario: Visual confirmation of update
- **WHEN** user clicks the "Build" button and the update is successful
- **THEN** system SHALL display a visual confirmation message (e.g., "✓ Updated")
