import { Outlet } from "react-router-dom"

import Sidebar from "@/components/layout/Sidebar"
import Navbar from "@/components/layout/Navbar"

function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar type="admin" />

      <div className="lg:pl-72">
        <Navbar title="Admin Dashboard" />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout