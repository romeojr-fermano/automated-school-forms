## ADDED Requirements

### Requirement: SF2 Daily Attendance Register generation

The system SHALL generate School Form 2 (SF2) - Daily Attendance Register for a selected month.

#### Scenario: Display SF2 form

- **WHEN** user navigates to SF2 page
- **THEN** system displays the SF2 form for the selected month

#### Scenario: Select month for SF2

- **WHEN** user selects a different month
- **THEN** system updates the SF2 form to show attendance for that month

#### Scenario: SF2 includes weekly attendance

- **WHEN** SF2 is generated
- **THEN** form displays attendance for 4 weeks with Monday-Friday columns
