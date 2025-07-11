import { createSlice  } from "@reduxjs/toolkit"
import type { AuthState } from '../types/types'

const token = sessionStorage.getItem('token');

const initialState: AuthState = {
  user: null,
  token: token,
  isAuthenticated: !!token,
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
      state.token = null
      state.isAuthenticated = false
      state.loading = false
      sessionStorage.removeItem('token');
    },
    setUser: (state, action) => {
      state.user = action.payload.user
      state.isAuthenticated = true
    },
    updateToken: (state, action) => {
      state.token = action.payload;
      sessionStorage.setItem("token", action.payload);
    },    
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, setUser, updateToken } = authSlice.actions
export default authSlice.reducer
