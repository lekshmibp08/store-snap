import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("theme") || "light"
  )

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full border transition-all"
      style={{
        backgroundColor: "var(--card-color)",
        color: "var(--text-color)",
        borderColor: "var(--text-color)",
      }}      
    >
      {theme === "light" ? <Moon size={10} /> : <Sun size={10} />}
    </button>
  )
}

export default ThemeToggle
