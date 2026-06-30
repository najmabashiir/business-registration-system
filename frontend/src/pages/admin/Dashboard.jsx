import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  BadgeCheck,
  Building2,
  Clock,
  Loader2,
  Users,
  XCircle,
} from "lucide-react"

import {
  getAllBusinesses,
  getAllUsers,
  getAllLicenses,
} from "@/api/adminApi"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [businesses, setBusinesses] = useState([])
  const [licenses, setLicenses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersData, businessesData, licensesData] =
          await Promise.allSettled([
            getAllUsers(),
            getAllBusinesses(),
            getAllLicenses(),
          ])

        if (usersData.status === "fulfilled") {
          setUsers(usersData.value.users || [])
        }

        if (businessesData.status === "fulfilled") {
          setBusinesses(businessesData.value.businesses || [])
        }

        if (licensesData.status === "fulfilled") {
          setLicenses(licensesData.value.licenses || [])
        }
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

  const totalUsers = users.length
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

  const activeLicenses =
    licenses.length > 0
      ? licenses.filter((license) => license.status === "Active").length
      : businesses.filter(
          (business) => business.licenseStatus === "Active"
        ).length

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      description: "Registered users",
    },
    {
      title: "Total Businesses",
      value: totalBusinesses,
      icon: Building2,
      description: "All business applications",
    },
    {
      title: "Pending",
      value: pendingBusinesses,
      icon: Clock,
      description: "Waiting for review",
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
          Admin Overview
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor users, businesses, approvals, and licenses.
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
              <CardTitle>Recent Business Applications</CardTitle>
            </CardHeader>

            <CardContent>
              {businesses.length === 0 ? (
                <p className="text-muted-foreground">
                  No business applications yet.
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
                          {business.owner?.fullName || "Unknown owner"} •{" "}
                          {business.registrationNumber}
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

export default AdminDashboard