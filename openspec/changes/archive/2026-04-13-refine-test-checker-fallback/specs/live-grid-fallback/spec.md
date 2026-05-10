## ADDED Requirements

### Requirement: Live Grid Minimum Fallback

The system SHALL ensure the answer key grid displays at least 5 items during live updates, even if the "No. of Items" input is empty or zero.

#### Scenario: Fallback when empty

- **WHEN** user clears the "No. of Items" field
- **THEN** system SHALL display 5 items in the answer grid

#### Scenario: Fallback when zero

- **WHEN** user types "0" in the "No. of Items" field
- **THEN** system SHALL display 5 items in the answer grid

#### Scenario: Normal reactivity for values >= 1

- **WHEN** user types "10" in the "No. of Items" field
- **THEN** system SHALL display 10 items in the answer grid
