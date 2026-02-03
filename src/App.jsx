import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import './App.css'

const confettiColors = ['#ff4d6d', '#ff8fab', '#ffd6e0', '#fff1f5', '#ff7aa2']

const getRandomPosition = (pageRect, buttonRect) => {
  const padding = 16
  const availableX = Math.max(0, pageRect.width - buttonRect.width - padding * 2)
  const availableY = Math.max(0, pageRect.height - buttonRect.height - padding * 2)

  return {
    x: padding + Math.floor(Math.random() * (availableX + 1)),
    y: padding + Math.floor(Math.random() * (availableY + 1)),
  }
}

function App() {
  const pageRef = useRef(null)
  const staticNoRef = useRef(null)
  const [noPosition, setNoPosition] = useState(null)
  const [isFloating, setIsFloating] = useState(false)
  const [pendingTarget, setPendingTarget] = useState(null)
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    if (!isFloating || !pendingTarget) return

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setNoPosition(pendingTarget)
        setPendingTarget(null)
      })
    })

    return () => cancelAnimationFrame(frame)
  }, [isFloating, pendingTarget])

  const handleNoAttempt = () => {
    if (accepted) return

    const page = pageRef.current
    const button = staticNoRef.current

    if (!page || !button) return

    const pageRect = page.getBoundingClientRect()
    const buttonRect = button.getBoundingClientRect()
    const origin = {
      x: buttonRect.left - pageRect.left,
      y: buttonRect.top - pageRect.top,
    }

    if (!isFloating) {
      setIsFloating(true)
      setNoPosition(origin)
      setPendingTarget(getRandomPosition(pageRect, buttonRect))
      return
    }

    setNoPosition(getRandomPosition(pageRect, buttonRect))
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
            <button
              ref={staticNoRef}
              className={`btn no ${isFloating ? 'is-hidden' : ''}`}
              onMouseEnter={handleNoAttempt}
              onClick={handleNoAttempt}
            >
              No
            </button>
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

      {isFloating && !accepted && noPosition && (
        <button
          className="btn no is-floating"
          style={{ left: `${noPosition.x}px`, top: `${noPosition.y}px` }}
          onMouseEnter={handleNoAttempt}
          onClick={handleNoAttempt}
          aria-label="No (it keeps moving!)"
        >
          No
        </button>
      )}
    </div>
  )
}

export default App
