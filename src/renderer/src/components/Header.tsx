import { useApp } from '../context/AppContext'
import React from 'react'

function Header(): React.JSX.Element {
  const { school, section, adviser, principal, subjects, students, grades, attendance } = useApp()

  const handleExport = () => {
    const data = {
      school,
      section,
      adviser,
      principal,
      subjects,
      students,
      grades,
      attendance,
      exportedAt: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `shs-forms-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="header">
      <div className="header-top">
        <div className="ph-flag">
          <div className="flag-stripe">
            <div className="top"></div>
            <div className="bot"></div>
            <div className="flag-triangle"></div>
          </div>
          Republic of the Philippines · Department of Education
        </div>
        <div className="deped-badge">DepEd Order No. 8, s. 2015 | RA 10533</div>
        <div className="sy-badge">S.Y. {school.year || '2025-2026'}</div>
      </div>
      <div className="header-main">
        <div className="header-icon">📋</div>
        <div className="header-text">
          <h1>Automated School Forms Generator</h1>
          <p>Strengthened Senior High School Program · {school.year || '2025-2026'}</p>
        </div>
        <div className="header-right">
          <button className="btn-outline" onClick={handleExport}>
            💾 Export Data
          </button>
          <button className="btn-print" onClick={() => window.print()}>
            🖨️ Print Forms
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header
