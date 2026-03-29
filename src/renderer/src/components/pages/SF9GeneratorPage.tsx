import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import Button from '../ui/Button'
import FormSelect from '../ui/FormSelect'
import React from 'react'

function SF9GeneratorPage(): React.JSX.Element {
  const { school, adviser, principal, students, subjects, grades } = useApp()
  const [selectedStudentId, setSelectedStudentId] = useState('')

  const studentOptions = [
    { value: '', label: 'Select Student...' },
    ...students.map((s) => ({ value: s.id, label: `${s.lastname}, ${s.firstname}` }))
  ]

  const selectedStudent = students.find((s) => s.id === selectedStudentId)

  return (
    <div className="panel active" id="panel-sf9">
      <div className="section-header">
        <div className="section-title">
          <h2>School Form 9 (SF9)</h2>
          <p>Learner's Progress Report Card — End-of-Quarter Report</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <FormSelect
            id="sf9-student"
            value={selectedStudentId}
            onChange={setSelectedStudentId}
            options={studentOptions}
          />
          <Button onClick={() => window.print()}>🖨️ Print</Button>
        </div>
      </div>

      {selectedStudentId === '' ? (
        <div className="info-box">Select a student above to preview their Report Card (SF9).</div>
      ) : (
        selectedStudent && (
          <div className="form-preview" id="sf9-preview">
            <div className="form-header-ph">
              <div className="agency">Republic of the Philippines · Department of Education</div>
              <div className="school-name">{school.name || 'School Name'}</div>
              <div className="form-name">SCHOOL FORM 9 (SF9) – Learner's Progress Report Card</div>
            </div>
            <div className="form-body">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr 1fr',
                  gap: '8px',
                  padding: '8px 12px',
                  fontFamily: 'Arial',
                  fontSize: '9px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>LEARNER NAME</div>
                  <div>
                    {selectedStudent.lastname}, {selectedStudent.firstname}{' '}
                    {selectedStudent.middleInitial}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>LRN</div>
                  <div>{selectedStudent.lrn}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>SEX</div>
                  <div>{selectedStudent.sex}</div>
                </div>
              </div>

              <div className="form-section-title">SUBJECTS AND GRADES</div>
              <table className="grade-table">
                <thead>
                  <tr>
                    <th rowSpan={2} style={{ width: '30%' }}>
                      Subjects
                    </th>
                    <th colSpan={4}>Quarter</th>
                    <th rowSpan={2}>Final Grade</th>
                  </tr>
                  <tr>
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                    <th>4</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject) => {
                    const studentGrades = grades[selectedStudent.id] || []
                    const q1 = studentGrades.find(
                      (g) => g.subjectId === subject.id && g.quarter === 'q1'
                    )?.grade
                    const q2 = studentGrades.find(
                      (g) => g.subjectId === subject.id && g.quarter === 'q2'
                    )?.grade
                    const q3 = studentGrades.find(
                      (g) => g.subjectId === subject.id && g.quarter === 'q3'
                    )?.grade
                    const q4 = studentGrades.find(
                      (g) => g.subjectId === subject.id && g.quarter === 'q4'
                    )?.grade
                    const validGrades = [q1, q2, q3, q4].filter(
                      (g) => g !== null && g !== undefined
                    )
                    const final =
                      validGrades.length > 0
                        ? Math.round(validGrades.reduce((a, b) => a + b, 0) / validGrades.length)
                        : null

                    return (
                      <tr key={subject.id}>
                        <td className="subject-name">{subject.name}</td>
                        <td>{q1 ?? ''}</td>
                        <td>{q2 ?? ''}</td>
                        <td>{q3 ?? ''}</td>
                        <td>{q4 ?? ''}</td>
                        <td>{final ?? ''}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '16px',
                  fontSize: '9px',
                  fontFamily: 'Arial'
                }}
              >
                <div>
                  <strong>Adviser:</strong> {adviser.name || '______________'}
                </div>
                <div>
                  <strong>Principal:</strong> {principal?.name || '______________'}
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default SF9GeneratorPage
