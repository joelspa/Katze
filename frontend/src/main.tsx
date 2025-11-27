import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Lazy load the App component
const App = lazy(() => import('./App.tsx'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--bg-primary)'
      }}>
        <div style={{ 
          fontSize: '1.5rem', 
          color: 'var(--color-primary)' 
        }}>Cargando...</div>
      </div>
    }>
      <App />
    </Suspense>
  </StrictMode>,
)
