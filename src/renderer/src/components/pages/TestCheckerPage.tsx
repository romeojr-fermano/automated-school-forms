import React from 'react'
import {
  TestCheckerProvider,
  AnswerKeySection,
  SettingsSection,
  StudentEntrySection,
  ResultsSummary,
  ResultsTable,
  ItemAnalysisChart
} from './TestChecker'

function TestCheckerPage(): React.JSX.Element {
  return (
    <TestCheckerProvider>
      <div className="panel active checker-panel-texture" id="panel-checker">
        <div className="section-header" style={{ padding: '24px 24px 0' }}>
          <div className="section-title">
            <h2>📝 Test Paper Checker</h2>
            <p>Upload answer key via CSV or input manually, then check student answers</p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            height: 'calc(100vh - 200px)',
            overflow: 'hidden'
          }}
        >
          {/* LEFT: Setup Column */}
          <div
            style={{
              width: '450px',
              minWidth: '450px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              overflowY: 'auto',
              paddingRight: '4px'
            }}
          >
            <AnswerKeySection />
            <SettingsSection />
            <StudentEntrySection />
          </div>

          {/* RIGHT: Results Column */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              overflow: 'hidden'
            }}
          >
            <ResultsSummary />
            <ResultsTable />
            <ItemAnalysisChart />
          </div>
        </div>
      </div>
    </TestCheckerProvider>
  )
}

export default TestCheckerPage
