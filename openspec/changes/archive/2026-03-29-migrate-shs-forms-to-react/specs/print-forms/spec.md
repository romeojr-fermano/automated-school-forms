## ADDED Requirements

### Requirement: Print functionality for all forms

The system SHALL allow users to print all school forms with proper formatting.

#### Scenario: Print any form

- **WHEN** user clicks "Print" button on any form page
- **THEN** system opens the browser print dialog with the form formatted for printing

#### Scenario: Print styles hide UI elements

- **WHEN** print is initiated
- **THEN** system hides header, sidebar, navigation tabs, and buttons in print output

#### Scenario: Print styles format form correctly

- **WHEN** print is initiated
- **THEN** form displays with white background, proper typography, and correct page layout for DepEd forms

#### Scenario: Print preview shows form

- **WHEN** user clicks print
- **THEN** preview shows exactly what will be printed on paper
