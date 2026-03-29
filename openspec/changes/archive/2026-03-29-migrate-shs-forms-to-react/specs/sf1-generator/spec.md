## ADDED Requirements

### Requirement: SF1 School Register generation

The system SHALL generate School Form 1 (SF1) - School Register with all enrolled learners.

#### Scenario: Display SF1 form

- **WHEN** user navigates to SF1 page
- **THEN** system displays the SF1 form with school information and enrolled students

#### Scenario: SF1 includes learner information

- **WHEN** SF1 is generated
- **THEN** form includes LRN, last name, first name, middle initial, sex, birthdate, age, and mother tongue for each student

#### Scenario: SF1 includes certification

- **WHEN** SF1 is generated
- **THEN** form includes spaces for adviser and principal signatures
