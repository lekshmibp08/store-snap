import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import Modal from "../components/ui/Modal"
import { requestOtp, resetPassword } from "../api/auth"

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [otpModal, setOtpModal] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const result = await requestOtp(email)
    setLoading(false)

    if (result.success) {
      setSuccess(`OTP sent to ${email}`)
      setOtpModal(true)
    } else {
      setError(result.error)
    }
  }

  const handleReset = async () => {
    setSuccess('');
    if (!otp || !newPassword) {
      setError("Please enter OTP and new password")
      return
    }
    setLoading(true)
    const result = await resetPassword(email, otp, newPassword)
    setLoading(false)

    if (result.success) {
      setSuccess("Password reset successful. You can now login.")
      setTimeout(() => {
        navigate('/login')
      }, 2000)
      
    } else {
      setError(result.error)
      setOtp('');
      setNewPassword('');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <Button type="submit" className="w-full mt-4" loading={loading}>
            Send OTP
          </Button>
        </form>

        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>

      {/* OTP Modal */}
      <Modal isOpen={otpModal} onClose={() => {
        setOtpModal(false);
        setOtp('');
        setNewPassword('');
        setError('');
        }} 
        title="Reset Password"
      >
        <div className="space-y-4">
          {success && <p className="text-center text-green-600 mb-4">{success}</p>}
          {error && <p className="text-center text-red-500 mb-4">{error}</p>}

          <Input label="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button onClick={handleReset} className="w-full" loading={loading}>
            Reset Password
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default ForgotPasswordPage
