## ADDED Requirements

### Requirement: Data export functionality

The system SHALL allow users to export all school data for backup purposes.

#### Scenario: Export all data

- **WHEN** user clicks "Export Data" button
- **THEN** system downloads a JSON file containing all school, student, grade, and attendance data

#### Scenario: Data includes all entities

- **WHEN** data is exported
- **THEN** exported file includes school information, students, subjects, grades, and attendance records
