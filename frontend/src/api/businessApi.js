import api from "@/api/axios"

export const createBusiness = async (businessData) => {
  const res = await api.post("/businesses", businessData)
  return res.data
}

export const getMyBusinesses = async () => {
  const res = await api.get("/businesses/my-businesses")
  return res.data
}

export const getMyLicenses = async () => {
  const res = await api.get("/licenses/my-licenses")
  return res.data
}

export const uploadBusinessDocument = async (businessId, file) => {
  const formData = new FormData()
  formData.append("document", file)

  const res = await api.post(`/businesses/upload/${businessId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return res.data
}

export const updateMyBusiness = async (businessId, businessData) => {
  const res = await api.put(`/businesses/my-businesses/${businessId}`, businessData)
  return res.data
}

export const deleteMyBusiness = async (businessId) => {
  const res = await api.delete(`/businesses/my-businesses/${businessId}`)
  return res.data
}