import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Building2, FileUp, Loader2 } from "lucide-react"

import {
  createBusiness,
  uploadBusinessDocument,
} from "@/api/businessApi"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function RegisterBusiness() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    businessName: "",
    businessType: "",
    address: "",
    phone: "",
    email: "",
  })

  const [documentFile, setDocumentFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setDocumentFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!documentFile) {
      toast.error("Please upload a business document")
      return
    }

    setLoading(true)

    try {
      const data = await createBusiness(form)
      const businessId = data.business?._id

      if (!businessId) {
        throw new Error("Business created, but business ID was not returned")
      }

      await uploadBusinessDocument(businessId, documentFile)

      toast.success("Business registered and document uploaded successfully")
      navigate("/owner/businesses")
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to register business"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Register Business
        </h1>
        <p className="text-muted-foreground mt-1">
          Submit your business information and upload supporting documents.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Building2 className="h-6 w-6" />
            </div>

            <div>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Fill in the details below to register your business.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Business Name
                </label>
                <Input
                  name="businessName"
                  placeholder="Example: Najuum Tech"
                  value={form.businessName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Business Type
                </label>
                <Input
                  name="businessType"
                  placeholder="Example: Technology"
                  value={form.businessType}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Address
              </label>
              <Input
                name="address"
                placeholder="Example: Hodan, Mogadishu"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Business Phone
                </label>
                <Input
                  name="phone"
                  placeholder="+252 61 2345678"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Business Email
                </label>
                <Input
                  name="email"
                  type="email"
                  placeholder="business@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="rounded-xl border border-dashed bg-slate-50 p-5">
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl bg-white text-blue-700 flex items-center justify-center border">
                  <FileUp className="h-6 w-6" />
                </div>

                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">
                    Upload Business Document
                  </label>

                  <Input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={handleFileChange}
                    required
                  />

                  <p className="text-xs text-muted-foreground">
                    Upload registration certificate, ID copy, tax document, or
                    any supporting document. Accepted formats: PDF, PNG, JPG,
                    DOC, DOCX.
                  </p>

                  {documentFile && (
                    <p className="text-sm text-blue-700 font-medium">
                      Selected file: {documentFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/owner/businesses")}
                disabled={loading}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={loading}>
                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {loading ? "Submitting..." : "Register Business"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterBusiness