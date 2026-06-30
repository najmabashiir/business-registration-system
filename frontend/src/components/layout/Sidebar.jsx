import { Link, useLocation } from "react-router-dom"
import {
  Building2,
  FileText,
  LayoutDashboard,
  Users,
  BadgeCheck,
  BriefcaseBusiness,
  BarChart3,
} from "lucide-react"

import { cn } from "@/lib/utils"

const ownerLinks = [
  {
    title: "Dashboard",
    href: "/owner/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Businesses",
    href: "/owner/businesses",
    icon: BriefcaseBusiness,
  },
  {
    title: "Register Business",
    href: "/owner/register-business",
    icon: Building2,
  },

  {
    title: "Licenses",
    href: "/owner/licenses",
    icon: BadgeCheck,
  },
]

const adminLinks = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Businesses",
    href: "/admin/businesses",
    icon: Building2,
  },
  {
    title: "Licenses",
    href: "/admin/licenses",
    icon: BadgeCheck,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "Documents",
    href: "/admin/documents",
    icon: FileText,
  },
]

function Sidebar({ type = "owner" }) {
  const location = useLocation()
  const links = type === "admin" ? adminLinks : ownerLinks

  return (
    <aside className="hidden lg:flex h-screen w-72 flex-col border-r bg-slate-950 text-white fixed left-0 top-0">
      <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-800">
        <div className="h-11 w-11 rounded-xl bg-blue-600 flex items-center justify-center">
          <Building2 className="h-6 w-6" />
        </div>

        <div>
          <h1 className="text-lg font-bold leading-tight">Business Reg.</h1>
          <p className="text-xs text-slate-400">
            {type === "admin" ? "Admin Portal" : "Owner Portal"}
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const active = location.pathname === link.href

          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.title}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <p className="text-xs text-slate-500">
          © 2026 Business Registration System
        </p>
      </div>
    </aside>
  )
}

export default Sidebar