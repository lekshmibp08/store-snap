
import type React from "react"
import { Link } from "react-router-dom"
import { LogOut } from 'lucide-react'
import { useDispatch, useSelector } from "react-redux"
import Button from "../ui/Button"
import type { RootState } from "../../store"
import { logout as logoutAction  } from "../../store/authSlice"
import ThemeToggle from "../ThemeToggle"

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(logoutAction())    
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-[var(--header-bg)] text-[var(--header-text)] shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
<div className="flex items-center">
  <Link to="/dashboard" className="flex items-center gap-0 text-lg font-bold text-[var(--header-text)] hover:text-blue-600">
    <img src="/snap-store.png" alt="Snap Store Logo" className="h-10 w-auto" />
    <span className="text-base sm:text-lg">Snap Store</span>
  </Link>
</div>          

          <div className="flex items-center gap-4">
            <ThemeToggle/>
            <span className="text-[var(--header-text)]">Welcome, {user?.name}</span>
            <Button variant="secondary" size="sm" onClick={logout}>
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
