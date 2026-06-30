import { useEffect, useState } from "react"
import { toast } from "sonner"
import { BadgeCheck, Loader2 } from "lucide-react"

import { getMyLicenses } from "@/api/businessApi"
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

function OwnerLicenses() {
  const [licenses, setLicenses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const data = await getMyLicenses()
        setLicenses(data.licenses || [])
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

    fetchLicenses()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          My Licenses
        </h1>
        <p className="text-muted-foreground mt-1">
          View your generated business licenses and expiry dates.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>License Records</CardTitle>
          <CardDescription>
            Licenses generated for your approved businesses.
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
                No license generated yet
              </h3>

              <p className="text-muted-foreground mt-1 max-w-sm">
                Your license will appear here after admin generates it for your approved business.
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>License No.</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {licenses.map((license) => (
                    <TableRow key={license._id}>
                      <TableCell className="font-medium">
                        {license.licenseNumber || license.number || "N/A"}
                      </TableCell>

                      <TableCell>
                        {license.business?.businessName || "Unknown Business"}
                      </TableCell>

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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default OwnerLicenses
