import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClinicProvider } from './context/ClinicContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClinicProvider>
      <App />
    </ClinicProvider>
  </StrictMode>,
)
