import { createSlice  } from "@reduxjs/toolkit"
import type { AuthState } from '../types/types'

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token;
      state.isAuthenticated = true
      state.loading = false
      sessionStorage.setItem('token', action.payload.token)
      localStorage.setItem("currentUser", JSON.stringify(action.payload.user))

    },
    loginFailure: (state) => {
      state.loading = false
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      sessionStorage.removeItem('token');
    },
    setUser: (state, action) => {
      state.user = action.payload.user
      state.isAuthenticated = true
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, setUser } = authSlice.actions
export default authSlice.reducer
