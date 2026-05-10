import React, { useState } from 'react'
import { useTestChecker } from './TestCheckerContext'
import Card from '../../ui/Card'
import Button from '../../ui/Button'
import { TestCheckerStudent } from '../../../types'
import { generateId, handleGridKeyDown, parseCSVLine, calculateStudentScore } from './utils'

export function StudentEntrySection(): React.JSX.Element {
  const { state, dispatch } = useTestChecker()
  const { answerKey, passingPct } = state

  const [studentName, setStudentName] = useState('')
  const [currentStudentAnswers, setCurrentStudentAnswers] = useState<Record<number, string>>({})

  const handleStudentAnswerChange = (item: number, value: string): void => {
    // Removed .slice(-1) to support multi-char answers
    const val = value.toUpperCase()
    setCurrentStudentAnswers((prev) => ({ ...prev, [item]: val }))
  }

  const handleSubmitStudent = (): void => {
    const name = studentName.trim()
    if (!name) {
      alert('Please enter a student name.')
      return
    }

    if (!answerKey.length) {
      alert('Please set up the answer key first.')
      return
    }

    // Security/Logic Fix: Use consolidated scoring logic from utils
    const scoreResult = calculateStudentScore(currentStudentAnswers, answerKey, passingPct)

    const newStudent: TestCheckerStudent = {
      id: generateId(),
      name,
      answers: { ...currentStudentAnswers },
      ...scoreResult
    }

    dispatch({ type: 'ADD_STUDENT', payload: newStudent })
    setStudentName('')
    setCurrentStudentAnswers({})
  }

  const handleStudentsCSV = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!answerKey.length) {
      alert('Please set up the answer key first.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = function (e): void {
      try {
        const content = (e.target?.result as string) || ''
        const lines = content
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean)

        const newStudents: TestCheckerStudent[] = []

        lines.forEach((line, idx) => {
          if (idx === 0 && line.toLowerCase().includes('name')) return

          // Security Fix: Use robust CSV parsing for commas in names (quoted strings)
          const parts = parseCSVLine(line)
          if (parts.length < 2) return

          const name = parts[0].trim()
          const answers: Record<number, string> = {}

          // Map parts to answer numbers (1-based index)
          for (let i = 1; i < parts.length; i++) {
            const ans = parts[i].toUpperCase()
            if (ans) answers[i] = ans
          }

          // Security/Logic Fix: Use consolidated scoring logic from utils
          const scoreResult = calculateStudentScore(answers, answerKey, passingPct)

          newStudents.push({
            id: generateId(),
            name,
            answers,
            ...scoreResult
          })
        })

        if (newStudents.length > 0) {
          dispatch({ type: 'ADD_STUDENTS_BATCH', payload: newStudents })
        } else {
          alert('No valid student records found in CSV.')
        }
      } catch (err) {
        console.error('Student CSV Import Error:', err)
        alert('Failed to parse student CSV. Please check the format.')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  return (
    <Card>
      <div className="card-header">
        <div className="card-title">
          <div className="card-title-icon">👤</div>
          Student Data Entry
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="form-input"
          placeholder="Enter student name..."
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
          display: answerKey.length > 0 ? 'grid' : 'block',
          gridTemplateColumns: answerKey.length > 0 ? 'repeat(5, 1fr)' : 'none',
          gap: '4px',
          maxHeight: '200px',
          overflowY: 'auto',
          padding: answerKey.length > 0 ? '4px' : '20px',
          background: 'var(--navy-mid)',
          borderRadius: '6px',
          textAlign: 'center'
        }}
      >
        {answerKey.length > 0 ? (
          answerKey.map((k) => (
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
                value={currentStudentAnswers[k.item] || ''}
                onChange={(e) => handleStudentAnswerChange(k.item, e.target.value)}
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
          ))
        ) : (
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
            Please build your answer key to enable student input
          </div>
        )}
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
          ✔ Check & Add Student
        </Button>
        <Button
          onClick={() => document.getElementById('chk-stud-csv')?.click()}
          style={{ fontSize: '11px', background: '#2c5282', color: '#fff' }}
        >
          📂 Import CSV
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
        Student CSV format: <code style={{ color: 'var(--gold)' }}>&quot;Lastname, Firstname&quot;,A,B,C...</code>
      </div>
    </Card>
  )
}
