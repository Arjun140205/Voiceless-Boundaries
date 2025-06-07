'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <button
      className="absolute top-4 right-4 p-2 bg-black text-white rounded"
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? '🌞 Light' : '🌙 Dark'}
    </button>
  )
}
