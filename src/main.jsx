import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

/* /manage is the property manager. It is a separate lazy chunk, so a visitor
   landing on the marketing site never downloads any of it. Both the path and
   the #manage hash work, since some static hosts do not rewrite unknown paths
   back to index.html. */
const Manager = lazy(() => import('./studio/Manager.jsx'))

const route = (() => {
  const path = window.location.pathname.replace(/\/+$/, '')
  const hash = window.location.hash.replace(/^#\/?/, '')
  if (path === '/manage' || hash === 'manage') return 'manage'
  if (path === '/list' || hash === 'list') return 'submit'
  return 'home'
})()

const root = ReactDOM.createRoot(document.getElementById('root'))

if (route === 'manage') {
  root.render(
    <Suspense fallback={<div className="boot">Loading…</div>}>
      <Manager />
    </Suspense>,
  )
} else {
  root.render(
    <React.StrictMode>
      <App page={route} />
    </React.StrictMode>,
  )
}
