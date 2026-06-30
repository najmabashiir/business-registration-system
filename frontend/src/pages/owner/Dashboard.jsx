import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  BadgeCheck,
  Building2,
  Clock,
  FileText,
  XCircle,
  Loader2,
} from "lucide-react"

import { getMyBusinesses } from "@/api/businessApi"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function OwnerDashboard() {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getMyBusinesses()
        setBusinesses(data.businesses || [])
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to load dashboard data"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const totalBusinesses = businesses.length

  const pendingBusinesses = businesses.filter(
    (business) =>
      business.status !== "Approved" && business.status !== "Rejected"
  ).length

  const approvedBusinesses = businesses.filter(
    (business) => business.status === "Approved"
  ).length

  const rejectedBusinesses = businesses.filter(
    (business) => business.status === "Rejected"
  ).length

  const activeLicenses = businesses.filter(
    (business) => business.licenseStatus === "Active"
  ).length

  const uploadedDocuments = businesses.reduce((total, business) => {
    return total + (business.documents?.length || 0)
  }, 0)

  const stats = [
    {
      title: "My Businesses",
      value: totalBusinesses,
      icon: Building2,
      description: "Registered businesses",
    },
    {
      title: "Pending",
      value: pendingBusinesses,
      icon: Clock,
      description: "Waiting for approval",
    },
    {
      title: "Approved",
      value: approvedBusinesses,
      icon: BadgeCheck,
      description: "Approved businesses",
    },
    {
      title: "Rejected",
      value: rejectedBusinesses,
      icon: XCircle,
      description: "Rejected applications",
    },
    {
      title: "Documents",
      value: uploadedDocuments,
      icon: FileText,
      description: "Uploaded documents",
    },
    {
      title: "Active Licenses",
      value: activeLicenses,
      icon: BadgeCheck,
      description: "Active licenses",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your businesses, documents, and licenses.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading dashboard...
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon

              return (
                <Card key={stat.title} className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <Icon className="h-5 w-5 text-blue-600" />
                  </CardHeader>

                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Recent Businesses</CardTitle>
            </CardHeader>

            <CardContent>
              {businesses.length === 0 ? (
                <p className="text-muted-foreground">
                  No businesses registered yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {businesses.slice(0, 5).map((business) => (
                    <div
                      key={business._id}
                      className="flex items-center justify-between rounded-lg border p-4 bg-white"
                    >
                      <div>
                        <p className="font-medium">
                          {business.businessName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {business.registrationNumber} •{" "}
                          {business.businessType}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {business.status || "Pending"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          License: {business.licenseStatus || "Inactive"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

export default OwnerDashboard