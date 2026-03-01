import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/types/api.types'

interface AuthState {
  token: string | null
  user: User | null
  isLoggedIn: boolean
  isSocketReady: boolean
}

const initialState: AuthState = {
  token: null,
  user: null,
  isLoggedIn: false,
  isSocketReady: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token
      state.user = action.payload.user
      state.isLoggedIn = true
    },
    logout(state) {
      state.token = null
      state.user = null
      state.isLoggedIn = false
      state.isSocketReady = false
    },
    setSocketReady(state, action: PayloadAction<boolean>) {
      state.isSocketReady = action.payload
    },
  },
})

export const { loginSuccess, logout, setSocketReady } = authSlice.actions
export default authSlice.reducer
