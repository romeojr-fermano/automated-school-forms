import { useTestChecker } from './TestCheckerContext'
import Button from '../../ui/Button'
import { sanitizeForCSV } from './utils'

export function ResultsSummary(): React.JSX.Element | null {
  const { state, dispatch } = useTestChecker()
  const { students, testName, answerKey, passingPct } = state

  if (students.length === 0) return null

  const classAvg = Math.round(students.reduce((sum, s) => sum + s.pct, 0) / students.length)
  const passedCount = students.filter((s) => s.passed).length

  const handleExportCSV = (): void => {
    const key = answerKey.filter((k) => k.answer)
    let csv = 'Name,Score,Percentage,Result'
    key.forEach((k) => {
      csv += `,Item${k.item}`
    })
    csv += '\n'

    students.forEach((s) => {
      // Security Fix: Sanitize fields for CSV Injection (formula protection)
      const row = [
        sanitizeForCSV(s.name),
        s.score,
        `${s.pct}%`,
        s.passed ? 'Passed' : 'Failed'
      ]

      key.forEach((k) => {
        row.push(sanitizeForCSV(s.answers[k.item] || ''))
      })

      csv += row.join(',') + '\n'
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(testName || 'test-results').replace(/\s+/g, '_')}_results.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClearAll = (): void => {
    if (confirm('Are you sure you want to clear all students and answer key?')) {
      dispatch({ type: 'CLEAR_ALL' })
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '8px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 4px'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.4)',
              fontWeight: 600
            }}
          >
            Current Diagnostic
          </span>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--white)' }}>
            {testName || 'Untitled Assessment'}
          </h3>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            onClick={handleExportCSV}
            style={{
              fontSize: '11px',
              background: 'rgba(22, 163, 74, 0.15)',
              color: '#4ade80',
              border: '1px solid rgba(22, 163, 74, 0.3)'
            }}
          >
            ⬇ EXPORT DATA
          </Button>
          <Button
            onClick={handleClearAll}
            style={{
              fontSize: '11px',
              background: 'rgba(220, 38, 38, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(220, 38, 38, 0.3)'
            }}
          >
            🗑 CLEAR TERMINAL
          </Button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px'
        }}
      >
        <div className="stat-card gold">
          <div className="stat-label">Total Items</div>
          <div className="stat-value">{answerKey.length}</div>
          <div className="stat-sub">Baseline capacity</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Students Logged</div>
          <div className="stat-value">{students.length}</div>
          <div className="stat-sub">Active records</div>
        </div>
        <div className={`stat-card ${classAvg >= passingPct ? 'green' : 'red'}`}>
          <div className="stat-label">Class Average</div>
          <div className="stat-value">{classAvg}%</div>
          <div className="stat-sub">Target: {passingPct}%</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Pass Rate</div>
          <div className="stat-value">
            {passedCount}
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginLeft: '4px' }}>
              / {students.length}
            </span>
          </div>
          <div className="stat-sub">{Math.round((passedCount / students.length) * 100)}% Success</div>
        </div>
      </div>
    </div>
  )
}
