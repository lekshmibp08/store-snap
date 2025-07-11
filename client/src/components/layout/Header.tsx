
import type React from "react"
import { Link } from "react-router-dom"
import { LogOut } from 'lucide-react'
import { useDispatch, useSelector } from "react-redux"
import Button from "../ui/Button"
import type { RootState } from "../../store"
import { logout as logoutAction  } from "../../store/authSlice"


const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(logoutAction())    
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold text-gray-900 hover:text-blue-600">
              Image Album
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.name}</span>
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
