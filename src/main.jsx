// Apply initial theme before React renders
const savedTheme = localStorage.getItem('theme');
const initialTheme = savedTheme ? savedTheme === 'dark' : true;
document.documentElement.className = initialTheme ? 'dark-mode' : 'light-mode';

/* The hero is pinned and the section after it is revealed by scroll position,
   so a browser-restored scroll would drop the visitor into the middle of that
   transition on reload - the panel already half way up, text already grey.
   Claiming scroll restoration has to happen before the first paint, which is
   why it lives here rather than in an effect. */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
