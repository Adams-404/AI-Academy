import { useState, useEffect } from 'react'

const facts = [
  "AI can now generate human-like images from text descriptions",
  "Machine Learning models can predict weather patterns with 89% accuracy",
  "Neural networks were inspired by the human brain's structure",
  "AI assistants can now understand and respond in over 100 languages",
  "Deep Learning can detect diseases earlier than traditional methods",
  "AI helps reduce energy consumption in data centers by 40%"
]

const TypewriterFacts = () => {
  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const typeSpeed = isDeleting ? 50 : 50 // Faster deletion, slower typing
    const currentFact = facts[currentIndex]

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentFact.length) {
          setCurrentText(currentFact.slice(0, currentText.length + 1))
        } else {
          // Wait before starting to delete
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setCurrentIndex((prev) => (prev + 1) % facts.length)
        }
      }
    }, typeSpeed)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentIndex])

  return (
    <div className="typewriter-container">
      <h2 className="typewriter-header">Did you know?</h2>
      <p className="typewriter-text">
        {currentText}
        <span className="cursor">|</span>
      </p>
    </div>
  )
}

export default TypewriterFacts 