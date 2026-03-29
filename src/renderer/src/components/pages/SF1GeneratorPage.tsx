import { useApp } from '../../context/AppContext'
import Button from '../ui/Button'
import React from 'react'

function SF1GeneratorPage(): React.JSX.Element {
  const { school, section, adviser, principal, students } = useApp()

  return (
    <div className="panel active" id="panel-sf1">
      <div className="section-header">
        <div className="section-title">
          <h2>School Form 1 (SF1)</h2>
          <p>School Register — Official record of enrolled learners</p>
        </div>
        <Button onClick={() => window.print()}>🖨️ Print SF1</Button>
      </div>

      <div className="form-preview" id="sf1-preview">
        <div className="form-header-ph">
          <div className="agency">Republic of the Philippines · Department of Education</div>
          <div className="school-name" id="sf1-school-name">
            {school.name || 'School Name'}
          </div>
          <div className="form-name">SCHOOL FORM 1 (SF1) – School Register</div>
          <div style={{ fontSize: '8px', opacity: 0.8, marginTop: '2px' }}>
            S.Y. {school.year || '2025–2026'} · Grade {section.gradeLevel || '11'} · Section:{' '}
            {section.name || '__________'}
          </div>
        </div>
        <div className="form-body">
          <div className="form-section-title">LEARNER INFORMATION</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px' }}>
            <thead>
              <tr style={{ background: '#e8e8e8' }}>
                <th style={{ border: '0.5px solid #888', padding: '3px', width: '24px' }}>#</th>
                <th style={{ border: '0.5px solid #888', padding: '3px', width: '110px' }}>LRN</th>
                <th style={{ border: '0.5px solid #888', padding: '3px' }}>LAST NAME</th>
                <th style={{ border: '0.5px solid #888', padding: '3px' }}>FIRST NAME</th>
                <th style={{ border: '0.5px solid #888', padding: '3px', width: '24px' }}>M.I.</th>
                <th style={{ border: '0.5px solid #888', padding: '3px', width: '26px' }}>SEX</th>
                <th style={{ border: '0.5px solid #888', padding: '3px', width: '58px' }}>
                  BIRTHDATE
                </th>
                <th style={{ border: '0.5px solid #888', padding: '3px', width: '22px' }}>AGE</th>
                <th style={{ border: '0.5px solid #888', padding: '3px' }}>MOTHER TONGUE</th>
              </tr>
            </thead>
            <tbody id="sf1-tbody">
              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    style={{ textAlign: 'center', padding: '12px', color: '#666', fontSize: '9px' }}
                  >
                    No students enrolled. Go to Master List to add students.
                  </td>
                </tr>
              ) : (
                students.map((student, index) => (
                  <tr key={student.id}>
                    <td style={{ border: '0.5px solid #888', padding: '2px', textAlign: 'center' }}>
                      {index + 1}
                    </td>
                    <td style={{ border: '0.5px solid #888', padding: '2px' }}>{student.lrn}</td>
                    <td style={{ border: '0.5px solid #888', padding: '2px' }}>
                      {student.lastname}
                    </td>
                    <td style={{ border: '0.5px solid #888', padding: '2px' }}>
                      {student.firstname}
                    </td>
                    <td style={{ border: '0.5px solid #888', padding: '2px', textAlign: 'center' }}>
                      {student.middleInitial}
                    </td>
                    <td style={{ border: '0.5px solid #888', padding: '2px', textAlign: 'center' }}>
                      {student.sex}
                    </td>
                    <td style={{ border: '0.5px solid #888', padding: '2px' }}>
                      {student.birthdate}
                    </td>
                    <td style={{ border: '0.5px solid #888', padding: '2px', textAlign: 'center' }}>
                      -
                    </td>
                    <td style={{ border: '0.5px solid #888', padding: '2px' }}>
                      {student.motherTongue}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div
            style={{
              display: 'flex',
              gap: '24px',
              marginTop: '12px',
              fontSize: '9px',
              fontFamily: 'Arial'
            }}
          >
            <div>
              <strong>Prepared by:</strong>
              <br />
              <div
                style={{ borderBottom: '0.5px solid #999', width: '200px', marginTop: '16px' }}
              ></div>
              <span id="sf1-adviser">{adviser.name || 'Class Adviser'}</span>
              <br />
              Class Adviser
            </div>
            <div>
              <strong>Certified Correct:</strong>
              <br />
              <div
                style={{ borderBottom: '0.5px solid #999', width: '200px', marginTop: '16px' }}
              ></div>
              <span id="sf1-principal">{principal.name || 'School Principal'}</span>
              <br />
              School Principal
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SF1GeneratorPage
