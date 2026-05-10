## ADDED Requirements

### Requirement: Answer Key - Manual Input Mode

The system SHALL allow teachers to manually input answer keys by specifying the number of items and entering answers in a grid layout.

#### Scenario: Build answer key grid with custom item count

- **WHEN** user enters a number in "No. of Items" field and clicks "Build"
- **THEN** system generates a grid with that many input boxes, numbered 1 to N

#### Scenario: Enter answer for specific item

- **WHEN** user types a letter in an answer input box
- **THEN** system converts the letter to uppercase and stores it as the answer for that item

#### Scenario: Navigate between answer boxes with keyboard

- **WHEN** user presses Enter or Arrow Down while in an answer box
- **THEN** system moves focus to the next answer box in the grid

### Requirement: Answer Key - CSV Upload Mode

The system SHALL allow teachers to upload answer keys via CSV file with format `item,answer` (one per line, skip header).

#### Scenario: Upload valid answer key CSV

- **WHEN** user clicks "Upload CSV" and selects a file with format "1,A\\n2,C\\n3,B"
- **THEN** system parses the file, extracts the answer key, and updates the answer key grid

#### Scenario: CSV with header row is ignored

- **WHEN** user uploads a CSV that starts with "item,answer" header
- **THEN** system skips the header row and processes only data rows

### Requirement: Test Settings

The system SHALL allow teachers to configure test metadata including test name, subject, passing percentage, and date.

#### Scenario: Save test name

- **WHEN** user enters a test name in the Test Name field
- **THEN** system stores the test name and displays it in the results summary

#### Scenario: Set passing percentage

- **WHEN** user enters a passing percentage (1-100)
- **THEN** system uses this value to determine pass/fail status for all students

### Requirement: Student Answer Entry - Manual

The system SHALL allow teachers to enter individual student answers manually by name and answer grid.

#### Scenario: Add student name

- **WHEN** user types a student name in the Student Name field
- **THEN** system stores the name for the next submission

#### Scenario: Submit student answers for checking

- **WHEN** user clicks "Check & Add" with valid name and answers
- **THEN** system compares each answer against the answer key, calculates score, determines pass/fail, and adds student to results

#### Scenario: Student fails when below passing percentage

- **WHEN** student has percentage below passing threshold
- **THEN** system marks student as "Failed" in results

#### Scenario: Student passes when at or above passing percentage

- **WHEN** student has percentage at or above passing threshold
- **THEN** system marks student as "Passed" in results

### Requirement: Student Answer Entry - CSV Bulk Import

The system SHALL allow teachers to import multiple students at once via CSV with format `name,A,B,C,D,...`.

#### Scenario: Bulk import students from CSV

- **WHEN** user clicks "CSV" button and selects a CSV file with student answers
- **THEN** system parses each line, checks answers against answer key, and adds all students to results

### Requirement: Results Display

The system SHALL display a table showing all checked students with their scores, percentages, and pass/fail status.

#### Scenario: View results table

- **WHEN** at least one student has been checked
- **THEN** system displays a table with columns: #, Name, Score, %, Pass/Fail

#### Scenario: Summary shows class statistics

- **WHEN** students exist in results
- **THEN** system displays summary bar with: Test name, Item count, Student count, Class average, Pass count

#### Scenario: Empty state when no students

- **WHEN** no students have been checked yet
- **THEN** system displays "Set up your answer key and add students to begin"

### Requirement: CSV Export

The system SHALL allow teachers to export all results to a CSV file.

#### Scenario: Export results to CSV

- **WHEN** user clicks "Export CSV"
- **THEN** system downloads a CSV file with columns: Name,Score,%,Passed

### Requirement: Clear All Data

The system SHALL allow teachers to reset the checker by clearing all students and answer key.

#### Scenario: Clear all data

- **WHEN** user clicks "Clear All"
- **THEN** system removes all checked students and resets answer key, but keeps test settings

### Requirement: Item Analysis

The system SHALL display an analysis showing which items were most frequently answered incorrectly.

#### Scenario: View item analysis

- **WHEN** students have been checked and some items were wrong
- **THEN** system displays a list showing each item number and how many students got it wrong

### Requirement: State Persistence

The system SHALL persist all checker state to localStorage so data survives page refresh.

#### Scenario: State survives page refresh

- **WHEN** user refreshes the page or closes and reopens the app
- **THEN** all checker state (answer key, students, test settings) is restored from localStorage
