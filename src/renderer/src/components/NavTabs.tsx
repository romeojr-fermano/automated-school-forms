import { useApp } from '../context/AppContext'
import React from 'react'

function NavTabs(): React.JSX.Element {
  const { currentPage, setCurrentPage } = useApp()

  const tabs = [
    { id: 'setup', label: '⚙️ School Setup' },
    { id: 'masterlist', label: '👥 Master List' },
    { id: 'grades', label: '📊 Grade Entry' },
    { id: 'sf1', label: 'SF1 · Enrollment' },
    { id: 'sf2', label: 'SF2 · Daily Attendance' },
    { id: 'sf9', label: 'SF9 · Report Card' },
    { id: 'sf10', label: 'SF10 · Learner Profile' },
    { id: 'f137', label: 'Form 137' },
    { id: 'f138', label: 'Form 138' }
  ]

  return (
    <div className="nav-tabs">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`nav-tab ${currentPage === tab.id ? 'active' : ''}`}
          onClick={() => setCurrentPage(tab.id)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  )
}

export default NavTabs
