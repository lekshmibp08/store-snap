import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { User, AuthState } from '../types/types'

const initialState: AuthState = {
  user: null,
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
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
    },
    loginFailure: (state) => {
      state.loading = false
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, setUser } = authSlice.actions
export default authSlice.reducer
