import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import {
  BadgeCheck,
  BarChart3,
  Building2,
  Clock,
  Loader2,
  Users,
  XCircle,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  getAllBusinesses,
  getAllLicenses,
  getAllUsers,
} from "@/api/adminApi"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const businessStatusColors = {
  Pending: "#facc15",
  Approved: "#22c55e",
  Rejected: "#ef4444",
}

const roleColors = {
  owner: "#3b82f6",
  admin: "#0f172a",
}

const licenseColors = {
  Active: "#22c55e",
  Expired: "#ef4444",
  Inactive: "#facc15",
}

function Reports() {
  const [users, setUsers] = useState([])
  const [businesses, setBusinesses] = useState([])
  const [licenses, setLicenses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true)

        const [usersResult, businessesResult, licensesResult] =
          await Promise.allSettled([
            getAllUsers(),
            getAllBusinesses(),
            getAllLicenses(),
          ])

        if (usersResult.status === "fulfilled") {
          setUsers(usersResult.value.users || [])
        }

        if (businessesResult.status === "fulfilled") {
          setBusinesses(businessesResult.value.businesses || [])
        }

        if (licensesResult.status === "fulfilled") {
          setLicenses(licensesResult.value.licenses || [])
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to load reports"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  const stats = useMemo(() => {
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

    return {
      totalUsers: users.length,
      totalBusinesses: businesses.length,
      pendingBusinesses,
      approvedBusinesses,
      rejectedBusinesses,
      activeLicenses,
    }
  }, [users, businesses, licenses])

  const businessStatusData = [
    {
      name: "Pending",
      value: stats.pendingBusinesses,
    },
    {
      name: "Approved",
      value: stats.approvedBusinesses,
    },
    {
      name: "Rejected",
      value: stats.rejectedBusinesses,
    },
  ]

  const usersByRoleData = [
    {
      name: "Owners",
      value: users.filter((user) => user.role === "owner").length,
      role: "owner",
    },
    {
      name: "Admins",
      value: users.filter((user) => user.role === "admin").length,
      role: "admin",
    },
  ]

  const licenseStatusData = [
    {
      name: "Active",
      value:
        licenses.length > 0
          ? licenses.filter((license) => license.status === "Active").length
          : businesses.filter((business) => business.licenseStatus === "Active")
              .length,
    },
    {
      name: "Inactive",
      value: businesses.filter(
        (business) => business.licenseStatus !== "Active"
      ).length,
    },
    {
      name: "Expired",
      value: licenses.filter((license) => license.status === "Expired").length,
    },
  ]

  const summaryCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
    },
    {
      title: "Total Businesses",
      value: stats.totalBusinesses,
      icon: Building2,
    },
    {
      title: "Pending",
      value: stats.pendingBusinesses,
      icon: Clock,
    },
    {
      title: "Approved",
      value: stats.approvedBusinesses,
      icon: BadgeCheck,
    },
    {
      title: "Rejected",
      value: stats.rejectedBusinesses,
      icon: XCircle,
    },
    {
      title: "Active Licenses",
      value: stats.activeLicenses,
      icon: BadgeCheck,
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading reports...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Analyze users, businesses, approvals, and licenses.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((card) => {
          const Icon = card.icon

          return (
            <Card key={card.title} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon className="h-5 w-5 text-blue-600" />
              </CardHeader>

              <CardContent>
                <div className="text-3xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Business Status
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={businessStatusData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label
                  >
                    {businessStatusData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={businessStatusColors[entry.name]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Users by Role
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usersByRoleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {usersByRoleData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={roleColors[entry.role]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-blue-600" />
            License Status
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={licenseStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {licenseStatusData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={licenseColors[entry.name]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Reports