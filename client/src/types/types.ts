export interface User {
  id: string
  email: string
  phone: string
  name: string
}

export interface Image {
  id: string
  title: string
  url: string
  file: File | null
  userId: string
  order: number
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
}
