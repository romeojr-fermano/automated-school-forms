## ADDED Requirements

### Requirement: Student enrollment

The system SHALL allow users to add new students with their LRN, last name, first name, middle initial, sex, birthdate, age, and mother tongue.

#### Scenario: Add individual student

- **WHEN** user clicks "+ Add Student" and fills in student details
- **THEN** system adds the student to the class list and updates the student count

#### Scenario: Validate LRN format

- **WHEN** user enters an LRN that is not exactly 12 digits
- **THEN** system displays a validation error message

### Requirement: Student search

The system SHALL allow users to search students by name or LRN in the master list.

#### Scenario: Search for student

- **WHEN** user types in the search field
- **THEN** system filters the student list to show only matching results

### Requirement: Student management

The system SHALL allow users to view, edit, and remove students from the master list.

#### Scenario: Edit student

- **WHEN** user clicks edit on a student row
- **THEN** system opens a form with the student's current data for editing

#### Scenario: Remove student

- **WHEN** user clicks remove on a student row
- **THEN** system removes the student from the list after confirmation

### Requirement: Student count display

The system SHALL display the total number of enrolled students in the sidebar badge and on the master list page.

#### Scenario: Update student count

- **WHEN** a student is added or removed
- **THEN** system updates the student count badge throughout the application
