import { Outlet } from "react-router-dom"

import Sidebar from "@/components/layout/Sidebar"
import Navbar from "@/components/layout/Navbar"

function OwnerLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar type="owner" />

      <div className="lg:pl-72">
        <Navbar title="Owner Dashboard" />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default OwnerLayout