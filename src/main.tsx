import './index.css'
import 'bootstrap/dist/css/bootstrap.css';
// @deno-types="@types/react"
import { StrictMode } from 'react'
// @deno-types="@types/react-dom/client"
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import reportWebVitals from "./reportWebVitals.ts";

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

reportWebVitals(console.log)
