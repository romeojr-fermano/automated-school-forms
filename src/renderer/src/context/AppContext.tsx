import { createContext, ReactNode, useContext, useState, useEffect } from 'react'
import {
  School,
  Section,
  Teacher,
  Subject,
  Student,
  SubjectGrade,
  MonthlyAttendance,
  TestCheckerState
} from '../types'

interface AppContextType {
  school: School
  section: Section
  adviser: Teacher
  principal: Teacher
  subjects: Subject[]
  students: Student[]
  grades: Record<string, SubjectGrade[]>
  attendance: Record<string, MonthlyAttendance>
  testChecker: TestCheckerState
  currentPage: string
  activeSection: string

  setSchool: (school: School) => void
  setSection: (section: Section) => void
  setAdviser: (teacher: Teacher) => void
  setPrincipal: (teacher: Teacher) => void
  setSubjects: (subjects: Subject[]) => void
  setStudents: (students: Student[]) => void
  setGrades: (grades: Record<string, SubjectGrade[]>) => void
  setAttendance: (attendance: Record<string, MonthlyAttendance>) => void
  setTestChecker: (testChecker: TestCheckerState) => void
  setCurrentPage: (page: string) => void
  setActiveSection: (section: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const initialSchool: School = {
  name: '',
  id: '',
  year: '2025-2026',
  division: '',
  district: '',
  address: ''
}

const initialSection: Section = {
  gradeLevel: 11,
  semester: 1,
  name: '',
  track: 'Academic',
  strand: '',
  roomNumber: ''
}

const initialTeacher: Teacher = {
  name: '',
  employeeNumber: ''
}

const initialTestChecker: TestCheckerState = {
  mode: 'manual',
  answerKey: [],
  students: [],
  testName: '',
  subject: '',
  passingPct: 75,
  date: ''
}

const STORAGE_KEY = 'shs-forms-data'

interface StoredData {
  school: School
  section: Section
  adviser: Teacher
  principal: Teacher
  subjects: Subject[]
  students: Student[]
  grades: Record<string, SubjectGrade[]>
  attendance: Record<string, MonthlyAttendance>
  testChecker: TestCheckerState
}

function loadFromStorage(): Partial<StoredData> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load from localStorage:', e)
  }
  return {}
}

function saveToStorage(data: Partial<StoredData>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save to localStorage:', e)
  }
}

export function AppProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const stored = loadFromStorage()

  const [school, setSchool] = useState<School>(stored.school || initialSchool)
  const [section, setSection] = useState<Section>(stored.section || initialSection)
  const [adviser, setAdviser] = useState<Teacher>(stored.adviser || initialTeacher)
  const [principal, setPrincipal] = useState<Teacher>(stored.principal || initialTeacher)
  const [subjects, setSubjects] = useState<Subject[]>(stored.subjects || [])
  const [students, setStudents] = useState<Student[]>(stored.students || [])
  const [grades, setGrades] = useState<Record<string, SubjectGrade[]>>(stored.grades || {})
  const [attendance, setAttendance] = useState<Record<string, MonthlyAttendance>>(
    stored.attendance || {}
  )
  const [currentPage, setCurrentPage] = useState<string>('setup')
  const [activeSection, setActiveSection] = useState<string>('school-info')
  const [testChecker, setTestChecker] = useState<TestCheckerState>(
    stored.testChecker || initialTestChecker
  )

  useEffect(() => {
    saveToStorage({
      school,
      section,
      adviser,
      principal,
      subjects,
      students,
      grades,
      attendance,
      testChecker
    })
  }, [school, section, adviser, principal, subjects, students, grades, attendance, testChecker])

  const value = {
    school,
    section,
    adviser,
    principal,
    subjects,
    students,
    grades,
    attendance,
    testChecker,
    currentPage,
    activeSection,
    setSchool,
    setSection,
    setAdviser,
    setPrincipal,
    setSubjects,
    setStudents,
    setGrades,
    setAttendance,
    setTestChecker,
    setCurrentPage,
    setActiveSection
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextType {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
