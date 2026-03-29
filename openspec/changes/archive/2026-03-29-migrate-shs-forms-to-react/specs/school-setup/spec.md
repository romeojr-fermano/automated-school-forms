## ADDED Requirements

### Requirement: School information configuration

The system SHALL allow users to configure school information including school name, school ID (BEIS), school year, region, division, district, and address.

#### Scenario: Save school information

- **WHEN** user fills in school information fields and clicks "Save Settings"
- **THEN** system saves the school information to local storage and displays a success notification

### Requirement: Section and academic settings

The system SHALL allow users to configure section settings including grade level, semester, section name, track, strand, and room number.

#### Scenario: Update strand options based on track

- **WHEN** user selects a track (Academic, TVL, Sports, Arts)
- **THEN** system updates the strand dropdown with relevant options for that track

### Requirement: Teacher information management

The system SHALL allow users to configure teacher information including class adviser name, adviser employee number, principal name, and principal employee number.

#### Scenario: Save teacher information

- **WHEN** user fills in teacher information and saves
- **THEN** system persists the teacher information for use in school forms

### Requirement: Subject management

The system SHALL allow users to manage subjects for the current section including adding, editing, and removing subjects with their categories, units, and assigned teachers.

#### Scenario: Add new subject

- **WHEN** user clicks "+ Add Subject" and fills in subject details
- **THEN** system adds the subject to the subjects list and updates the subject count

#### Scenario: Remove subject

- **WHEN** user clicks remove button on a subject row
- **THEN** system removes the subject from the list after confirmation
