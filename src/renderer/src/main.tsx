import './assets/main.css'
import './assets/shs-forms.css'
import { AppProvider } from './context/AppContext'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from '@renderer/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
)
