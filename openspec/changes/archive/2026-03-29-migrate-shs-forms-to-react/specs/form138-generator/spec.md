## ADDED Requirements

### Requirement: Form 138 Report Card generation

The system SHALL generate Form 138 - Report Card with semestral grades for a selected student.

#### Scenario: Select student for Form 138

- **WHEN** user selects a student from the dropdown
- **THEN** system displays the Form 138 report card for that student

#### Scenario: Form 138 includes semestral grades

- **WHEN** Form 138 is generated for a student
- **THEN** form displays all subjects with their first and second semester final grades

#### Scenario: Form 138 includes attendance summary

- **WHEN** Form 138 is generated
- **THEN** form includes total days present and absent for each semester
