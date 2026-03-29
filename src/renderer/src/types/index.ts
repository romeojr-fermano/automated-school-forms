export interface School {
  name: string
  id: string // BEIS School ID
  year: string // e.g., "2025-2026"
  division: string
  district: string
  address: string
}

export interface Section {
  gradeLevel: 11 | 12
  semester: 1 | 2
  name: string
  track: 'Academic' | 'TVL' | 'Sports' | 'Arts'
  strand: string
  roomNumber: string
}

export interface Teacher {
  name: string // SURNAME, First Name M.I.
  employeeNumber: string
}

export interface Subject {
  id: string
  name: string
  category: 'Core' | 'Applied' | 'Specialized' | 'TVL'
  units: number
  teacher: string
}

export interface Student {
  id: string
  lrn: string // 12-digit Learner Reference Number
  lastname: string
  firstname: string
  middleInitial: string
  sex: 'M' | 'F'
  birthdate: string // YYYY-MM-DD
  motherTongue: string
  status: 'Enrolled' | 'Transferred' | 'Dropped'
}

export type Quarter = 'q1' | 'q2' | 'q3' | 'q4' | 'final'

export interface SubjectGrade {
  subjectId: string
  quarter: Quarter
  grade: number | null // 60-100, null if not entered
}

export interface StudentGrades {
  studentId: string
  grades: SubjectGrade[]
  finalGrade: number | null // Average of quarters
}

export type DayAttendance = 'present' | 'absent' | ''

export interface MonthlyAttendance {
  studentId: string
  month: string // e.g., "June"
  days: DayAttendance[] // Array of 20-22 days
  totalPresent: number
  totalAbsent: number
}
