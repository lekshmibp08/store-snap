export const validateName = (name: string) => {
  if (!name.trim()) return "Name is required"
  if (!/^[A-Za-z]{4,}$/.test(name.trim())) return "Name must be at least 4 letters with no spaces or numbers"
  return ""
}

export const validatePhone = (phone: string) => {
  if (!phone.trim()) return "Phone number is required"
  if (!/^\d{10}$/.test(phone)) return "Phone number must be exactly 10 digits"
  return ""
}

export const validatePassword = (password: string) => {
  if (!password) return "Password is required"
  if (!/^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/.test(password)) {
    return "Password must be at least 6 characters and include a number and a special character"
  }
  return ""
}

export const validateConfirmPassword = (password: string, confirm: string) => {
  if (!confirm) return "Confirm your password"
  if (password !== confirm) return "Passwords do not match"
  return ""
}

export const validateEmail = (email: string) => {
  if (!email.trim()) return "Email is required"
  if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email"
  return ""
}
