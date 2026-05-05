import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import PrivateRoute from '@/components/PrivateRoute'
import Layout from '@/components/Layout'
import Login from '@/pages/Login'
import UserPage from '@/pages/User'
import XpRolePage from '@/pages/XpRole'
import XpProgPage from '@/pages/XpProg'
import TypePage from '@/pages/Type'
import ParamPage from '@/pages/Param'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/user" replace />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/role" element={<XpRolePage />} />
            <Route path="/prog" element={<XpProgPage />} />
            <Route path="/type" element={<TypePage />} />
            <Route path="/param" element={<ParamPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
