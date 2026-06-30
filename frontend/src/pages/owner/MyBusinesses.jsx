import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import {
  Building2,
  Loader2,
  Pencil,
  Plus,
  RefreshCcw,
  Trash2,
} from "lucide-react"

import {
  deleteMyBusiness,
  getMyBusinesses,
  updateMyBusiness,
} from "@/api/businessApi"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const initialForm = {
  businessName: "",
  businessType: "",
  address: "",
  phone: "",
  email: "",
}

function getStatusClass(status) {
  if (status === "Approved") {
    return "bg-green-100 text-green-700 hover:bg-green-100"
  }

  if (status === "Rejected") {
    return "bg-red-100 text-red-700 hover:bg-red-100"
  }

  return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
}

function MyBusinesses() {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [editOpen, setEditOpen] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState(initialForm)

  const fetchBusinesses = async () => {
    try {
      setLoading(true)
      const data = await getMyBusinesses()
      setBusinesses(data.businesses || [])
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load businesses"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBusinesses()
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const openEditDialog = (business) => {
    setSelectedBusiness(business)
    setForm({
      businessName: business.businessName || "",
      businessType: business.businessType || "",
      address: business.address || "",
      phone: business.phone || "",
      email: business.email || "",
    })
    setEditOpen(true)
  }

  const closeEditDialog = () => {
    setEditOpen(false)
    setSelectedBusiness(null)
    setForm(initialForm)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    if (!selectedBusiness) return

    setSaving(true)

    try {
      await updateMyBusiness(selectedBusiness._id, form)
      toast.success("Business updated successfully")
      closeEditDialog()
      fetchBusinesses()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update business"
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    setDeleting(true)

    try {
      await deleteMyBusiness(deleteTarget._id)
      toast.success("Business deleted successfully")
      setDeleteTarget(null)
      fetchBusinesses()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete business"
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            My Businesses
          </h1>
          <p className="text-muted-foreground mt-1">
            View, update, and delete your registered businesses.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchBusinesses} disabled={loading}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button asChild>
            <Link to="/owner/register-business">
              <Plus className="mr-2 h-4 w-4" />
              Register Business
            </Link>
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Business Applications</CardTitle>
          <CardDescription>
            All businesses you have submitted for registration.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading businesses...
            </div>
          ) : businesses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-14 w-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Building2 className="h-7 w-7" />
              </div>

              <h3 className="text-lg font-semibold">
                No businesses registered yet
              </h3>

              <p className="text-muted-foreground mt-1 max-w-sm">
                Start by submitting your first business registration
                application.
              </p>

              <Button asChild className="mt-5">
                <Link to="/owner/register-business">
                  Register Business
                </Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Registration No.</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>License</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="min-w-[180px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {businesses.map((business) => (
                    <TableRow key={business._id}>
                      <TableCell className="font-medium">
                        {business.businessName}
                      </TableCell>

                      <TableCell>{business.businessType}</TableCell>

                      <TableCell>
                        {business.registrationNumber || "Not assigned"}
                      </TableCell>

                      <TableCell>
                        <Badge className={getStatusClass(business.status)}>
                          {business.status || "Pending"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline">
                          {business.licenseStatus || "Inactive"}
                        </Badge>
                      </TableCell>

                      <TableCell>{business.phone}</TableCell>

                      <TableCell>{business.email}</TableCell>

                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(business)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteTarget(business)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Business</DialogTitle>
            <DialogDescription>
              Update your business information.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Name</label>
              <Input
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Business Type</label>
              <Input
                name="businessType"
                value={form.businessType}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                name="address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeEditDialog}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Business
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this business?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete{" "}
              <span className="font-semibold">
                {deleteTarget?.businessName}
              </span>{" "}
              and its related license if it exists. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Business
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default MyBusinesses