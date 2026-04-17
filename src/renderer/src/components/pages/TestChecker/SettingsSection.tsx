import { useTestChecker } from './TestCheckerContext'
import Card from '../../ui/Card'

export function SettingsSection(): React.JSX.Element {
  const { state, dispatch } = useTestChecker()
  const { testName, subject, passingPct, date } = state

  return (
    <Card>
      <div className="card-header">
        <div className="card-title">
          <div className="card-title-icon">⚙️</div>
          Test Settings
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div>
          <label className="form-label">Test Name</label>
          <input
            type="text"
            value={testName}
            onChange={(e) => dispatch({ type: 'SET_TEST_NAME', payload: e.target.value })}
            className="form-input"
            placeholder="e.g. Midterm Exam"
            style={{ fontSize: '12px' }}
          />
        </div>
        <div>
          <label className="form-label">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => dispatch({ type: 'SET_SUBJECT', payload: e.target.value })}
            className="form-input"
            placeholder="e.g. Math"
            style={{ fontSize: '12px' }}
          />
        </div>
        <div>
          <label className="form-label">Passing Score (%)</label>
          <input
            type="number"
            value={passingPct}
            onChange={(e) =>
              dispatch({ type: 'SET_PASSING_PCT', payload: parseInt(e.target.value) || 75 })
            }
            className="form-input"
            style={{ fontSize: '12px' }}
            min={1}
            max={100}
          />
        </div>
        <div>
          <label className="form-label">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => dispatch({ type: 'SET_DATE', payload: e.target.value })}
            className="form-input"
            style={{ fontSize: '12px' }}
          />
        </div>
      </div>
    </Card>
  )
}
