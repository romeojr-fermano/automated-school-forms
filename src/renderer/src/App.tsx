import { useApp } from './context/AppContext'
import Header from './components/Header'
import NavTabs from './components/NavTabs'
import Sidebar from './components/Sidebar'
import SchoolSetupPage from './components/pages/SchoolSetupPage'
import MasterListPage from './components/pages/MasterListPage'
import GradeEntryPage from './components/pages/GradeEntryPage'
import SF1GeneratorPage from './components/pages/SF1GeneratorPage'
import SF2GeneratorPage from './components/pages/SF2GeneratorPage'
import SF9GeneratorPage from './components/pages/SF9GeneratorPage'
import SF10GeneratorPage from './components/pages/SF10GeneratorPage'
import Form137GeneratorPage from './components/pages/Form137GeneratorPage'
import Form138GeneratorPage from './components/pages/Form138GeneratorPage'
import React from 'react'

function App(): React.JSX.Element {
  const { currentPage } = useApp()

  const renderPage = () => {
    switch (currentPage) {
      case 'setup':
        return <SchoolSetupPage />
      case 'masterlist':
        return <MasterListPage />
      case 'grades':
        return <GradeEntryPage />
      case 'sf1':
        return <SF1GeneratorPage />
      case 'sf2':
        return <SF2GeneratorPage />
      case 'sf9':
        return <SF9GeneratorPage />
      case 'sf10':
        return <SF10GeneratorPage />
      case 'f137':
        return <Form137GeneratorPage />
      case 'f138':
        return <Form138GeneratorPage />
      default:
        return <SchoolSetupPage />
    }
  }

  return (
    <>
      <Header />
      <NavTabs />
      <div className="main-layout">
        <Sidebar />
        <div className="content">{renderPage()}</div>
      </div>
    </>
  )
}

export default App
