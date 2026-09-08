import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { StoreProvider } from './state/store'
import { TourProvider } from './tour/TourProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <StoreProvider>
        <TourProvider>
          <App />
        </TourProvider>
      </StoreProvider>
    </BrowserRouter>
  </StrictMode>,
)
