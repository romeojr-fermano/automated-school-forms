import { useTestChecker } from './TestCheckerContext'
import { TestCheckerStudent } from '../../../types'

export function ResultsTable(): React.JSX.Element {
  const { state } = useTestChecker()
  const { students, answerKey, passingPct } = state

  const getWrongItems = (student: TestCheckerStudent): string => {
    // Security/Logic Fix: Use pre-calculated wrongItems from the reducer
    if (student.wrongItems && student.wrongItems.length > 0) {
      return student.wrongItems.join(' ')
    }
    return '\u2014' // Em-dash for no errors
  }

  return (
    <div
      style={{
        flex: 1,
        overflow: 'auto',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '8px',
        padding: '12px',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)'
      }}
    >
      {students.length === 0 ? (
        <div
          id="chk-results-empty"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'rgba(255,255,255,0.2)',
            fontSize: '13px',
            flexDirection: 'column',
            gap: '12px',
            fontFamily: 'var(--font-mono)'
          }}
        >
          <div style={{ fontSize: '48px', opacity: 0.5 }}>SIGNAL LOST</div>
          <div style={{ letterSpacing: '0.2em' }}>INITIATE SEQUENCE: SETUP ANSWER KEY</div>
        </div>
      ) : (
        <table
          id="chk-results-table"
          style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: 'left',
                  padding: '10px 12px',
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  whiteSpace: 'nowrap',
                  position: 'sticky',
                  top: 0,
                  background: 'var(--navy-mid)',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                UID
              </th>
              <th
                style={{
                  textAlign: 'left',
                  padding: '10px 12px',
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  whiteSpace: 'nowrap',
                  position: 'sticky',
                  top: 0,
                  background: 'var(--navy-mid)',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                Student Identity
              </th>
              <th
                style={{
                  textAlign: 'center',
                  padding: '10px 12px',
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  whiteSpace: 'nowrap',
                  position: 'sticky',
                  top: 0,
                  background: 'var(--navy-mid)',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                Raw Score
              </th>
              <th
                style={{
                  textAlign: 'center',
                  padding: '10px 12px',
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  whiteSpace: 'nowrap',
                  position: 'sticky',
                  top: 0,
                  background: 'var(--navy-mid)',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                Precision
              </th>
              <th
                style={{
                  textAlign: 'center',
                  padding: '10px 12px',
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  whiteSpace: 'nowrap',
                  position: 'sticky',
                  top: 0,
                  background: 'var(--navy-mid)',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                Status
              </th>
              <th
                style={{
                  textAlign: 'left',
                  padding: '10px 12px',
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  whiteSpace: 'nowrap',
                  position: 'sticky',
                  top: 0,
                  background: 'var(--navy-mid)',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                Variance Log (Wrong Items)
              </th>
            </tr>
          </thead>
          <tbody style={{ fontFamily: 'var(--font-mono)' }}>
            {students.map((student, idx) => (
              <tr
                key={student.id}
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  transition: 'background 0.2s ease'
                }}
                className="result-row"
              >
                <td
                  style={{
                    padding: '8px 12px',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.3)'
                  }}
                >
                  {String(idx + 1).padStart(3, '0')}
                </td>
                <td
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px',
                    color: 'white',
                    fontWeight: 500,
                    fontFamily: 'var(--font)'
                  }}
                >
                  {student.name}
                </td>
                <td
                  style={{
                    textAlign: 'center',
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: 'white',
                    fontWeight: 600
                  }}
                >
                  {student.score} / {answerKey.length}
                </td>
                <td
                  style={{
                    textAlign: 'center',
                    padding: '8px 12px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: student.pct >= passingPct ? '#4ade80' : '#f87171'
                  }}
                >
                  {student.pct}%
                </td>
                <td style={{ textAlign: 'center', padding: '8px 12px' }}>
                  {student.passed ? (
                    <span
                      style={{
                        background: 'rgba(22, 163, 74, 0.15)',
                        color: '#4ade80',
                        padding: '2px 10px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        border: '1px solid rgba(22, 163, 74, 0.3)',
                        boxShadow: '0 0 10px rgba(74, 222, 128, 0.1)'
                      }}
                    >
                      OPTIMAL
                    </span>
                  ) : (
                    <span
                      style={{
                        background: 'rgba(220, 38, 38, 0.15)',
                        color: '#f87171',
                        padding: '2px 10px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        border: '1px solid rgba(220, 38, 38, 0.3)',
                        boxShadow: '0 0 10px rgba(248, 113, 113, 0.1)'
                      }}
                    >
                      CRITICAL
                    </span>
                  )}
                </td>
                <td
                  style={{
                    padding: '8px 12px',
                    fontSize: '11px',
                    color: 'rgba(248, 113, 113, 0.6)',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {getWrongItems(student)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
