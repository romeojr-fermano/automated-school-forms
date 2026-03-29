## ADDED Requirements

### Requirement: Daily attendance tracking

The system SHALL allow users to track daily attendance for each student for each month of the school year.

#### Scenario: Select month

- **WHEN** user selects a month from the dropdown in SF2
- **THEN** system displays the attendance form for that month

#### Scenario: Mark attendance

- **WHEN** user marks attendance for a student (present/absent)
- **THEN** system saves the attendance record for that day

### Requirement: Monthly attendance summary

The system SHALL calculate and display total days present and absent for each student per month.

#### Scenario: Calculate monthly totals

- **WHEN** attendance is marked for all days in a month
- **THEN** system calculates total days present and absent for each student

### Requirement: Attendance integration with SF2

The system SHALL display attendance data in the SF2 (Daily Attendance Register) format.

#### Scenario: Generate SF2 attendance

- **WHEN** user navigates to SF2 form
- **THEN** system generates the attendance table with all enrolled students
