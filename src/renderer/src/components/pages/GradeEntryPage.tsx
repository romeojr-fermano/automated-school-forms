import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import Card from '../ui/Card'
import Button from '../ui/Button'
import FormSelect from '../ui/FormSelect'
import { Quarter, SubjectGrade } from '../../types'
import React from 'react'

function GradeEntryPage(): React.JSX.Element {
  const { students, subjects, grades, setGrades, activeSection } = useApp()
  const [selectedQuarter, setSelectedQuarter] = useState<Quarter>('q1')
  const [isComputed, setIsComputed] = useState(false)

  useEffect(() => {
    const element = document.getElementById(activeSection)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeSection])

  const quarterOptions = [
    { value: 'q1', label: '1st Quarter' },
    { value: 'q2', label: '2nd Quarter' },
    { value: 'q3', label: '3rd Quarter' },
    { value: 'q4', label: '4th Quarter' }
  ]

  const getGrade = (studentId: string, subjectId: string): string => {
    const studentGrades: SubjectGrade[] = (grades[studentId] as SubjectGrade[]) || []
    const subjectGrade = studentGrades.find(
      (g) => g.subjectId === subjectId && g.quarter === selectedQuarter
    )
    return subjectGrade?.grade !== null && subjectGrade?.grade !== undefined
      ? String(subjectGrade.grade)
      : ''
  }

  const handleGradeChange = (studentId: string, subjectId: string, value: string) => {
    const gradeValue = value === '' ? null : Number(value)

    const currentGrades = grades
    const studentGrades: SubjectGrade[] = currentGrades[studentId] || []
    const existingIndex = studentGrades.findIndex(
      (g) => g.subjectId === subjectId && g.quarter === selectedQuarter
    )

    let updatedStudentGrades: SubjectGrade[]
    if (existingIndex >= 0) {
      updatedStudentGrades = [...studentGrades]
      updatedStudentGrades[existingIndex] = {
        subjectId,
        quarter: selectedQuarter,
        grade: gradeValue
      }
    } else {
      updatedStudentGrades = [
        ...studentGrades,
        {
          subjectId,
          quarter: selectedQuarter,
          grade: gradeValue
        }
      ]
    }

    setGrades({
      ...currentGrades,
      [studentId]: updatedStudentGrades
    })
    setIsComputed(false)
  }

  const computeAverages = () => {
    students.forEach((student) => {
      const studentGrades: SubjectGrade[] = (grades[student.id] as SubjectGrade[]) || []
      subjects.forEach((subject) => {
        const subjectGrades = studentGrades.filter(
          (g) => g.subjectId === subject.id && g.quarter !== 'final'
        )
        const validGrades = subjectGrades.filter((g) => g.grade !== null && g.grade !== undefined)

        if (validGrades.length > 0) {
          const sum = validGrades.reduce((acc, g) => acc + (g.grade || 0), 0)
          const average = Math.round(sum / validGrades.length)

          const finalGradeIndex = studentGrades.findIndex(
            (g) => g.subjectId === subject.id && g.quarter === 'final'
          )

          let updatedGrades = [...studentGrades]
          if (finalGradeIndex >= 0) {
            updatedGrades[finalGradeIndex] = {
              subjectId: subject.id,
              quarter: 'final',
              grade: average
            }
          } else {
            updatedGrades.push({ subjectId: subject.id, quarter: 'final', grade: average })
          }

          setGrades({
            ...grades,
            [student.id]: updatedGrades
          })
        }
      })
    })
    setIsComputed(true)
  }

  const getQuarterLabel = (q: Quarter): string => {
    const labels: Partial<Record<Quarter, string>> = {
      q1: '1st Quarter',
      q2: '2nd Quarter',
      q3: '3rd Quarter',
      q4: '4th Quarter',
      final: 'Final Grade'
    }
    return labels[q] || ''
  }

  const getFinalGrade = (studentId: string, subjectId: string): number | null => {
    const studentGrades: SubjectGrade[] = (grades[studentId] as SubjectGrade[]) || []
    const finalGrade = studentGrades.find((g) => g.subjectId === subjectId && g.quarter === 'final')
    return finalGrade?.grade ?? null
  }

  return (
    <div className="panel active" id="panel-grades">
      <div className="section-header">
        <div className="section-title">
          <h2>Grade Entry</h2>
          <p>Enter quarterly grades per subject per student</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <FormSelect
            id="grade-quarter"
            value={selectedQuarter}
            onChange={(val) => setSelectedQuarter(val as Quarter)}
            options={quarterOptions}
          />
          <Button onClick={computeAverages}>⚡ Compute Averages</Button>
        </div>
      </div>

      <div className="info-box">
        <strong>Grading System (DepEd Order No. 8, s. 2015):</strong> Grades are expressed as whole
        numbers from 60–100. The passing grade is 75. Final Grade is the average of quarterly
        grades.
      </div>

      <Card id="subjects">
        <div className="card-header">
          <div className="card-title">
            <div className="card-title-icon">📊</div>
            <span id="grade-table-title">{getQuarterLabel(selectedQuarter)} Grades</span>
          </div>
          <span className={`badge ${isComputed ? 'badge-green' : 'badge-blue'}`} id="grade-status">
            {isComputed ? 'Computed' : 'Not yet computed'}
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" id="grade-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                {subjects.map((subject) => (
                  <th key={subject.id}>{subject.name}</th>
                ))}
                {subjects.length > 0 && <th>Final</th>}
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan={subjects.length + 3}
                    style={{
                      textAlign: 'center',
                      padding: '32px',
                      color: 'rgba(255,255,255,0.25)'
                    }}
                  >
                    No students enrolled. Go to Master List to add students.
                  </td>
                </tr>
              ) : subjects.length === 0 ? (
                <tr>
                  <td
                    colSpan={students.length + 3}
                    style={{
                      textAlign: 'center',
                      padding: '32px',
                      color: 'rgba(255,255,255,0.25)'
                    }}
                  >
                    No subjects configured. Go to School Setup to add subjects.
                  </td>
                </tr>
              ) : (
                students.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td>
                      {student.lastname}, {student.firstname}
                    </td>
                    {subjects.map((subject) => (
                      <td key={subject.id}>
                        <input
                          className="grade-input"
                          type="number"
                          min="60"
                          max="100"
                          value={getGrade(student.id, subject.id)}
                          onChange={(e) =>
                            handleGradeChange(student.id, subject.id, e.target.value)
                          }
                          placeholder="--"
                        />
                      </td>
                    ))}
                    <td>
                      {subjects.map((subject) => {
                        const fg = getFinalGrade(student.id, subject.id)
                        return fg !== null ? (
                          <span key={subject.id} style={{ fontWeight: 600, marginRight: '8px' }}>
                            {fg}
                          </span>
                        ) : null
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default GradeEntryPage
