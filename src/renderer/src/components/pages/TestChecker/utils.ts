import React from 'react'
import { TestCheckerAnswer, TestCheckerStudent } from '../../../types'

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

/**
 * Robust CSV line parser that handles quoted strings with commas.
 * Handles "Dela Cruz, Juan",A,B,C correctly.
 */
export function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let cur = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(cur.trim())
      cur = ''
    } else {
      cur += char
    }
  }
  result.push(cur.trim())

  // Clean up quotes and return
  return result.map((v) => v.replace(/^"|"$/g, '').trim())
}

/**
 * Consolidated scoring logic.
 * Denominator is always the total length of the answerKey to prevent grade inflation.
 */
export function calculateStudentScore(
  answers: Record<number, string>,
  key: TestCheckerAnswer[],
  passingPct: number
): Pick<TestCheckerStudent, 'score' | 'pct' | 'passed' | 'wrongItems'> {
  const totalItems = key.length
  if (totalItems === 0) {
    return { score: 0, pct: 0, passed: false, wrongItems: [] }
  }

  let score = 0
  const wrongItems: string[] = []

  key.forEach((k) => {
    const given = (answers[k.item] || '?').toUpperCase()
    const expected = (k.answer || '').toUpperCase()

    if (given !== expected) {
      // Use ø symbol if expected answer is empty to indicate key error
      wrongItems.push(`${k.item}(${given}\u2192${expected || 'ø'})`)
    } else {
      score++
    }
  })

  const pct = Math.round((score / totalItems) * 100)
  const passed = pct >= passingPct

  return { score, pct, passed, wrongItems }
}

/**
 * Protects against CSV Injection (Formula Injection).
 * Prefixes sensitive characters (=, +, -, @) with a single quote.
 */
export function sanitizeForCSV(value: string | number): string {
  if (value === null || value === undefined) return ''
  const sanitized = String(value)
  if (/^[=+\-@]/.test(sanitized)) {
    return `'${sanitized}`
  }
  return sanitized
}

export function handleGridKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
  if (e.key === 'Enter' || e.key === 'ArrowDown') {
    const currentInput = e.currentTarget
    const container = currentInput.closest('div[id$="-grid"], div[id$="-answers"]')
    if (!container) return

    const inputs = Array.from(container.querySelectorAll('input'))
    const index = inputs.indexOf(currentInput)
    if (index !== -1 && index < inputs.length - 1) {
      ;(inputs[index + 1] as HTMLInputElement).focus()
    }
  } else if (e.key === 'ArrowUp') {
    const currentInput = e.currentTarget
    const container = currentInput.closest('div[id$="-grid"], div[id$="-answers"]')
    if (!container) return

    const inputs = Array.from(container.querySelectorAll('input'))
    const index = inputs.indexOf(currentInput)
    if (index > 0) {
      ;(inputs[index - 1] as HTMLInputElement).focus()
    }
  }
}
