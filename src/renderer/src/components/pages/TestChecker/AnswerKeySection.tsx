import React, { useState } from 'react'
import { useTestChecker } from './TestCheckerContext'
import Card from '../../ui/Card'
import Button from '../../ui/Button'
import { TestCheckerAnswer } from '../../../types'
import { handleGridKeyDown, parseCSVLine } from './utils'

export function AnswerKeySection(): React.JSX.Element {
  const { state, dispatch } = useTestChecker()
  const { mode, answerKey, draftAnswers } = state

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
    // Security/Logic Fix: Removed .slice(-1) to allow multi-char answers (e.g., "10", "TRUE")
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

          // Security Fix: Use robust CSV parsing for commas in names/values
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
      <div className="card-header">
        <div className="card-title">
          <div className="card-title-icon">🔑</div>
          Answer Key Setup
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <button
          onClick={() => handleModeChange('manual')}
          style={{
            flex: 1,
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: "'IBM Plex Sans', sans-serif",
            background: mode === 'manual' ? '#F5C842' : '#2c5282',
            color: mode === 'manual' ? '#0A1628' : '#fff',
            padding: '6px 12px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          ✏️ Manual Input
        </button>
        <button
          onClick={() => handleModeChange('csv')}
          style={{
            flex: 1,
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: "'IBM Plex Sans', sans-serif",
            background: mode === 'csv' ? '#F5C842' : '#2c5282',
            color: mode === 'csv' ? '#0A1628' : '#fff',
            padding: '6px 12px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          📂 Upload CSV
        </button>
      </div>

      {mode === 'manual' && (
        <div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
            <label
              style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.5)',
                whiteSpace: 'nowrap'
              }}
            >
              No. of Items:
            </label>
            <input
              type="text"
              value={numItemsInput}
              onChange={(e) => setNumItemsInput(e.target.value)}
              className="form-input"
              style={{ width: '80px', padding: '8px', fontSize: '13px' }}
            />
            <Button onClick={handleBuildGrid} style={{ fontSize: '11px', padding: '4px 10px' }}>
              Build
            </Button>
            {isUpdated && (
              <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: 'bold' }}>
                ✓ Updated
              </span>
            )}
          </div>
          <div
            id="chk-key-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '4px',
              maxHeight: '320px',
              overflowY: 'auto',
              padding: '4px',
              background: 'var(--navy-mid)',
              borderRadius: '6px'
            }}
          >
            {Array.from({ length: numItemsToShow }, (_, i) => i + 1).map((i) => {
              const itemValue = draftAnswers[i] || ''
              return (
                <div
                  key={i}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0 }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.4)',
                      minWidth: '20px',
                      textAlign: 'right'
                    }}
                  >
                    {i}
                  </span>
                  <input
                    type="text"
                    value={itemValue}
                    onChange={(e) => handleAnswerKeyChange(i, e.target.value)}
                    onKeyDown={handleGridKeyDown}
                    style={{
                      width: '40px',
                      padding: '6px 4px',
                      textAlign: 'center',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {mode === 'csv' && (
        <div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>
            CSV format:{' '}
            <code
              style={{
                background: 'var(--navy-mid)',
                padding: '1px 4px',
                borderRadius: '3px'
              }}
            >
              item,answer
            </code>
            <br />
            e.g.{' '}
            <code
              style={{
                background: 'var(--navy-mid)',
                padding: '1px 4px',
                borderRadius: '3px'
              }}
            >
              1,A
              <br />
              2,C
              <br />
              3,10
            </code>
          </div>
          <input
            type="file"
            accept=".csv"
            className="form-input"
            style={{ fontSize: '11px' }}
            onChange={handleAnswerKeyCSV}
          />
          <div
            id="chk-csv-preview"
            style={{ marginTop: '8px', fontSize: '11px', color: 'var(--gold)' }}
          >
            {answerKey.length > 0 && `✓ Loaded ${answerKey.length} answer key items.`}
          </div>
        </div>
      )}
    </Card>
  )
}
