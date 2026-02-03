import { useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import './App.css'

const confettiColors = ['#ff4d6d', '#ff8fab', '#ffd6e0', '#fff1f5', '#ff7aa2']

function App() {
  const pageRef = useRef(null)
  const noButtonRef = useRef(null)
  const [noPosition, setNoPosition] = useState(null)
  const [accepted, setAccepted] = useState(false)

  const moveNoButton = () => {
    const page = pageRef.current
    const button = noButtonRef.current

    if (!page || !button) return

    const pageRect = page.getBoundingClientRect()
    const buttonRect = button.getBoundingClientRect()
    const padding = 16

    const maxX = Math.max(padding, pageRect.width - buttonRect.width - padding)
    const maxY = Math.max(padding, pageRect.height - buttonRect.height - padding)

    const nextX = Math.floor(Math.random() * maxX)
    const nextY = Math.floor(Math.random() * maxY)

    setNoPosition({ x: nextX, y: nextY })
  }

  const fireConfetti = () => {
    confetti({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.65 },
      colors: confettiColors,
    })
    setTimeout(() => {
      confetti({
        particleCount: 110,
        spread: 100,
        origin: { y: 0.6 },
        colors: confettiColors,
      })
    }, 200)
    setTimeout(() => {
      confetti({
        particleCount: 130,
        spread: 120,
        origin: { y: 0.55 },
        colors: confettiColors,
      })
    }, 400)
  }

  const handleYesClick = () => {
    setAccepted(true)
    fireConfetti()
  }

  const showFloatingNo = Boolean(noPosition) && !accepted

  return (
    <div className="page" ref={pageRef}>
      <div className="glow" />
      <main className="card" aria-live="polite">
        <span className="badge">Valentine Proposal</span>
        <h1>Do you want to be my Valentine?</h1>
        <p className="subtitle">
          I promise sweet surprises, cozy nights, and a heart that chooses you every day.
        </p>

        {!accepted && (
          <div className="actions">
            <button className="btn yes" onClick={handleYesClick}>
              Yes
            </button>
            {!showFloatingNo && (
              <button
                ref={noButtonRef}
                className="btn no"
                onMouseEnter={moveNoButton}
                onClick={moveNoButton}
              >
                No
              </button>
            )}
          </div>
        )}

        {accepted && (
          <div className="celebration">
            <h2 className="love">Yay! You just made my heart do cartwheels.</h2>
            <p className="subtitle">
              Get ready for a day filled with love notes, roses, and all your favorite things.
            </p>
            <div className="media-slot">
              <div className="media-placeholder">
                <span>Your photo or video goes here</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {showFloatingNo && (
        <button
          ref={noButtonRef}
          className="btn no is-floating"
          style={{ left: `${noPosition.x}px`, top: `${noPosition.y}px` }}
          onMouseEnter={moveNoButton}
          onClick={moveNoButton}
          aria-label="No (it keeps moving!)"
        >
          No
        </button>
      )}
    </div>
  )
}

export default App
