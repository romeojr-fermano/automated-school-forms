import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { TestCheckerAnswer, TestCheckerStudent } from '../../types'
import React from 'react'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

function TestCheckerPage(): React.JSX.Element {
  const { testChecker, setTestChecker } = useApp()

  const [mode, setMode] = useState<'manual' | 'csv'>(testChecker.mode)
  const [numItems, setNumItems] = useState<number>(testChecker.answerKey.length || 5)
  const [inputValue, setInputValue] = useState<string>(String(testChecker.answerKey.length || 5))
  const [answerKey, setAnswerKey] = useState<TestCheckerAnswer[]>(testChecker.answerKey)
  const [students, setStudents] = useState<TestCheckerStudent[]>(testChecker.students)
  const [testName, setTestName] = useState(testChecker.testName)
  const [subject, setSubject] = useState(testChecker.subject)
  const [passingPct, setPassingPct] = useState(testChecker.passingPct)
  const [date, setDate] = useState(testChecker.date)
  const [studentName, setStudentName] = useState('')
  const [currentStudentAnswers, setCurrentStudentAnswers] = useState<Record<number, string>>({})
  const [draftAnswers, setDraftAnswers] = useState<Record<number, string>>({})
  const [isUpdated, setIsUpdated] = useState(false)

  // Initialize draftAnswers from answerKey on mount
  useEffect(() => {
    const draft: Record<number, string> = {}
    answerKey.forEach((k) => {
      draft[k.item] = k.answer
    })
    setDraftAnswers(draft)
  }, [])

  // Sync with AppContext
  useEffect(() => {
    setTestChecker({
      mode,
      answerKey,
      students,
      testName,
      subject,
      passingPct,
      date
    })
  }, [mode, answerKey, students, testName, subject, passingPct, date])

  const handleModeChange = (newMode: 'manual' | 'csv') => {
    setMode(newMode)
  }

  const handleBuildGrid = () => {
    let validated = parseInt(inputValue)
    if (isNaN(validated) || validated <= 0) validated = 5
    validated = Math.min(100, validated)

    setNumItems(validated)
    setInputValue(String(validated))

    // Sync draftAnswers to official answerKey for the current count
    const newKey: TestCheckerAnswer[] = []
    for (let i = 1; i <= validated; i++) {
      newKey.push({ item: i, answer: draftAnswers[i] || '' })
    }
    setAnswerKey(newKey)

    // Recalculate all students based on new key
    const officialKey = newKey.filter((k) => k.answer)
    if (students.length > 0 && officialKey.length > 0) {
      setStudents((prev) =>
        prev.map((s) => {
          let score = 0
          const wrongItems: string[] = []
          officialKey.forEach((k) => {
            const given = s.answers[k.item] || '?'
            if (given !== k.answer) {
              wrongItems.push(`${k.item}(${given}→${k.answer})`)
            } else {
              score++
            }
          })
          const pct = Math.round((score / officialKey.length) * 100)
          const passed = pct >= passingPct
          return { ...s, score, pct, passed, wrongItems }
        })
      )
    }

    // Visual confirmation
    setIsUpdated(true)
    setTimeout(() => setIsUpdated(false), 3000)
  }

  const handleAnswerKeyChange = (item: number, value: string) => {
    const val = value.toUpperCase().slice(-1)
    setDraftAnswers((prev) => ({ ...prev, [item]: val }))
  }

  const handleStudentAnswerChange = (item: number, value: string) => {
    const val = value.toUpperCase().slice(-1)
    setCurrentStudentAnswers((prev) => ({ ...prev, [item]: val }))
  }

  const handleAnswerKeyCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = function (e) {
      const lines = ((e.target?.result as string) || '')
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
      const newKey: TestCheckerAnswer[] = []
      const newDraft: Record<number, string> = {}
      lines.forEach((line) => {
        if (line.toLowerCase().startsWith('item')) return
        const parts = line.split(',')
        if (parts.length >= 2) {
          const item = parseInt(parts[0])
          const ans = parts[1].trim().toUpperCase()
          if (!isNaN(item) && ans) {
            newKey.push({ item, answer: ans })
            newDraft[item] = ans
          }
        }
      })
      setAnswerKey(newKey)
      setDraftAnswers(newDraft)
      setNumItems(newKey.length)
      setInputValue(String(newKey.length))
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const handleStudentsCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const key = answerKey.filter((k) => k.answer)
    if (!key.length) {
      alert('Please set up the answer key first.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = function (e) {
      const lines = ((e.target?.result as string) || '')
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)

      const newStudents: TestCheckerStudent[] = []

      lines.forEach((line, idx) => {
        if (idx === 0 && line.toLowerCase().includes('name')) return
        const parts = line.split(',')
        if (parts.length < 2) return

        const name = parts[0].trim()
        const answers: Record<number, string> = {}
        for (let i = 1; i < parts.length; i++) {
          const ans = parts[i].trim().toUpperCase()
          if (ans) answers[i] = ans
        }

        let score = 0
        const wrongItems: string[] = []
        key.forEach((k) => {
          const given = answers[k.item] || '?'
          if (given !== k.answer) {
            wrongItems.push(`${k.item}(${given}→${k.answer})`)
          } else {
            score++
          }
        })

        const pct = Math.round((score / key.length) * 100)
        const passed = pct >= passingPct

        newStudents.push({
          id: generateId(),
          name,
          answers,
          score,
          pct,
          passed,
          wrongItems
        })
      })
      setStudents((prev) => [...prev, ...newStudents])
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const handleSubmitStudent = () => {
    const name = studentName.trim()
    if (!name) {
      alert('Please enter a student name.')
      return
    }

    const key = answerKey.filter((k) => k.answer)
    if (!key.length) {
      alert('Please set up the answer key first.')
      return
    }

    let score = 0
    const wrongItems: string[] = []
    key.forEach((k) => {
      const given = currentStudentAnswers[k.item] || '?'
      if (given !== k.answer) {
        wrongItems.push(`${k.item}(${given}→${k.answer})`)
      } else {
        score++
      }
    })

    const pct = Math.round((score / key.length) * 100)
    const passed = pct >= passingPct

    const newStudent: TestCheckerStudent = {
      id: generateId(),
      name,
      answers: { ...currentStudentAnswers },
      score,
      pct,
      passed,
      wrongItems
    }

    setStudents((prev) => [...prev, newStudent])
    setStudentName('')
    setCurrentStudentAnswers({})
  }

  const handleExportCSV = () => {
    if (!students.length) {
      alert('No students to export.')
      return
    }

    const key = answerKey.filter((k) => k.answer)
    let csv = 'Name,Score,Percentage,Result'
    key.forEach((k) => {
      csv += `,Item${k.item}`
    })
    csv += '\n'

    students.forEach((s) => {
      csv += `"${s.name}",${s.score},${s.pct}%,${s.passed ? 'Passed' : 'Failed'}`
      key.forEach((k) => {
        csv += `,${s.answers[k.item] || ''}`
      })
      csv += '\n'
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(testName || 'test-results').replace(/\s+/g, '_')}_results.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all students and answer key?')) {
      setStudents([])
      setAnswerKey([])
      setDraftAnswers({})
      setNumItems(5)
      setInputValue('5')
      setTestName('')
      setSubject('')
      setPassingPct(75)
      setDate('')
      setCurrentStudentAnswers({})
    }
  }

  const getWrongItems = (student: TestCheckerStudent): string => {
    if (student.wrongItems && student.wrongItems.length > 0) {
      return student.wrongItems.join(' ')
    }
    const key = answerKey.filter((k) => k.answer)
    const wrongItems: string[] = []
    key.forEach((k) => {
      const given = student.answers[k.item] || '?'
      if (given !== k.answer) {
        wrongItems.push(`${k.item}(${given}→${k.answer})`)
      }
    })
    return wrongItems.length > 0 ? wrongItems.join(' ') : '—'
  }

  const getItemAnalysis = (): { item: number; pct: number }[] => {
    const key = answerKey.filter((k) => k.answer)
    if (!key.length || !students.length) return []

    return key.map((k) => {
      const correct = students.filter((s) => s.answers[k.item] === k.answer).length
      const pct = Math.round((correct / students.length) * 100)
      return { item: k.item, pct }
    })
  }

  const classAvg = students.length
    ? Math.round(students.reduce((sum, s) => sum + s.pct, 0) / students.length)
    : 0
  const passedCount = students.filter((s) => s.passed).length

  // Helper for keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      const currentInput = e.currentTarget
      const container = currentInput.closest('div[id$="-grid"], div[id$="-answers"]')
      if (!container) return

      const inputs = Array.from(container.querySelectorAll('input'))
      const index = inputs.indexOf(currentInput)
      if (index !== -1 && index < inputs.length - 1) {
        ;(inputs[index + 1] as HTMLInputElement).focus()
      }
    } else if (e.key === 'ArrowUp') {
      const currentInput = e.currentTarget
      const container = currentInput.closest('div[id$="-grid"], div[id$="-answers"]')
      if (!container) return

      const inputs = Array.from(container.querySelectorAll('input'))
      const index = inputs.indexOf(currentInput)
      if (index > 0) {
        ;(inputs[index - 1] as HTMLInputElement).focus()
      }
    }
  }

  return (
    <div className="panel active" id="panel-checker">
      <div className="section-header">
        <div className="section-title">
          <h2>📝 Test Paper Checker</h2>
          <p>Upload answer key via CSV or input manually, then check student answers</p>
        </div>
      </div>

      <div
        style={{ display: 'flex', gap: '16px', height: 'calc(100vh - 200px)', overflow: 'hidden' }}
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
          {/* Answer Key Input Mode */}
          <Card>
            <div className="card-header">
              <div className="card-title">
                <div className="card-title-icon">🔑</div>
                Answer Key
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
                <div
                  style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}
                >
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
                    value={inputValue}
                    onChange={(e) => {
                      const val = e.target.value
                      setInputValue(val)
                      const parsed = parseInt(val)
                      if (isNaN(parsed) || parsed <= 0) {
                        setNumItems(5)
                      } else {
                        setNumItems(Math.min(100, parsed))
                      }
                    }}
                    className="form-input"
                    style={{ width: '80px', padding: '8px', fontSize: '13px' }}
                  />
                  <Button
                    onClick={handleBuildGrid}
                    style={{ fontSize: '11px', padding: '4px 10px' }}
                  >
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
                  {Array.from({ length: numItems }, (_, i) => i + 1).map((i) => {
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
                          maxLength={1}
                          value={itemValue}
                          onChange={(e) => handleAnswerKeyChange(i, e.target.value)}
                          onKeyDown={handleKeyDown}
                          style={{
                            width: '32px',
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
                <div
                  style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}
                >
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
                    3,B
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

          {/* Test Settings */}
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
                  onChange={(e) => setTestName(e.target.value)}
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
                  onChange={(e) => setSubject(e.target.value)}
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
                  onChange={(e) => setPassingPct(parseInt(e.target.value) || 75)}
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
                  onChange={(e) => setDate(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '12px' }}
                />
              </div>
            </div>
          </Card>

          {/* Student Answers Input */}
          <Card>
            <div className="card-header">
              <div className="card-title">
                <div className="card-title-icon">👤</div>
                Student Answers
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="form-input"
                placeholder="Student name"
                style={{ flex: 1, fontSize: '12px' }}
              />
              <Button
                onClick={handleSubmitStudent}
                style={{
                  fontSize: '11px',
                  padding: '4px 10px',
                  whiteSpace: 'nowrap',
                  background: '#1a6b3a',
                  color: '#fff'
                }}
              >
                + Add
              </Button>
            </div>
            <div
              id="chk-stud-answers"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '4px',
                maxHeight: '200px',
                overflowY: 'auto',
                padding: '4px',
                background: 'var(--navy-mid)',
                borderRadius: '6px'
              }}
            >
              {(mode === 'csv' || answerKey.some((k) => k.answer)
                ? answerKey.filter((k) => mode === 'csv' || k.answer)
                : Array.from({ length: numItems }, (_, i) => ({ item: i + 1 }))
              ).map((k) => (
                <div
                  key={k.item}
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
                    {k.item}
                  </span>
                  <input
                    type="text"
                    maxLength={1}
                    value={currentStudentAnswers[k.item] || ''}
                    onChange={(e) => handleStudentAnswerChange(k.item, e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                      width: '32px',
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
              ))}
            </div>
            <div style={{ marginTop: '8px', display: 'flex', gap: '6px' }}>
              <Button
                onClick={handleSubmitStudent}
                style={{
                  flex: 1,
                  fontSize: '11px',
                  background: '#1a6b3a',
                  color: '#fff'
                }}
              >
                ✔ Check & Add
              </Button>
              <Button
                onClick={() => document.getElementById('chk-stud-csv')?.click()}
                style={{ fontSize: '11px', background: '#2c5282', color: '#fff' }}
              >
                📂 CSV
              </Button>
              <input
                type="file"
                id="chk-stud-csv"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={handleStudentsCSV}
              />
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
              Student CSV:{' '}
              <code
                style={{ background: 'var(--navy-mid)', padding: '1px 3px', borderRadius: '3px' }}
              >
                name,A,B,C,D,...
              </code>
            </div>
          </Card>
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
          {/* Summary Bar */}
          {students.length > 0 && (
            <div
              id="chk-summary"
              style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}
            >
              <div style={{ fontSize: '12px' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Test:</span>{' '}
                <strong>{testName || '—'}</strong>
              </div>
              <div style={{ fontSize: '12px' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Items:</span>{' '}
                <strong>{answerKey.filter((k) => k.answer).length || numItems}</strong>
              </div>
              <div style={{ fontSize: '12px' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Students:</span>{' '}
                <strong>{students.length}</strong>
              </div>
              <div style={{ fontSize: '12px' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Class Avg:</span>{' '}
                <strong style={{ color: classAvg >= passingPct ? '#4ade80' : '#f87171' }}>
                  {classAvg}%
                </strong>
              </div>
              <div style={{ fontSize: '12px' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Passed:</span>{' '}
                <strong style={{ color: '#4ade80' }}>
                  {passedCount}/{students.length}
                </strong>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
                <Button
                  onClick={handleExportCSV}
                  style={{ fontSize: '11px', background: '#1a4a2a', color: '#fff' }}
                >
                  ⬇ Export CSV
                </Button>
                <Button
                  onClick={handleClearAll}
                  style={{ fontSize: '11px', background: '#c0392b', color: '#fff' }}
                >
                  🗑 Clear All
                </Button>
              </div>
            </div>
          )}

          {/* Results Table */}
          <div
            style={{
              flex: 1,
              overflow: 'auto',
              background: 'var(--navy-mid)',
              borderRadius: '8px',
              padding: '8px'
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
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: '13px',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ fontSize: '32px' }}>📋</div>
                <div>Set up your answer key and add students to begin</div>
              </div>
            ) : (
              <table
                id="chk-results-table"
                style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '6px 8px',
                        color: 'var(--gold)',
                        fontSize: '11px',
                        fontWeight: 600,
                        borderBottom: '1px solid var(--navy-light)',
                        whiteSpace: 'nowrap',
                        position: 'sticky',
                        top: 0,
                        background: 'var(--navy-mid)'
                      }}
                    >
                      #
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '6px 8px',
                        color: 'var(--gold)',
                        fontSize: '11px',
                        fontWeight: 600,
                        borderBottom: '1px solid var(--navy-light)',
                        whiteSpace: 'nowrap',
                        position: 'sticky',
                        top: 0,
                        background: 'var(--navy-mid)'
                      }}
                    >
                      Name
                    </th>
                    <th
                      style={{
                        textAlign: 'center',
                        padding: '6px 8px',
                        color: 'var(--gold)',
                        fontSize: '11px',
                        fontWeight: 600,
                        borderBottom: '1px solid var(--navy-light)',
                        whiteSpace: 'nowrap',
                        position: 'sticky',
                        top: 0,
                        background: 'var(--navy-mid)'
                      }}
                    >
                      Score
                    </th>
                    <th
                      style={{
                        textAlign: 'center',
                        padding: '6px 8px',
                        color: 'var(--gold)',
                        fontSize: '11px',
                        fontWeight: 600,
                        borderBottom: '1px solid var(--navy-light)',
                        whiteSpace: 'nowrap',
                        position: 'sticky',
                        top: 0,
                        background: 'var(--navy-mid)'
                      }}
                    >
                      Pct
                    </th>
                    <th
                      style={{
                        textAlign: 'center',
                        padding: '6px 8px',
                        color: 'var(--gold)',
                        fontSize: '11px',
                        fontWeight: 600,
                        borderBottom: '1px solid var(--navy-light)',
                        whiteSpace: 'nowrap',
                        position: 'sticky',
                        top: 0,
                        background: 'var(--navy-mid)'
                      }}
                    >
                      Result
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '6px 8px',
                        color: 'var(--gold)',
                        fontSize: '11px',
                        fontWeight: 600,
                        borderBottom: '1px solid var(--navy-light)',
                        whiteSpace: 'nowrap',
                        position: 'sticky',
                        top: 0,
                        background: 'var(--navy-mid)'
                      }}
                    >
                      Wrong Items
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => (
                    <tr
                      key={student.id}
                      style={{
                        borderBottom: '1px solid var(--navy-light)',
                        background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'
                      }}
                    >
                      <td
                        style={{
                          padding: '5px 8px',
                          fontSize: '11px',
                          color: 'rgba(255,255,255,0.6)'
                        }}
                      >
                        {idx + 1}
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          fontSize: '11px',
                          color: 'white',
                          fontWeight: 500
                        }}
                      >
                        {student.name}
                      </td>
                      <td
                        style={{
                          textAlign: 'center',
                          padding: '5px 8px',
                          fontSize: '11px',
                          color: 'white',
                          fontWeight: 500
                        }}
                      >
                        {student.score}/{answerKey.filter((k) => k.answer).length || numItems}
                      </td>
                      <td
                        style={{
                          textAlign: 'center',
                          padding: '5px 8px',
                          fontSize: '11px',
                          fontWeight: 500,
                          color: student.pct >= passingPct ? '#4ade80' : '#f87171'
                        }}
                      >
                        {student.pct}%
                      </td>
                      <td style={{ textAlign: 'center', padding: '5px 8px', fontSize: '11px' }}>
                        {student.passed ? (
                          <span
                            style={{
                              background: '#166534',
                              color: '#4ade80',
                              padding: '1px 7px',
                              borderRadius: '10px',
                              fontSize: '10px',
                              fontWeight: 'bold'
                            }}
                          >
                            PASSED
                          </span>
                        ) : (
                          <span
                            style={{
                              background: '#7f1d1d',
                              color: '#f87171',
                              padding: '1px 7px',
                              borderRadius: '10px',
                              fontSize: '10px',
                              fontWeight: 'bold'
                            }}
                          >
                            FAILED
                          </span>
                        )}
                      </td>
                      <td
                        style={{
                          padding: '5px 8px',
                          fontSize: '10px',
                          color: 'rgba(255,255,255,0.4)'
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

          {/* Item Analysis */}
          {students.length > 0 && (
            <Card>
              <div className="card-header">
                <div className="card-title">
                  <div className="card-title-icon">📊</div>
                  Item Analysis
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'flex-end',
                  height: '60px',
                  overflowX: 'auto',
                  paddingBottom: '4px'
                }}
              >
                {(() => {
                  const analysis = getItemAnalysis()
                  if (analysis.length === 0) {
                    return (
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
                        No items to analyze
                      </div>
                    )
                  }
                  return analysis.map(({ item, pct }) => (
                    <div
                      key={item}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                        minWidth: '14px'
                      }}
                    >
                      <div
                        title={`Item ${item}: ${pct}%`}
                        style={{
                          width: '12px',
                          background: pct < 50 ? '#f87172' : '#4ade80',
                          height: `${Math.max(2, pct * 0.54)}px`,
                          borderRadius: '2px 2px 0 0',
                          cursor: 'pointer'
                        }}
                      />
                      <div
                        style={{
                          fontSize: '6px',
                          color: 'rgba(255,255,255,0.4)',
                          transform: 'rotate(-90deg)',
                          whiteSpace: 'nowrap',
                          marginTop: '2px'
                        }}
                      >
                        {item}
                      </div>
                    </div>
                  ))
                })()}
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                Bar height = % of students who got the item correct. Red = below 50%.
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default TestCheckerPage
