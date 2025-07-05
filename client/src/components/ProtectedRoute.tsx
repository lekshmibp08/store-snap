import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../store"

const ProtectedRoute = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const token = useSelector((state: RootState) => state.auth.token)
  return user && token ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute
