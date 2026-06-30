import api from "@/api/axios"

export const getAllBusinesses = async () => {
  const res = await api.get("/businesses")
  return res.data
}

export const approveBusiness = async (businessId) => {
  const res = await api.put(`/businesses/${businessId}/approve`)
  return res.data
}

export const rejectBusiness = async (businessId) => {
  const res = await api.put(`/businesses/${businessId}/reject`)
  return res.data
}

export const getAllUsers = async () => {
  const res = await api.get("/auth/users")
  return res.data
}

export const createUser = async (userData) => {
  const res = await api.post("/auth/users", userData)
  return res.data
}

export const updateUser = async (userId, userData) => {
  const res = await api.put(`/auth/users/${userId}`, userData)
  return res.data
}

export const deleteUser = async (userId) => {
  const res = await api.delete(`/auth/users/${userId}`)
  return res.data
}

export const getAllLicenses = async () => {
  const res = await api.get("/licenses")
  return res.data
}

export const generateLicense = async (businessId) => {
  const res = await api.post(`/licenses/${businessId}`)
  return res.data
}

export const renewLicense = async (licenseId) => {
  const res = await api.put(`/licenses/${licenseId}/renew`)
  return res.data
}