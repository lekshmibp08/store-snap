import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Provider } from "react-redux"
import store from "./store"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute" 
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import DashboardPage from "./pages/DashboardPage"

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoute/>}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />          
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute/>}>
            <Route path="/dashboard" element={<DashboardPage />} />          
          </Route>
          

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
