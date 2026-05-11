import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#17171f',
            color: '#f0f0f8',
            border: '1px solid #2a2a3a',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#22d3a0', secondary: '#17171f' } },
          error: { iconTheme: { primary: '#f43f5e', secondary: '#17171f' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
