import { createContext, useContext, useEffect, useState } from "react"
import api from "@/api/axios"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        setToken(null)
      }
    }

    setLoading(false)
  }, [token])

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password })

    const authToken =
      res.data.token ||
      res.data.accessToken ||
      res.data.data?.token

    const userData =
      res.data.user ||
      res.data.data?.user

    if (!authToken || !userData) {
      throw new Error("Invalid login response from server")
    }

    localStorage.setItem("token", authToken)
    localStorage.setItem("user", JSON.stringify(userData))

    setToken(authToken)
    setUser(userData)

    return userData
  }

  const registerUser = async (formData) => {
    const res = await api.post("/auth/register", formData)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        registerUser,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}