## ADDED Requirements

### Requirement: Committed-Bound Student Grid
The Student Answer input area SHALL only display a number of item inputs that matches the currently committed `answerKey`.

#### Scenario: Student grid resizes on Build
- **WHEN** user changes "No. of Items" from 5 to 10 and clicks the "Build" button
- **THEN** the Student Answer input area SHALL instantly update to show 10 item inputs

#### Scenario: Student grid remains stable during drafting
- **WHEN** user changes "No. of Items" from 10 to 15 but has NOT yet clicked "Build"
- **THEN** the Student Answer input area SHALL continue to show only 10 item inputs (the previously committed count)

### Requirement: Student Input Area Empty State
The system SHALL provide guidance when no answer key has been built yet.

#### Scenario: Empty state message
- **WHEN** the `answerKey` is empty (e.g., after a "Clear All" or on initial load)
- **THEN** the Student Answer input area SHALL display a message "Please build your answer key to enable student input" instead of an empty grid
