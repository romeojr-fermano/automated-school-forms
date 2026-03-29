## ADDED Requirements

### Requirement: Quarterly grade entry

The system SHALL allow users to enter grades for each subject for each student for any quarter (Q1, Q2, Q3, Q4).

#### Scenario: Select quarter

- **WHEN** user selects a quarter from the dropdown
- **THEN** system displays the grade entry table for that quarter

#### Scenario: Enter grade for student

- **WHEN** user enters a grade in a grade input field
- **THEN** system saves the grade for that student and subject for the selected quarter

#### Scenario: Validate grade range

- **WHEN** user enters a grade outside the valid range (60-100)
- **THEN** system displays a validation error

### Requirement: Grade computation

The system SHALL compute final grades as the average of quarterly grades for each subject.

#### Scenario: Compute averages

- **WHEN** user clicks "Compute Averages"
- **THEN** system calculates and displays the final grade for each student in each subject

### Requirement: Grade status display

The system SHALL display whether grades have been computed for the current quarter.

#### Scenario: Show computed status

- **WHEN** grades have been computed
- **THEN** system displays "Computed" badge on the grade table

#### Scenario: Show not computed status

- **WHEN** grades have not been computed
- **THEN** system displays "Not yet computed" badge on the grade table
