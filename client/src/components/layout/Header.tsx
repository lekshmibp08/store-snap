import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { LogOut, Menu, X } from 'lucide-react'
import { useDispatch, useSelector } from "react-redux"
import Button from "../ui/Button"
import type { RootState } from "../../store"
import { logout as logoutAction } from "../../store/authSlice"
import ThemeToggle from "../ThemeToggle"

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const logout = () => {
    dispatch(logoutAction())
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-[var(--header-bg)] text-[var(--header-text)] shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center text-lg font-bold">
            <img src="/snap-store.png" alt="Snap Store Logo" className="h-10 w-auto" />
            <span className="text-base text-[var(--header-text)] hidden sm:inline">Snap Store</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <span className="text-[var(--header-text)] hidden sm:inline">Welcome, {user?.name}</span>
            <Button variant="secondary" size="sm" onClick={logout}>
              <LogOut size={16} />
            </Button>
          </div>

          {/* Mobile Toggle Button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <span /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 p-4 bg-[var(--card-color)] rounded-xl shadow-lg border border-gray-300 dark:border-gray-700 mx-2">
            {/* Logo Section */}
            <div className="flex items-center justify-between mb-4">
              <Link to="/dashboard" className="flex items-center">
                <img src="/snap-store.png" alt="Snap Store Logo" className="h-8 w-auto" />
                <span className="text-lg font-semibold text-[var(--header-text)]">Snap Store</span>
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
        
            <hr className="border-gray-300 dark:border-gray-600 mb-4" />
        
            <div className="flex flex-col gap-4">
              <span className="text-sm text-[var(--text-color)]">Welcome, {user?.name}</span>
        
              <ThemeToggle />
        
              <Button variant="secondary" size="md" onClick={logout} className="flex items-center gap-2 justify-center">
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
