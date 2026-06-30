import { Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

import Login from "@/pages/auth/Login"
import Register from "@/pages/auth/Register"

import OwnerLayout from "@/layouts/OwnerLayout"
import AdminLayout from "@/layouts/AdminLayout"

import OwnerDashboard from "@/pages/owner/Dashboard"
import MyBusinesses from "@/pages/owner/MyBusinesses"
import RegisterBusiness from "@/pages/owner/RegisterBusiness"
import UploadDocument from "@/pages/owner/UploadDocument"
import OwnerLicenses from "@/pages/owner/Licenses"

import AdminDashboard from "@/pages/admin/Dashboard"
import Users from "@/pages/admin/Users"
import Businesses from "@/pages/admin/Businesses"
import AdminLicenses from "@/pages/admin/Licenses"

import Documents from "@/pages/admin/Documents"

import Reports from "@/pages/admin/Reports"

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  )
}

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) return <LoadingScreen />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />
    }

    return <Navigate to="/owner/dashboard" replace />
  }

  return children
}

function RootRedirect() {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) return <LoadingScreen />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />
  }

  return <Navigate to="/owner/dashboard" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/owner"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <OwnerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="businesses" element={<MyBusinesses />} />
        <Route path="register-business" element={<RegisterBusiness />} />
        <Route path="upload-document" element={<UploadDocument />} />
        <Route path="licenses" element={<OwnerLicenses />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="businesses" element={<Businesses />} />
        <Route path="licenses" element={<AdminLicenses />} />
        <Route path="documents" element={<Documents />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes