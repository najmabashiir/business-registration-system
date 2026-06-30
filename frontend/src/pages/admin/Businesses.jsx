import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  Building2,
  CheckCircle2,
  Loader2,
  RefreshCcw,
  XCircle,
} from "lucide-react"

import {
  approveBusiness,
  getAllBusinesses,
  rejectBusiness,
} from "@/api/adminApi"

import { Button } from "@/components/ui/button"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

function getStatusClass(status) {
  if (status === "Approved") {
    return "bg-green-100 text-green-700 hover:bg-green-100"
  }

  if (status === "Rejected") {
    return "bg-red-100 text-red-700 hover:bg-red-100"
  }

  return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
}

function AdminBusinesses() {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [actionType, setActionType] = useState(null)

  const fetchBusinesses = async () => {
    try {
      setLoading(true)
      const data = await getAllBusinesses()
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

  const openActionDialog = (business, type) => {
    setSelectedBusiness(business)
    setActionType(type)
  }

  const closeActionDialog = () => {
    setSelectedBusiness(null)
    setActionType(null)
  }

  const handleConfirmAction = async () => {
    if (!selectedBusiness || !actionType) return

    setActionLoading(true)

    try {
      if (actionType === "approve") {
        await approveBusiness(selectedBusiness._id)
        toast.success("Business approved successfully")
      }

      if (actionType === "reject") {
        await rejectBusiness(selectedBusiness._id)
        toast.success("Business rejected successfully")
      }

      closeActionDialog()
      fetchBusinesses()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Action failed"
      )
    } finally {
      setActionLoading(false)
    }
  }

  const pendingCount = businesses.filter(
    (business) => business.status !== "Approved" && business.status !== "Rejected"
  ).length

  const approvedCount = businesses.filter(
    (business) => business.status === "Approved"
  ).length

  const rejectedCount = businesses.filter(
    (business) => business.status === "Rejected"
  ).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Businesses
          </h1>
          <p className="text-muted-foreground mt-1">
            Review, approve, or reject business registration applications.
          </p>
        </div>

        <Button variant="outline" onClick={fetchBusinesses} disabled={loading}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Businesses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{businesses.length}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{approvedCount}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{rejectedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Business Applications</CardTitle>
          <CardDescription>
            All businesses submitted by owners.
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
                No businesses found
              </h3>

              <p className="text-muted-foreground mt-1 max-w-sm">
                Business applications submitted by owners will appear here.
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reg. No</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>License</TableHead>
                    <TableHead>Contact</TableHead>
<TableHead className="min-w-[170px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {businesses.map((business) => (
                    <TableRow key={business._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {business.businessName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {business.address}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>{business.businessType}</TableCell>

                      <TableCell>
                        {business.registrationNumber || "Not assigned"}
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {business.owner?.fullName || "Unknown"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {business.owner?.email || "No email"}
                          </p>
                        </div>
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

                      <TableCell>
                        <div>
                          <p>{business.phone}</p>
                          <p className="text-xs text-muted-foreground">
                            {business.email}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="min-w-[170px]">
  <div className="flex flex-col gap-2">
    <Button
      size="sm"
      className="w-full bg-green-600 hover:bg-green-700"
      disabled={business.status === "Approved"}
      onClick={() => openActionDialog(business, "approve")}
    >
      <CheckCircle2 className="mr-2 h-4 w-4" />
      Approve
    </Button>

    <Button
      size="sm"
      variant="destructive"
      className="w-full"
      disabled={business.status === "Rejected"}
      onClick={() => openActionDialog(business, "reject")}
    >
      <XCircle className="mr-2 h-4 w-4" />
      Reject
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

      <AlertDialog
        open={!!selectedBusiness}
        onOpenChange={(open) => {
          if (!open) closeActionDialog()
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "approve"
                ? "Approve this business?"
                : "Reject this business?"}
            </AlertDialogTitle>

            <AlertDialogDescription>
              You are about to{" "}
              <span className="font-semibold">
                {actionType === "approve" ? "approve" : "reject"}
              </span>{" "}
              <span className="font-semibold">
                {selectedBusiness?.businessName}
              </span>
              . This action will update the business status and license status.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleConfirmAction}
              disabled={actionLoading}
              className={
                actionType === "reject"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              {actionLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {actionType === "approve" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminBusinesses