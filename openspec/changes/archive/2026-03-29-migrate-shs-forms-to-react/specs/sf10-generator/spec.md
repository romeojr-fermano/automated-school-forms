## ADDED Requirements

### Requirement: SF10 Learner's Permanent Academic Record generation

The system SHALL generate School Form 10 (SF10) - Learner's Permanent Academic Record for a selected student.

#### Scenario: Select student for SF10

- **WHEN** user selects a student from the dropdown
- **THEN** system displays the SF10 permanent record for that student

#### Scenario: SF10 includes complete academic history

- **WHEN** SF10 is generated for a student
- **THEN** form displays all subjects taken with their final grades for all semesters

#### Scenario: SF10 includes learner profile

- **WHEN** SF10 is generated
- **THEN** form includes learner's personal information, LRN, and school enrollment history
