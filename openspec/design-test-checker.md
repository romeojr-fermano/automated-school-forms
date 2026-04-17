# Frontend Design: Test Paper Checker

Applying the `frontend-design` skill to upgrade the Test Paper Checker interface from functional to intentional.

## 1. Direction: "Precision Industrial"

The Test Checker is a tool of precision. It should feel like a high-end diagnostic instrument.

- **Tone:** Professional, reliable, data-dense but clear.
- **Visuals:** Sharp borders, mono-spaced data, subtle atmospheric gradients, and "instrument-like" feedback.

## 2. Visual System Upgrades

### Typography

- **Display:** Use `IBM Plex Mono` for all data points (Scores, Percentages, Item Numbers).
- **Body:** `IBM Plex Sans` for labels and descriptions.
- **Hierarchy:** High contrast between labels (dimmed, small, uppercase) and values (bright, larger, mono).

### Atmosphere

- Add a subtle background texture to the Checker panel (using a CSS mesh or noise).
- Use layered transparency for cards to create depth.
- **Accent:** Use the `var(--gold)` for primary actions and "Success" states, but introduce a "Diagnostic Blue" for neutral data highlights.

### Motion

- **Staged Entrance:** When a student is added, their row should slide in with a slight spring animation.
- **Summary Updates:** Stats in the summary bar should "count up" or have a subtle flash when updated.

## 3. Component Enhancements

### ResultsSummary (The Dashboard)

- Instead of a flat row, use the `.stat-card` pattern.
- Add a "Pass Rate" circular progress or a larger visual indicator.
- Use `asymmetry` by making the "Class Average" card larger or more prominent.

### ItemAnalysisChart (The Diagnostic)

- Upgrade the bars with a "gradient mesh" fill.
- Add a "Scanning" animation or a subtle glow to the bars.
- Improve the tooltip to show exact student counts.

### ResultsTable (The Log)

- High-density layout but with clear visual grouping.
- Use color-coded status pills (PASSED/FAILED) that have a subtle glow.
- Mono-spaced item lists for "Wrong Items".

## 4. Quality Gate

- [ ] Does it feel like a professional tool?
- [ ] Is the data hierarchy obvious at a glance?
- [ ] Are the mono-spaced fonts enhancing the "Precision" feel?
- [ ] Is there a clear visual point of view (Precision Industrial)?
