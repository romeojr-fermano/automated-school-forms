import { useApp } from '../context/AppContext'
import React from 'react'

function Sidebar(): React.JSX.Element {
  const { currentPage, setCurrentPage, activeSection, setActiveSection, students } = useApp()

  const sections = [
    {
      category: 'School Info',
      items: [
        {
          id: 'school-info',
          pageId: 'setup',
          icon: '🏫',
          name: 'School Information',
          sub: 'Name, Division, District'
        },
        {
          id: 'section-info',
          pageId: 'setup',
          icon: '📚',
          name: 'Section & Schedule',
          sub: 'Grade, Track, Strand'
        },
        {
          id: 'teacher-info',
          pageId: 'setup',
          icon: '👨‍🏫',
          name: 'Teacher Information',
          sub: 'Adviser, Subject Teachers'
        }
      ]
    },
    {
      category: 'Students',
      items: [
        {
          id: 'student-list',
          pageId: 'masterlist',
          icon: '📋',
          name: 'Class Master List',
          sub: 'Enrolled students',
          badge: students.length
        },
        {
          id: 'attendance',
          pageId: 'masterlist',
          icon: '📅',
          name: 'Attendance Records',
          sub: 'Monthly summary'
        }
      ]
    },
    {
      category: 'Academic',
      items: [
        {
          id: 'subjects',
          pageId: 'grades',
          icon: '📖',
          name: 'Subjects & Grades',
          sub: 'Quarterly grades per subject'
        },
        {
          id: 'honors',
          pageId: 'grades',
          icon: '🏆',
          name: 'Honors & Awards',
          sub: 'With Highest/High/Special'
        }
      ]
    },
    {
      category: 'School Forms',
      items: [
        { id: 'sf1', pageId: 'sf1', icon: '📄', name: 'SF1 – School Register' },
        { id: 'sf2', pageId: 'sf2', icon: '📄', name: 'SF2 – Daily Attendance' },
        { id: 'sf9', pageId: 'sf9', icon: '📄', name: 'SF9 – Report Card' },
        { id: 'sf10', pageId: 'sf10', icon: '📄', name: 'SF10 – Learner Profile' },
        { id: 'f137', pageId: 'f137', icon: '📄', name: 'Form 137 – Transcript' },
        { id: 'f138', pageId: 'f138', icon: '📄', name: 'Form 138 – Report Card' }
      ]
    }
  ]

  const isActive = (item: { id: string; pageId: string }) => {
    if (
      currentPage === item.pageId &&
      (item.pageId === 'setup' || item.pageId === 'grades' || item.pageId === 'masterlist')
    ) {
      return activeSection === item.id
    }
    return currentPage === item.pageId
  }

  const handleClick = (item: { id: string; pageId: string }) => {
    setCurrentPage(item.pageId)
    if (item.pageId === 'setup' || item.pageId === 'grades' || item.pageId === 'masterlist') {
      setActiveSection(item.id)
    }
  }

  return (
    <div className="sidebar">
      {sections.map((section) => (
        <div className="sidebar-section" key={section.category}>
          <div className="sidebar-label">{section.category}</div>
          {section.items.map((item: any) => (
            <div
              key={item.id}
              className={`sidebar-item ${isActive(item) ? 'active' : ''}`}
              onClick={() => handleClick(item)}
            >
              <div className="item-icon">{item.icon}</div>
              <div className="item-text">
                <div className="item-name">{item.name}</div>
                {item.sub && <div className="item-sub">{item.sub}</div>}
              </div>
              {item.badge !== undefined && <div className="item-badge">{item.badge}</div>}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Sidebar
