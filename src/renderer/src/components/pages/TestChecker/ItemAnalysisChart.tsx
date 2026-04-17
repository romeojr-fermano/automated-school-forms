import { useTestChecker } from './TestCheckerContext'
import Card from '../../ui/Card'

export function ItemAnalysisChart(): React.JSX.Element | null {
  const { state } = useTestChecker()
  const { students, answerKey } = state

  if (students.length === 0) return null

  const getItemAnalysis = (): { item: number; pct: number }[] => {
    const key = answerKey.filter((k) => k.answer)
    if (!key.length || !students.length) return []

    return key.map((k) => {
      const correct = students.filter((s) => s.answers[k.item] === k.answer).length
      const pct = Math.round((correct / students.length) * 100)
      return { item: k.item, pct }
    })
  }

  const analysis = getItemAnalysis()

  return (
    <Card
      style={{
        background: 'rgba(18, 35, 61, 0.4)',
        border: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Scanning Line Animation */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'rgba(59, 130, 196, 0.5)',
          boxShadow: '0 0 8px rgba(59, 130, 196, 0.8)',
          animation: 'scanLine 4s linear infinite',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />
      <style>
        {`
          @keyframes scanLine {
            0% { top: 0; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
        `}
      </style>

      <div className="card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="card-title">
          <div
            className="card-title-icon glow-diagnostic"
            style={{ background: 'rgba(59, 130, 196, 0.2)', color: 'var(--sky-light)' }}
          >
            📊
          </div>
          <span style={{ fontSize: '12px', letterSpacing: '0.05em' }}>
            ITEM ANALYSIS DIAGNOSTIC
          </span>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          gap: '6px',
          alignItems: 'flex-end',
          height: '100px',
          overflowX: 'auto',
          padding: '16px 8px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '4px',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.3)'
        }}
      >
        {analysis.length === 0 ? (
          <div
            className="data-mono"
            style={{
              color: 'rgba(255,255,255,0.2)',
              fontSize: '11px',
              width: '100%',
              textAlign: 'center',
              letterSpacing: '0.1em'
            }}
          >
            AWAITING DATA FOR SPECTRAL ANALYSIS...
          </div>
        ) : (
          analysis.map(({ item, pct }) => (
            <div
              key={item}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                minWidth: '20px'
              }}
            >
              <div
                title={`Item ${item}: ${pct}% Accuracy`}
                style={{
                  width: '12px',
                  background:
                    pct < 50
                      ? 'linear-gradient(to top, #7f1d1d, #ef4444)'
                      : 'linear-gradient(to top, #064e3b, #10b981)',
                  height: `${Math.max(4, pct * 0.7)}px`,
                  borderRadius: '1px',
                  cursor: 'pointer',
                  boxShadow:
                    pct < 50
                      ? '0 0 10px rgba(239, 68, 68, 0.2)'
                      : '0 0 10px rgba(16, 185, 129, 0.2)',
                  transition: 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              />
              <div
                style={{
                  fontSize: '9px',
                  color: 'rgba(255,255,255,0.3)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600
                }}
              >
                {String(item).padStart(2, '0')}
              </div>
            </div>
          ))
        )}
      </div>
      <div
        className="data-mono"
        style={{
          fontSize: '9px',
          color: 'rgba(255,255,255,0.25)',
          marginTop: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          letterSpacing: '0.05em'
        }}
      >
        <span>INFRASTRUCTURE STATUS: STABLE</span>
        <span>ACCURACY THRESHOLD: 50%</span>
      </div>
    </Card>
  )
}
