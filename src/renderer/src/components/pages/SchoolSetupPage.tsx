import { useApp } from '../../context/AppContext'
import Card from '../ui/Card'
import FormInput from '../ui/FormInput'
import FormSelect from '../ui/FormSelect'
import Button from '../ui/Button'
import React, { useEffect } from 'react'

function SchoolSetupPage(): React.JSX.Element {
  const {
    school,
    setSchool,
    section,
    setSection,
    adviser,
    setAdviser,
    principal,
    setPrincipal,
    subjects,
    setSubjects,
    students,
    activeSection
  } = useApp()

  useEffect(() => {
    const element = document.getElementById(activeSection)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeSection])

  const handleSave = () => {
    console.log('Saving...')
  }

  const handleAddSubject = () => {
    const newSubject = {
      id: Date.now().toString(),
      name: 'New Subject',
      category: 'Core' as const,
      units: 80,
      teacher: ''
    }
    setSubjects([...subjects, newSubject])
  }

  const handleRemoveSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id))
  }

  const handleSubjectChange = (
    id: string,
    field: keyof (typeof subjects)[0],
    value: string | number
  ) => {
    setSubjects(subjects.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const regionOptions = [
    { value: 'Region VI – Western Visayas', label: 'Region VI – Western Visayas' },
    { value: 'Region I – Ilocos', label: 'Region I – Ilocos' },
    { value: 'Region II – Cagayan Valley', label: 'Region II – Cagayan Valley' },
    { value: 'Region III – Central Luzon', label: 'Region III – Central Luzon' },
    { value: 'NCR – National Capital Region', label: 'NCR – National Capital Region' },
    { value: 'Region IV-A – CALABARZON', label: 'Region IV-A – CALABARZON' },
    { value: 'Region VII – Central Visayas', label: 'Region VII – Central Visayas' },
    { value: 'Region VIII – Eastern Visayas', label: 'Region VIII – Eastern Visayas' },
    { value: 'Region X – Northern Mindanao', label: 'Region X – Northern Mindanao' },
    { value: 'Region XI – Davao', label: 'Region XI – Davao' }
  ]

  const trackOptions = [
    { value: 'Academic', label: 'Academic' },
    { value: 'TVL', label: 'Technical-Vocational-Livelihood (TVL)' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Arts', label: 'Arts and Design' }
  ]

  const strandOptions = [
    { value: 'ABM', label: 'ABM – Accountancy, Business & Management' },
    { value: 'HUMSS', label: 'HUMSS – Humanities & Social Sciences' },
    { value: 'STEM', label: 'STEM – Science, Technology, Engineering & Math' },
    { value: 'GAS', label: 'GAS – General Academic Strand' },
    { value: 'TVL-HE', label: 'TVL – Home Economics' },
    { value: 'TVL-ICT', label: 'TVL – Information & Communication Technology' },
    { value: 'TVL-IA', label: 'TVL – Industrial Arts' },
    { value: 'TVL-AFA', label: 'TVL – Agri-Fishery Arts' }
  ]

  return (
    <div className="panel active" id="panel-setup">
      <div className="section-header">
        <div className="section-title">
          <h2>School Setup</h2>
          <p>Configure school information, section details, and academic year settings</p>
        </div>
        <Button onClick={handleSave}>💾 Save Settings</Button>
      </div>

      <div className="stat-grid">
        <div className="stat-card gold">
          <div className="stat-label">School Year</div>
          <div className="stat-value" style={{ fontSize: '20px' }}>
            {school.year}
          </div>
          <div className="stat-sub">Current Academic Year</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Total Students</div>
          <div className="stat-value">{students.length}</div>
          <div className="stat-sub">Enrolled this SY</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Subjects</div>
          <div className="stat-value">{subjects.length}</div>
          <div className="stat-sub">This semester</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">School Form Status</div>
          <div className="stat-value" style={{ fontSize: '16px', marginTop: '4px' }}>
            Ready
          </div>
          <div className="stat-sub">All forms available</div>
        </div>
      </div>

      <Card id="school-info" title="School Information" titleIcon="🏫">
        <div className="form-grid form-grid-2">
          <div className="form-group span-2">
            <FormInput
              id="school-name"
              label="School Name"
              value={school.name}
              onChange={(val) => setSchool({ ...school, name: val })}
              placeholder="e.g. Hamtic National High School"
              required
            />
          </div>
          <FormInput
            id="school-id"
            label="School ID (BEIS)"
            value={school.id}
            onChange={(val) => setSchool({ ...school, id: val })}
            placeholder="e.g. 303001"
          />
          <FormSelect
            id="school-year"
            label="School Year"
            value={school.year}
            onChange={(val) => setSchool({ ...school, year: val })}
            options={[
              { value: '2025-2026', label: '2025–2026' },
              { value: '2024-2025', label: '2024–2025' },
              { value: '2026-2027', label: '2026–2027' }
            ]}
            required
          />
          <FormSelect
            id="region"
            label="Region"
            value={school.division}
            onChange={(val) => setSchool({ ...school, division: val })}
            options={regionOptions}
          />
          <FormInput
            id="division"
            label="Division"
            value={school.district}
            onChange={(val) => setSchool({ ...school, district: val })}
            placeholder="e.g. Division of Antique"
          />
          <FormInput
            id="district"
            label="District"
            value={school.address}
            onChange={(val) => setSchool({ ...school, address: val })}
            placeholder="e.g. Hamtic District"
          />
          <div className="form-group span-2">
            <FormInput
              id="school-address"
              label="School Address"
              value={school.address}
              onChange={(val) => setSchool({ ...school, address: val })}
              placeholder="e.g. Hamtic, Antique, Western Visayas"
            />
          </div>
        </div>
      </Card>

      <Card id="section-info" title="Section & Academic Settings" titleIcon="📚">
        <div className="form-grid form-grid-3">
          <FormSelect
            id="grade-level"
            label="Grade Level"
            value={String(section.gradeLevel)}
            onChange={(val) => setSection({ ...section, gradeLevel: Number(val) as 11 | 12 })}
            options={[
              { value: '11', label: 'Grade 11' },
              { value: '12', label: 'Grade 12' }
            ]}
            required
          />
          <FormSelect
            id="semester"
            label="Semester"
            value={String(section.semester)}
            onChange={(val) => setSection({ ...section, semester: Number(val) as 1 | 2 })}
            options={[
              { value: '1', label: '1st Semester' },
              { value: '2', label: '2nd Semester' }
            ]}
            required
          />
          <FormInput
            id="section-name"
            label="Section Name"
            value={section.name}
            onChange={(val) => setSection({ ...section, name: val })}
            placeholder="e.g. Sampaguita"
          />
          <FormSelect
            id="track"
            label="Track"
            value={section.track}
            onChange={(val) =>
              setSection({ ...section, track: val as 'Academic' | 'TVL' | 'Sports' | 'Arts' })
            }
            options={trackOptions}
            required
          />
          <FormSelect
            id="strand"
            label="Strand"
            value={section.strand}
            onChange={(val) => setSection({ ...section, strand: val })}
            options={strandOptions}
            required
          />
          <FormInput
            id="room-no"
            label="Room Number"
            value={section.roomNumber}
            onChange={(val) => setSection({ ...section, roomNumber: val })}
            placeholder="e.g. Room 12"
          />
        </div>
      </Card>

      <Card id="teacher-info" title="Teacher Information" titleIcon="👨‍🏫">
        <div className="form-grid form-grid-2">
          <FormInput
            id="adviser"
            label="Class Adviser"
            value={adviser.name}
            onChange={(val) => setAdviser({ ...adviser, name: val })}
            placeholder="SURNAME, First Name M.I."
            required
          />
          <FormInput
            id="adviser-empno"
            label="Adviser Employee No."
            value={adviser.employeeNumber}
            onChange={(val) => setAdviser({ ...adviser, employeeNumber: val })}
            placeholder="e.g. EMP-001"
          />
          <FormInput
            id="principal"
            label="Principal Name"
            value={principal.name}
            onChange={(val) => setPrincipal({ ...principal, name: val })}
            placeholder="SURNAME, First Name M.I."
          />
          <FormInput
            id="principal-empno"
            label="Principal Employee No."
            value={principal.employeeNumber}
            onChange={(val) => setPrincipal({ ...principal, employeeNumber: val })}
            placeholder="e.g. EMP-001"
          />
        </div>
      </Card>

      <Card
        id="subjects"
        title="Subjects for this Section"
        titleIcon="📖"
        action={
          <Button variant="secondary" size="sm" onClick={handleAddSubject}>
            + Add Subject
          </Button>
        }
      >
        <div className="info-box">
          <strong>SHS Curriculum Note:</strong> For Grades 11–12, subjects are categorized into
          Core, Applied/Specialized, and Track-specific subjects. Default subjects are pre-loaded
          based on Grade & Track selection.
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Subject Name</th>
              <th>Category</th>
              <th>Units</th>
              <th>Subject Teacher</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{ textAlign: 'center', padding: '24px', color: 'rgba(255,255,255,0.4)' }}
                >
                  No subjects added yet. Click "+ Add Subject" to begin.
                </td>
              </tr>
            ) : (
              subjects.map((subject, index) => (
                <tr key={subject.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)' }}>
                    {index + 1}
                  </td>
                  <td>
                    <input
                      className="form-input"
                      style={{ fontSize: '12px', padding: '5px 8px' }}
                      value={subject.name}
                      onChange={(e) => handleSubjectChange(subject.id, 'name', e.target.value)}
                    />
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{ fontSize: '12px', padding: '5px 8px' }}
                      value={subject.category}
                      onChange={(e) =>
                        handleSubjectChange(
                          subject.id,
                          'category',
                          e.target.value as 'Core' | 'Applied' | 'Specialized' | 'TVL'
                        )
                      }
                    >
                      <option value="Core">Core</option>
                      <option value="Applied">Applied</option>
                      <option value="Specialized">Specialized</option>
                      <option value="TVL">TVL</option>
                    </select>
                  </td>
                  <td>
                    <input
                      className="form-input"
                      style={{
                        fontSize: '12px',
                        padding: '5px 8px',
                        width: '60px',
                        textAlign: 'center',
                        fontFamily: 'var(--font-mono)'
                      }}
                      type="number"
                      value={subject.units}
                      onChange={(e) =>
                        handleSubjectChange(subject.id, 'units', Number(e.target.value))
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="form-input"
                      style={{ fontSize: '12px', padding: '5px 8px' }}
                      value={subject.teacher}
                      placeholder="Teacher name"
                      onChange={(e) => handleSubjectChange(subject.id, 'teacher', e.target.value)}
                    />
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveSubject(subject.id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

export default SchoolSetupPage
