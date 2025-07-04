import configAxios from '../services/axiosConfig';

export const sendOtp = async (
  name: string,
  email: string,
  phone: string,
  password: string
) => {
  try {
    
    const response = await configAxios.post("/api/send-otp", {
      name,
      email,
      phone,
      password,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || 'Registration failed' };
  }
};

export const verifyAndRegister = async (
  name: string,
  email: string,
  phone: string,
  password: string, 
  otp: string
) => {
  try {
    const response = await configAxios.post("/api/verify-and-register", { 
      name,
      email,
      phone,
      password, 
      otp 
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || 'OTP verification failed' };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await configAxios.post("/api/login", { email, password });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || 'Login failed' };
  }
};

export const requestOtp = async (email: string) => {
  try {
    const response = await configAxios.post("/api/forgot-password", { email })
    return { success: true, data: response.data }
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || "Failed to send OTP" }
  }
}

export const resetPassword = async (email: string, otp: string, newPassword: string) => {
  try {
    const response = await configAxios.post("/api/reset-password", {
      email,
      otp,
      newPassword,
    })
    return { success: true, data: response.data }
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || "Reset failed" }
  }
}
