import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { PocketBaseProvider } from './context/PocketBaseContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PocketBaseProvider><App /></PocketBaseProvider>
  </React.StrictMode>,
)
