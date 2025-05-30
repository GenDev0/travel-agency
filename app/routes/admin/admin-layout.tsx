import React from 'react'
import { Outlet } from 'react-router'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='admin-layout'>
        Mobile Sidebar
        <aside className='w-full max-w-[270px] hidden lg:block'>Sidebar Content</aside>
        <aside className='children'>
            <Outlet />
        </aside>
    </div>
  )
}

export default AdminLayout