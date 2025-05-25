// Apply initial theme before React renders
const savedTheme = localStorage.getItem('theme');
const initialTheme = savedTheme ? savedTheme === 'dark' : true;
document.documentElement.className = initialTheme ? 'dark-mode' : 'light-mode';

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
