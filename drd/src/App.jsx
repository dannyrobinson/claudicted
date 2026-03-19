import React, { useState } from 'react'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Work from './components/Work'
import CV from './components/CV'
import './App.css'

function App() {
  const [currentPath, setCurrentPath] = useState('home')

  const handleNavigate = (path) => {
    setCurrentPath(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-container">
      <Navigation onNavigate={handleNavigate} currentPath={currentPath} />

      <main>
        {currentPath === 'home' && <Hero onEnter={() => handleNavigate('work')} />}
        {currentPath === 'work' && <Work />}
        {currentPath === 'cv' && <CV />}
      </main>

      {/* Viewport Glow Overlay handled in index.css body::before */}
    </div>
  )
}

export default App
