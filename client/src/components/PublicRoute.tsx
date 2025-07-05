import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../store"

const PublicRoute = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const token = useSelector((state: RootState) => state.auth.token)
  return !token || !user ? <Outlet /> : <Navigate to="/dashboard" replace />
}

export default PublicRoute
