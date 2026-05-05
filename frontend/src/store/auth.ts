import { create } from 'zustand'

interface AuthState {
  token: string | null
  userName: string | null
  userId: string | null
  setAuth: (token: string, userName: string, userId: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  userName: localStorage.getItem('userName'),
  userId: localStorage.getItem('userId'),
  setAuth: (token, userName, userId) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userName', userName)
    localStorage.setItem('userId', userId)
    set({ token, userName, userId })
  },
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('userId')
    set({ token: null, userName: null, userId: null })
  },
}))
