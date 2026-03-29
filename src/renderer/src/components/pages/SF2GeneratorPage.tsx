import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import Button from '../ui/Button'
import FormSelect from '../ui/FormSelect'
import React from 'react'

function SF2GeneratorPage(): React.JSX.Element {
  const { school, section, students } = useApp()
  const [selectedMonth, setSelectedMonth] = useState('June')

  const months = [
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
    'January',
    'February',
    'March',
    'April'
  ]

  const monthOptions = months.map((m) => ({ value: m, label: m }))

  return (
    <div className="panel active" id="panel-sf2">
      <div className="section-header">
        <div className="section-title">
          <h2>School Form 2 (SF2)</h2>
          <p>Daily Attendance Register — Monthly attendance record</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <FormSelect
            id="sf2-month"
            value={selectedMonth}
            onChange={setSelectedMonth}
            options={monthOptions}
          />
          <Button onClick={() => window.print()}>🖨️ Print SF2</Button>
        </div>
      </div>

      <div className="form-preview" id="sf2-preview">
        <div className="form-header-ph">
          <div className="agency">Republic of the Philippines · Department of Education</div>
          <div className="school-name" id="sf2-school-name">
            {school.name || 'School Name'}
          </div>
          <div className="form-name">SCHOOL FORM 2 (SF2) – Daily Attendance Register</div>
          <div style={{ fontSize: '8px', opacity: 0.8, marginTop: '2px' }}>
            Month: {selectedMonth} · S.Y. {school.year || '2025–2026'} · Grade{' '}
            {section.gradeLevel || '11'}
          </div>
        </div>
        <div className="form-body" style={{ fontSize: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8px' }}>
            <thead>
              <tr style={{ background: '#e8e8e8' }}>
                <th style={{ border: '0.5px solid #888', padding: '2px', width: '20px' }}>#</th>
                <th style={{ border: '0.5px solid #888', padding: '2px', width: '90px' }}>NAME</th>
                <th style={{ border: '0.5px solid #888', padding: '2px' }} colSpan={5}>
                  WEEK 1
                </th>
                <th style={{ border: '0.5px solid #888', padding: '2px' }} colSpan={5}>
                  WEEK 2
                </th>
                <th style={{ border: '0.5px solid #888', padding: '2px' }} colSpan={5}>
                  WEEK 3
                </th>
                <th style={{ border: '0.5px solid #888', padding: '2px' }} colSpan={5}>
                  WEEK 4
                </th>
                <th style={{ border: '0.5px solid #888', padding: '2px' }}>TOTAL DAYS</th>
                <th style={{ border: '0.5px solid #888', padding: '2px' }}>ABSENT</th>
              </tr>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ border: '0.5px solid #888', padding: '1px' }}></th>
                <th style={{ border: '0.5px solid #888', padding: '1px' }}></th>
                <th style={{ border: '0.5px solid #888', padding: '1px' }}>M</th>
                <th style={{ border: '0.5px solid #888', padding: '1px' }}>T</th>
                <th style={{ border: '0.5px solid #888', padding: '1px' }}>W</th>
                <th style={{ border: '0.5px solid #888', padding: '1px' }}>TH</th>
                <th style={{ border: '0.5px solid #888', padding: '1px' }}>F</th>
                <th style={{ border: '0.5px solid #888', padding: '1px' }}>M</th>
                <th style={{ border: '0.5px solid #888', padding: '1px' }}>T</th>
                <th style={{ border: '0.5px solid #888', padding: '1px' }}>W</th>
                <th style={{ border: '0.5px solid #888', padding: '1px' }}>TH</th>
                <th style={{ border: '0.5px solid #888', padding: '1px' }}>F</th>
                <th style={{ border: '0.5px solid #888', padding: '1px' }}>M</th>
                <th style={{ border: '0.5px solid #888', padding: '1px' }}>T</th>
                <th style={{ border: '0.5px solid #888', padding: '1px' }}>W</th>
                <th style={{ border: '0.5px solid #888', padding: '1px' }}>TH</th>
                <th style={{ border: '0.5px solid #888', padding: '1px' }}>F</th>
                <th style={{ border: '0.5px solid #888', padding: '1px' }}>M</th>
                <th style={{ border: '0.5px solid #888', padding: '1px' }}>T</th>
                <th style={{ border: '0.5px solid #888', padding: '1px' }}>W</th>
                <th style={{ border: '0.5px solid #888', padding: '1px' }}>TH</th>
                <th style={{ border: '0.5px solid #888', padding: '1px' }}>F</th>
                <th style={{ border: '0.5px solid #888', padding: '1px' }}></th>
                <th style={{ border: '0.5px solid #888', padding: '1px' }}></th>
              </tr>
            </thead>
            <tbody id="sf2-tbody">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={24} style={{ textAlign: 'center', padding: '12px', color: '#666' }}>
                    Add students to generate attendance form
                  </td>
                </tr>
              ) : (
                students.map((student, index) => (
                  <tr key={student.id}>
                    <td style={{ border: '0.5px solid #888', padding: '1px', textAlign: 'center' }}>
                      {index + 1}
                    </td>
                    <td style={{ border: '0.5px solid #888', padding: '1px' }}>
                      {student.lastname}, {student.firstname}
                    </td>
                    {Array(20)
                      .fill(null)
                      .map((_, i) => (
                        <td
                          key={i}
                          style={{
                            border: '0.5px solid #888',
                            padding: '1px',
                            textAlign: 'center'
                          }}
                        ></td>
                      ))}
                    <td style={{ border: '0.5px solid #888', padding: '1px', textAlign: 'center' }}>
                      -
                    </td>
                    <td style={{ border: '0.5px solid #888', padding: '1px', textAlign: 'center' }}>
                      -
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SF2GeneratorPage
