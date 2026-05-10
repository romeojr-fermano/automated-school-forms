import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { useApp } from '../../../context/AppContext'
import { TestCheckerAnswer, TestCheckerStudent, TestCheckerState } from '../../../types'
import { calculateStudentScore } from './utils'

interface TestCheckerContextState extends TestCheckerState {
  draftAnswers: Record<number, string>
}

type Action =
  | { type: 'SET_STATE'; payload: TestCheckerState }
  | { type: 'SET_MODE'; payload: 'manual' | 'csv' }
  | { type: 'SET_TEST_NAME'; payload: string }
  | { type: 'SET_SUBJECT'; payload: string }
  | { type: 'SET_PASSING_PCT'; payload: number }
  | { type: 'SET_DATE'; payload: string }
  | { type: 'SET_DRAFT_ANSWER'; payload: { item: number; answer: string } }
  | { type: 'BUILD_GRID'; payload: { numItems: number } }
  | { type: 'LOAD_CSV_KEY'; payload: TestCheckerAnswer[] }
  | { type: 'ADD_STUDENT'; payload: TestCheckerStudent }
  | { type: 'ADD_STUDENTS_BATCH'; payload: TestCheckerStudent[] }
  | { type: 'CLEAR_ALL' }

const initialState: TestCheckerContextState = {
  mode: 'manual',
  answerKey: [],
  students: [],
  testName: '',
  subject: '',
  passingPct: 75,
  date: '',
  draftAnswers: {}
}

function reducer(state: TestCheckerContextState, action: Action): TestCheckerContextState {
  switch (action.type) {
    case 'SET_STATE': {
      const draft: Record<number, string> = {}
      action.payload.answerKey.forEach((k) => {
        draft[k.item] = k.answer
      })
      return { ...state, ...action.payload, draftAnswers: draft }
    }

    case 'SET_MODE':
      return { ...state, mode: action.payload }

    case 'SET_TEST_NAME':
      return { ...state, testName: action.payload }

    case 'SET_SUBJECT':
      return { ...state, subject: action.payload }

    case 'SET_PASSING_PCT': {
      // Re-score students when passing percentage changes
      const updatedStudents = state.students.map((s) => ({
        ...s,
        ...calculateStudentScore(s.answers, state.answerKey, action.payload)
      }))
      return { ...state, passingPct: action.payload, students: updatedStudents }
    }

    case 'SET_DATE':
      return { ...state, date: action.payload }

    case 'SET_DRAFT_ANSWER':
      return {
        ...state,
        draftAnswers: { ...state.draftAnswers, [action.payload.item]: action.payload.answer }
      }

    case 'BUILD_GRID': {
      const { numItems } = action.payload
      const newKey: TestCheckerAnswer[] = []
      for (let i = 1; i <= numItems; i++) {
        newKey.push({ item: i, answer: (state.draftAnswers[i] || '').trim().toUpperCase() })
      }

      // Re-score all students against the new grid size
      const updatedStudents = state.students.map((s) => ({
        ...s,
        ...calculateStudentScore(s.answers, newKey, state.passingPct)
      }))

      return { ...state, answerKey: newKey, students: updatedStudents }
    }

    case 'LOAD_CSV_KEY': {
      const newDraft: Record<number, string> = {}
      action.payload.forEach((k) => {
        newDraft[k.item] = k.answer
      })
      const updatedStudents = state.students.map((s) => ({
        ...s,
        ...calculateStudentScore(s.answers, action.payload, state.passingPct)
      }))
      return {
        ...state,
        answerKey: action.payload,
        draftAnswers: newDraft,
        students: updatedStudents
      }
    }

    case 'ADD_STUDENT':
      return { ...state, students: [...state.students, action.payload] }

    case 'ADD_STUDENTS_BATCH':
      return { ...state, students: [...state.students, ...action.payload] }

    case 'CLEAR_ALL':
      return {
        ...initialState,
        mode: state.mode // Preserve mode preference
      }

    default:
      return state
  }
}

interface TestCheckerContextType {
  state: TestCheckerContextState
  dispatch: React.Dispatch<Action>
}

const TestCheckerContext = createContext<TestCheckerContextType | undefined>(undefined)

export function TestCheckerProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const { testChecker, setTestChecker } = useApp()
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    ...testChecker,
    draftAnswers: testChecker.answerKey.reduce((acc, k) => ({ ...acc, [k.item]: k.answer }), {})
  })

  // Sync back to AppContext
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { draftAnswers, ...stateToSave } = state
    setTestChecker(stateToSave)
  }, [state, setTestChecker])

  return (
    <TestCheckerContext.Provider value={{ state, dispatch }}>
      {children}
    </TestCheckerContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTestChecker(): TestCheckerContextType {
  const context = useContext(TestCheckerContext)
  if (!context) {
    throw new Error('useTestChecker must be used within TestCheckerProvider')
  }
  return context
}
