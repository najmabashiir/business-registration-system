import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  BadgeCheck,
  CalendarClock,
  Loader2,
  RefreshCcw,
} from "lucide-react"

import {
  generateLicense,
  getAllBusinesses,
  getAllLicenses,
  renewLicense,
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

function formatDate(date) {
  if (!date) return "N/A"

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function getStatusClass(status) {
  if (status === "Active") {
    return "bg-green-100 text-green-700 hover:bg-green-100"
  }

  if (status === "Expired") {
    return "bg-red-100 text-red-700 hover:bg-red-100"
  }

  return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
}

function getBusinessIdFromLicense(license) {
  if (!license?.business) return null

  if (typeof license.business === "string") {
    return license.business
  }

  return license.business._id
}

function AdminLicenses() {
  const [licenses, setLicenses] = useState([])
  const [businesses, setBusinesses] = useState([])
  const [selectedBusinessId, setSelectedBusinessId] = useState("")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)

      const [licensesData, businessesData] = await Promise.all([
        getAllLicenses(),
        getAllBusinesses(),
      ])

      setLicenses(licensesData.licenses || [])
      setBusinesses(businessesData.businesses || [])
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load licenses"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const approvedBusinesses = businesses.filter(
    (business) => business.status === "Approved"
  )

  const licensedBusinessIds = licenses
    .map((license) => getBusinessIdFromLicense(license))
    .filter(Boolean)

  const availableBusinesses = approvedBusinesses.filter(
    (business) => !licensedBusinessIds.includes(business._id)
  )

  const handleGenerateLicense = async () => {
    if (!selectedBusinessId) {
      toast.error("Please select an approved business")
      return
    }

    setActionLoading(true)

    try {
      await generateLicense(selectedBusinessId)
      toast.success("License generated successfully")
      setSelectedBusinessId("")
      fetchData()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to generate license"
      )
    } finally {
      setActionLoading(false)
    }
  }

  const handleRenewLicense = async (licenseId) => {
    setActionLoading(true)

    try {
      await renewLicense(licenseId)
      toast.success("License renewed successfully")
      fetchData()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to renew license"
      )
    } finally {
      setActionLoading(false)
    }
  }

  const activeCount = licenses.filter(
    (license) => license.status === "Active"
  ).length

  const expiredCount = licenses.filter(
    (license) => license.status === "Expired"
  ).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Licenses
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate, view, and renew business licenses.
          </p>
        </div>

        <Button variant="outline" onClick={fetchData} disabled={loading}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Licenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{licenses.length}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeCount}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Expired
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{expiredCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Generate License</CardTitle>
          <CardDescription>
            Select an approved business that does not already have a license.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <select
              value={selectedBusinessId}
              onChange={(e) => setSelectedBusinessId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select approved business</option>

              {availableBusinesses.map((business) => (
                <option key={business._id} value={business._id}>
                  {business.businessName} - {business.registrationNumber}
                </option>
              ))}
            </select>

            <Button
              onClick={handleGenerateLicense}
              disabled={actionLoading || !selectedBusinessId}
            >
              {actionLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Generate License
            </Button>
          </div>

          {availableBusinesses.length === 0 && (
            <p className="text-sm text-muted-foreground mt-3">
              No approved businesses available for license generation.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>License Records</CardTitle>
          <CardDescription>
            All generated licenses in the system.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading licenses...
            </div>
          ) : licenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-14 w-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <BadgeCheck className="h-7 w-7" />
              </div>

              <h3 className="text-lg font-semibold">
                No licenses generated yet
              </h3>

              <p className="text-muted-foreground mt-1 max-w-sm">
                Approve a business first, then generate its license here.
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>License No.</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead className="min-w-[130px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {licenses.map((license) => {
                    const business = license.business

                    const businessName =
                      business?.businessName ||
                      license.businessName ||
                      "Unknown Business"

                    const ownerName =
                      business?.owner?.fullName ||
                      license.owner?.fullName ||
                      "Unknown Owner"

                    return (
                      <TableRow key={license._id}>
                        <TableCell className="font-medium">
                          {license.licenseNumber || license.number || "N/A"}
                        </TableCell>

                        <TableCell>{businessName}</TableCell>

                        <TableCell>{ownerName}</TableCell>

                        <TableCell>
                          <Badge className={getStatusClass(license.status)}>
                            {license.status || "Active"}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          {formatDate(license.issueDate || license.createdAt)}
                        </TableCell>

                        <TableCell>
                          {formatDate(license.expiryDate || license.expiresAt)}
                        </TableCell>

                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={actionLoading}
                            onClick={() => handleRenewLicense(license._id)}
                          >
                            <CalendarClock className="mr-2 h-4 w-4" />
                            Renew
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminLicenses