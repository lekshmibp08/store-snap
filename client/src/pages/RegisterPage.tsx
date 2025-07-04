
import type React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import Modal from "../components/ui/Modal"
import {
    sendOtp, verifyAndRegister
} from "../api/auth"
import { useSelector } from "react-redux"
import type { RootState } from "../store"
import {
  validateName,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
  validateEmail,
} from "../utils/validateForm"


const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [otpModal, setOtpModal] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");
  const [otp, setOtp] = useState("");  
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)

  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
  
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  
    let error = ""
  
    switch (name) {
      case "name":
        error = validateName(value)
        break
      case "email":
        error = validateEmail(value)
        break
      case "phone":
        error = validatePhone(value)
        break
      case "password":
        error = validatePassword(value)
        break
      case "confirmPassword":
        error = validateConfirmPassword(formData.password, value)
        break
    }
  
    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    const result = await sendOtp(formData.name, formData.email, formData.phone, formData.password)
    setLoading(false)

    if (result.success) {
      setSuccess("OTP sent to your email. Please verify.")
      setEmailForOtp(formData.email);
      setOtpModal(true);
    } else {
      setError(result.error || "Registration failed")
    }
  }
  const handleOtpSubmit = async () => {
    if (!otp) {
      setError("Please enter the OTP")
      return
    }
    const result = await verifyAndRegister(formData.name, formData.email, formData.phone, formData.password, otp, );
    if (result.success) {
      setSuccess("Email verified! You can now login.");
      setOtpModal(false);
      setOtp("")
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      })
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>
        )}

        <form onSubmit={handleSubmit}>
          <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
          {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}

          <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
          {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}

          <Input label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {formErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>}


          <Button type="submit" className="w-full mb-4" loading={loading}>
            Register
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
      <Modal isOpen={otpModal} onClose={() => setOtpModal(false)} title="Verify OTP">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Enter the OTP sent to <strong>{emailForOtp}</strong></p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <Button onClick={handleOtpSubmit} className="w-full">
              Submit OTP
            </Button>
          </div>
        </Modal>
    </div>
  )
}

export default RegisterPage
