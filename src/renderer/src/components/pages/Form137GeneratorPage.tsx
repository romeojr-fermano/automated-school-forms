import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import Button from '../ui/Button'
import FormSelect from '../ui/FormSelect'
import React from 'react'

function Form137GeneratorPage(): React.JSX.Element {
  const { school, students } = useApp()
  const [selectedStudentId, setSelectedStudentId] = useState('')

  const studentOptions = [
    { value: '', label: 'Select Student...' },
    ...students.map((s) => ({ value: s.id, label: `${s.lastname}, ${s.firstname}` }))
  ]

  const selectedStudent = students.find((s) => s.id === selectedStudentId)

  return (
    <div className="panel active" id="panel-f137">
      <div className="section-header">
        <div className="section-title">
          <h2>Form 137 – Permanent Record / Transcript of Records</h2>
          <p>Official academic transcript for SHS graduates</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <FormSelect
            id="f137-student"
            value={selectedStudentId}
            onChange={setSelectedStudentId}
            options={studentOptions}
          />
          <Button onClick={() => window.print()}>🖨️ Print</Button>
        </div>
      </div>

      {selectedStudentId === '' ? (
        <div className="info-box">
          Select a student above to generate their Form 137 (Permanent Record / Transcript of
          Records).
        </div>
      ) : (
        selectedStudent && (
          <div className="form-preview">
            <div className="form-header-ph">
              <div className="agency">Republic of the Philippines · Department of Education</div>
              <div className="school-name">{school.name || 'School Name'}</div>
              <div className="form-name">FORM 137 – Permanent Record / Transcript of Records</div>
            </div>
            <div className="form-body">
              <div className="form-section-title">LEARNER INFORMATION</div>
              <div style={{ fontFamily: 'Arial', fontSize: '9px', padding: '8px' }}>
                <div>
                  <strong>LRN:</strong> {selectedStudent.lrn}
                </div>
                <div>
                  <strong>Name:</strong> {selectedStudent.lastname}, {selectedStudent.firstname}{' '}
                  {selectedStudent.middleInitial}
                </div>
                <div>
                  <strong>Sex:</strong> {selectedStudent.sex}
                </div>
              </div>
              <div className="form-section-title">ACADEMIC RECORD</div>
              <div
                style={{
                  fontFamily: 'Arial',
                  fontSize: '9px',
                  textAlign: 'center',
                  padding: '20px',
                  color: '#666'
                }}
              >
                Complete transcript will be displayed here.
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default Form137GeneratorPage
