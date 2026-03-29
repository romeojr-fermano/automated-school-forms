## Why

The project currently has a standalone `shs-forms.html` file containing a complete SHS (Senior High School) forms generator application with embedded CSS and JavaScript. This needs to be migrated to the Electron + React + TypeScript application to leverage the benefits of a modern frontend framework, including better code organization, maintainability, type safety, and integration with the existing desktop application infrastructure.

## What Changes

- Convert the monolithic `shs-forms.html` into React components
- Migrate inline CSS to CSS modules or styled components following project conventions
- Convert vanilla JavaScript logic to TypeScript with proper typing
- Create reusable UI components for forms, tables, inputs, and navigation
- Implement state management for school data, students, grades, and attendance
- Add proper IPC communication for data persistence
- Maintain all existing functionality and visual design
- Ensure print styles work correctly for all DepEd school forms

## Capabilities

### New Capabilities

- `school-setup`: School information, section configuration, teacher management
- `student-masterlist`: Student enrollment and management with LRN tracking
- `grade-entry`: Quarterly grade entry and computation system
- `attendance-tracking`: Daily attendance recording per month
- `sf1-generator`: School Form 1 - School Register generation
- `sf2-generator`: School Form 2 - Daily Attendance Register generation
- `sf9-generator`: School Form 9 - Learner's Progress Report Card
- `sf10-generator`: School Form 10 - Learner's Permanent Academic Record
- `form137-generator`: Form 137 - Permanent Record / Transcript of Records
- `form138-generator`: Form 138 - Report Card with semestral grades
- `data-export`: Export functionality for school data backup
- `print-forms`: Print-optimized views for all school forms

### Modified Capabilities

None - this is a new implementation of functionality previously in a standalone HTML file.

## Impact

- **New Files**: React components in `src/renderer/src/components/`
- **Modified Files**: `src/renderer/src/App.tsx` for routing
- **Dependencies**: None - using existing project dependencies
- **Data Storage**: Local storage for demo, IPC ready for Electron storage integration
