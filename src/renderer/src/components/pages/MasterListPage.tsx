import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import { Student } from '../../types'
import React from 'react'

function MasterListPage(): React.JSX.Element {
  const { students, setStudents, activeSection } = useApp()

  useEffect(() => {
    const element = document.getElementById(activeSection)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeSection])

  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null)
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    lrn: '',
    lastname: '',
    firstname: '',
    middleInitial: '',
    sex: 'M',
    birthdate: '',
    motherTongue: '',
    status: 'Enrolled'
  })

  const getStudentValue = (key: keyof Student, defaultVal = ''): string => {
    const val = newStudent[key]
    return val !== undefined ? String(val) : defaultVal
  }

  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase()
    return (
      student.lrn.toLowerCase().includes(query) ||
      student.lastname.toLowerCase().includes(query) ||
      student.firstname.toLowerCase().includes(query)
    )
  })

  const calculateAge = (birthdate: string): number => {
    if (!birthdate) return 0
    const birth = new Date(birthdate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const handleSaveStudent = () => {
    if (!newStudent.lrn || !newStudent.lastname || !newStudent.firstname) {
      alert('Please fill in required fields')
      return
    }

    const studentData: Student = {
      id: editingStudentId || Date.now().toString(),
      lrn: newStudent.lrn || '',
      lastname: newStudent.lastname || '',
      firstname: newStudent.firstname || '',
      middleInitial: newStudent.middleInitial || '',
      sex: newStudent.sex || 'M',
      birthdate: newStudent.birthdate || '',
      motherTongue: newStudent.motherTongue || '',
      status: newStudent.status || 'Enrolled'
    }

    if (editingStudentId) {
      setStudents(students.map((s) => (s.id === editingStudentId ? studentData : s)))
    } else {
      setStudents([...students, studentData])
    }

    setNewStudent({
      lrn: '',
      lastname: '',
      firstname: '',
      middleInitial: '',
      sex: 'M',
      birthdate: '',
      motherTongue: '',
      status: 'Enrolled'
    })
    setEditingStudentId(null)
    setShowModal(false)
  }

  const handleEditStudent = (student: Student) => {
    setEditingStudentId(student.id)
    setNewStudent({
      lrn: student.lrn,
      lastname: student.lastname,
      firstname: student.firstname,
      middleInitial: student.middleInitial,
      sex: student.sex,
      birthdate: student.birthdate,
      motherTongue: student.motherTongue,
      status: student.status
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingStudentId(null)
    setNewStudent({
      lrn: '',
      lastname: '',
      firstname: '',
      middleInitial: '',
      sex: 'M',
      birthdate: '',
      motherTongue: '',
      status: 'Enrolled'
    })
  }

  const handleDeleteStudent = (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter((s) => s.id !== id))
    }
  }

  return (
    <div className="panel active" id="panel-masterlist">
      <div className="section-header">
        <div className="section-title">
          <h2>Class Master List</h2>
          <p>Manage enrolled students for this section</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary">📤 Bulk Import</Button>
          <Button
            onClick={() => {
              setEditingStudentId(null)
              setShowModal(true)
            }}
          >
            + Add Student
          </Button>
        </div>
      </div>

      <div className="info-box">
        <strong>Learner Reference Number (LRN):</strong> A 12-digit unique identifier assigned by
        DepEd to each learner. Required for all school forms. Format: 123456789012
      </div>

      <Card
        id="enrolled-students"
        title={
          <>
            Enrolled Students <span className="badge badge-gold">{students.length} students</span>
          </>
        }
        titleIcon="👥"
        action={
          <input
            className="form-input"
            id="search-student"
            placeholder="Search student..."
            style={{ width: '200px', padding: '6px 12px', fontSize: '12px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        }
      >
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>LRN</th>
              <th>Last Name</th>
              <th>First Name</th>
              <th>M.I.</th>
              <th>Sex</th>
              <th>Birthdate</th>
              <th>Age</th>
              <th>Mother Tongue</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  style={{
                    textAlign: 'center',
                    padding: '32px',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.25)'
                  }}
                >
                  {students.length === 0 ? (
                    <>
                      No students enrolled yet. Click{' '}
                      <strong style={{ color: 'rgba(255,255,255,0.5)' }}>+ Add Student</strong> to
                      begin.
                    </>
                  ) : (
                    <>No students match your search.</>
                  )}
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student.lrn}</td>
                  <td>{student.lastname}</td>
                  <td>{student.firstname}</td>
                  <td>{student.middleInitial}</td>
                  <td>{student.sex}</td>
                  <td>{student.birthdate}</td>
                  <td>{calculateAge(student.birthdate)}</td>
                  <td>{student.motherTongue}</td>
                  <td>
                    <span
                      className={`badge ${
                        student.status === 'Enrolled'
                          ? 'badge-green'
                          : student.status === 'Transferred'
                            ? 'badge-blue'
                            : 'badge-red'
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditStudent(student)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteStudent(student.id)}
                      style={{ marginLeft: '4px' }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingStudentId ? 'Edit Student' : 'Add Student'}
      >
        <div className="form-grid form-grid-2">
          <div className="form-group span-2">
            <label className="form-label">
              LRN (Learner Reference Number) <span>*</span>
            </label>
            <input
              className="form-input"
              id="m-lrn"
              placeholder="12-digit LRN e.g. 123456789012"
              maxLength={12}
              value={getStudentValue('lrn')}
              onChange={(e) => setNewStudent({ ...newStudent, lrn: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Last Name <span>*</span>
            </label>
            <input
              className="form-input"
              id="m-last"
              placeholder="SURNAME"
              value={getStudentValue('lastname')}
              onChange={(e) => setNewStudent({ ...newStudent, lastname: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              First Name <span>*</span>
            </label>
            <input
              className="form-input"
              id="m-first"
              placeholder="Given Name"
              value={getStudentValue('firstname')}
              onChange={(e) => setNewStudent({ ...newStudent, firstname: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Middle Name</label>
            <input
              className="form-input"
              id="m-middle"
              placeholder="Middle Name"
              value={getStudentValue('middleInitial')}
              onChange={(e) => setNewStudent({ ...newStudent, middleInitial: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Extension (Jr/Sr/III)</label>
            <input className="form-input" id="m-ext" placeholder="Jr., Sr., III" />
          </div>
          <div className="form-group">
            <label className="form-label">
              Sex <span>*</span>
            </label>
            <select
              className="form-select"
              id="m-sex"
              value={getStudentValue('sex')}
              onChange={(e) => setNewStudent({ ...newStudent, sex: e.target.value as 'M' | 'F' })}
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">
              Birthdate <span>*</span>
            </label>
            <input
              className="form-input"
              id="m-bday"
              type="date"
              value={getStudentValue('birthdate')}
              onChange={(e) => setNewStudent({ ...newStudent, birthdate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mother Tongue</label>
            <select
              className="form-select"
              id="m-tongue"
              value={getStudentValue('motherTongue')}
              onChange={(e) => setNewStudent({ ...newStudent, motherTongue: e.target.value })}
            >
              <option value="">-- Select --</option>
              <option value="Filipino">Filipino</option>
              <option value="Kinaray-a">Kinaray-a</option>
              <option value="Hiligaynon">Hiligaynon</option>
              <option value="Cebuano">Cebuano</option>
              <option value="Ilocano">Ilocano</option>
              <option value="Waray">Waray</option>
              <option value="Kapampangan">Kapampangan</option>
              <option value="Bicol">Bicol</option>
              <option value="Pangasinan">Pangasinan</option>
              <option value="English">English</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Religion</label>
            <input className="form-input" id="m-religion" placeholder="e.g. Roman Catholic" />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              id="m-status"
              value={getStudentValue('status')}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  status: e.target.value as 'Enrolled' | 'Transferred' | 'Dropped'
                })
              }
            >
              <option value="Enrolled">Enrolled</option>
              <option value="Transferred">Transferred</option>
              <option value="Dropped">Dropped</option>
            </select>
          </div>
          <div className="form-group span-2">
            <label className="form-label">Address</label>
            <input className="form-input" id="m-address" placeholder="Full address" />
          </div>
          <div className="form-group">
            <label className="form-label">Guardian Name</label>
            <input className="form-input" id="m-guardian" placeholder="Parent/Guardian Full Name" />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Number</label>
            <input className="form-input" id="m-contact" placeholder="e.g. 09123456789" />
          </div>
        </div>
        <div className="modal-footer">
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button onClick={handleSaveStudent}>Save Student</Button>
        </div>
      </Modal>
    </div>
  )
}

export default MasterListPage
