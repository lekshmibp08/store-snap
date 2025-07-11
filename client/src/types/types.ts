export interface User {
  _id: string
  email: string
  phone: string
  name: string
}

export interface Image {
  _id: string
  title: string
  url: string
  file: File | null
  userId: string
  order: number
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}
