import React, { useState } from 'react'
import { useTestChecker } from './TestCheckerContext'
import Card from '../../ui/Card'
import Button from '../../ui/Button'
import { TestCheckerAnswer } from '../../../types'
import { handleGridKeyDown, parseCSVLine } from './utils'

export function TestConfigurationSection(): React.JSX.Element {
  const { state, dispatch } = useTestChecker()
  const { mode, answerKey, draftAnswers, testName, subject, passingPct, date } = state

  const [isMetadataExpanded, setIsMetadataExpanded] = useState(true)
  const [numItemsInput, setNumItemsInput] = useState<string>(String(answerKey.length || 5))
  const [isUpdated, setIsUpdated] = useState(false)

  const handleModeChange = (newMode: 'manual' | 'csv'): void => {
    dispatch({ type: 'SET_MODE', payload: newMode })
  }

  const handleBuildGrid = (): void => {
    let validated = parseInt(numItemsInput)
    if (isNaN(validated) || validated <= 0) validated = 5
    validated = Math.min(100, validated)

    setNumItemsInput(String(validated))
    dispatch({ type: 'BUILD_GRID', payload: { numItems: validated } })

    setIsUpdated(true)
    setTimeout(() => setIsUpdated(false), 3000)
  }

  const handleAnswerKeyChange = (item: number, value: string): void => {
    const val = value.toUpperCase()
    dispatch({ type: 'SET_DRAFT_ANSWER', payload: { item, answer: val } })
  }

  const handleAnswerKeyCSV = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = function (e): void {
      try {
        const content = (e.target?.result as string) || ''
        const lines = content
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean)

        const newKey: TestCheckerAnswer[] = []
        lines.forEach((line) => {
          if (line.toLowerCase().startsWith('item')) return
          const parts = parseCSVLine(line)
          if (parts.length >= 2) {
            const item = parseInt(parts[0])
            const ans = parts[1].toUpperCase()
            if (!isNaN(item) && ans) {
              newKey.push({ item, answer: ans })
            }
          }
        })

        if (newKey.length > 0) {
          dispatch({ type: 'LOAD_CSV_KEY', payload: newKey })
          setNumItemsInput(String(newKey.length))
        } else {
          alert('No valid answer key items found in CSV.')
        }
      } catch (err) {
        console.error('CSV Import Error:', err)
        alert('Failed to parse CSV. Please check the format.')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const numItemsToShow = parseInt(numItemsInput) || 5

  return (
    <Card>
      <div
        className="card-header"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '12px' }}
      >
        <div className="card-title">
          <div className="card-title-icon">⚙️</div>
          Configuration & Calibration
        </div>
      </div>

      {/* SECTION: METADATA */}
      <div style={{ marginBottom: '16px' }}>
        <div
          onClick={() => setIsMetadataExpanded(!isMetadataExpanded)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            padding: '4px 8px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '4px',
            marginBottom: '8px'
          }}
        >
          <span
            style={{
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.4)',
              fontWeight: 600
            }}
          >
            {isMetadataExpanded ? '▼' : '▶'} Test Metadata
          </span>
          {!isMetadataExpanded && (
            <span
              style={{
                fontSize: '10px',
                color: 'var(--gold)',
                fontFamily: 'var(--font-mono)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '300px'
                }}
                >              {testName || 'Untitled'} | {subject || 'No Subject'} | {passingPct}%
            </span>
          )}
        </div>

        {isMetadataExpanded && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              padding: '0 8px'
            }}
          >
            <div className="form-group span-2">
              <label
                className="form-label"
                style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}
              >
                Test Name
              </label>
              <input
                type="text"
                value={testName}
                onChange={(e) => dispatch({ type: 'SET_TEST_NAME', payload: e.target.value })}
                className="form-input"
                placeholder="e.g. Midterm Exam"
                style={{ fontSize: '12px', padding: '6px 10px' }}
              />
            </div>
            <div>
              <label
                className="form-label"
                style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}
              >
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => dispatch({ type: 'SET_SUBJECT', payload: e.target.value })}
                className="form-input"
                placeholder="e.g. Math"
                style={{ fontSize: '12px', padding: '6px 10px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1 }}>
                <label
                  className="form-label"
                  style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}
                >
                  Passing %
                </label>
                <input
                  type="number"
                  value={passingPct}
                  onChange={(e) =>
                    dispatch({ type: 'SET_PASSING_PCT', payload: parseInt(e.target.value) || 75 })
                  }
                  className="form-input"
                  style={{ fontSize: '12px', padding: '6px 10px' }}
                  min={1}
                  max={100}
                />
              </div>
              <div style={{ flex: 1.5 }}>
                <label
                  className="form-label"
                  style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}
                >
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => dispatch({ type: 'SET_DATE', payload: e.target.value })}
                  className="form-input"
                  style={{ fontSize: '12px', padding: '6px 10px' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION: ANSWER KEY */}
      <div>
        <div
          style={{
            fontSize: '9px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.4)',
            fontWeight: 600,
            padding: '4px 8px',
            marginBottom: '8px'
          }}
        >
          Answer Calibration
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', padding: '0 8px' }}>
          <button
            onClick={() => handleModeChange('manual')}
            style={{
              flex: 1,
              fontSize: '11px',
              fontWeight: 600,
              background: mode === 'manual' ? 'rgba(245, 200, 66, 0.15)' : 'rgba(255,255,255,0.05)',
              color: mode === 'manual' ? 'var(--gold)' : 'rgba(255,255,255,0.4)',
              padding: '6px 10px',
              borderRadius: '4px',
              border:
                mode === 'manual' ? '1px solid rgba(245, 200, 66, 0.3)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Manual
          </button>
          <button
            onClick={() => handleModeChange('csv')}
            style={{
              flex: 1,
              fontSize: '11px',
              fontWeight: 600,
              background: mode === 'csv' ? 'rgba(245, 200, 66, 0.15)' : 'rgba(255,255,255,0.05)',
              color: mode === 'csv' ? 'var(--gold)' : 'rgba(255,255,255,0.4)',
              padding: '6px 10px',
              borderRadius: '4px',
              border:
                mode === 'csv' ? '1px solid rgba(245, 200, 66, 0.3)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            CSV Import
          </button>
        </div>

        {mode === 'manual' ? (
          <div style={{ padding: '0 8px' }}>
            <div
              style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}
            >
              <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Capacity:</label>
              <input
                type="text"
                value={numItemsInput}
                onChange={(e) => setNumItemsInput(e.target.value)}
                className="form-input"
                style={{
                  width: '60px',
                  padding: '6px',
                  fontSize: '12px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)'
                }}
              />
              <Button onClick={handleBuildGrid} style={{ fontSize: '10px', padding: '4px 12px' }}>
                Re-Calibrate
              </Button>
              {isUpdated && (
                <span style={{ fontSize: '10px', color: '#4ade80', fontWeight: 'bold' }}>✓</span>
              )}
            </div>

            <div
              id="chk-key-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '6px',
                maxHeight: '280px',
                overflowY: 'auto',
                padding: '8px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              {Array.from({ length: numItemsToShow }, (_, i) => i + 1).map((i) => {
                const itemValue = draftAnswers[i] || ''
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.3)',
                        fontFamily: 'var(--font-mono)',
                        minWidth: '16px'
                      }}
                    >
                      {String(i).padStart(2, '0')}
                    </span>
                    <input
                      type="text"
                      value={itemValue}
                      onChange={(e) => handleAnswerKeyChange(i, e.target.value)}
                      onKeyDown={handleGridKeyDown}
                      style={{
                        width: '100%',
                        padding: '4px 2px',
                        textAlign: 'center',
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        textTransform: 'uppercase',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'white',
                        borderRadius: '2px'
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div style={{ padding: '0 8px' }}>
            <input
              type="file"
              accept=".csv"
              className="form-input"
              style={{ fontSize: '11px', padding: '12px' }}
              onChange={handleAnswerKeyCSV}
            />
            <div
              style={{
                marginTop: '8px',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.4)',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {answerKey.length > 0 ? (
                <span style={{ color: 'var(--gold)' }}>
                  ✓ Logged {answerKey.length} spectral items.
                </span>
              ) : (
                'Awaiting CSV data feed...'
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
