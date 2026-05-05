import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import PrivateRoute from '@/components/PrivateRoute'
import Layout from '@/components/Layout'
import Login from '@/pages/Login'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/user" replace />} />
            <Route path="/user" element={<div>人事資料（建置中）</div>} />
            <Route path="/role" element={<div>角色設定（建置中）</div>} />
            <Route path="/prog" element={<div>頁面維護（建置中）</div>} />
            <Route path="/type" element={<div>代碼維護（建置中）</div>} />
            <Route path="/param" element={<div>下拉選單（建置中）</div>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
