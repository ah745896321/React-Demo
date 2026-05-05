import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/button'

const navItems = [
  { to: '/user', label: '人事資料' },
  { to: '/role', label: '角色設定' },
  { to: '/prog', label: '頁面維護' },
  { to: '/type', label: '代碼維護' },
  { to: '/param', label: '下拉選單' },
]

export default function Layout() {
  const { userName, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen">
      <aside className="w-48 bg-gray-900 text-white flex flex-col">
        <div className="p-4 text-lg font-bold border-b border-gray-700">React Demo</div>
        <nav className="flex-1 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block px-4 py-2 text-sm hover:bg-gray-700 ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-700 text-sm text-gray-400">{userName}</div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-12 bg-white border-b flex items-center justify-end px-4">
          <Button variant="ghost" size="sm" onClick={handleLogout}>登出</Button>
        </header>
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
