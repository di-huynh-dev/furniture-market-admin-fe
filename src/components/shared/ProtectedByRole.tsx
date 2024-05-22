import useAuthStore from '@/store/auth-store'
import React from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

interface ProtectedProps {
  children: React.ReactNode
  role: string
}

const ProtectedByRole = ({ children, role }: ProtectedProps) => {
  const navigate = useNavigate()

  const auth = useAuthStore((state) => state.admin_auth)

  if (!auth.accessToken) {
    navigate('/login')
    return
  }

  if (auth.user.role !== role && auth.user.role !== 'ADMIN') {
    toast.error('Bạn không có quyền truy cập vào mục này')
    return
  }

  return <>{children}</>
}

export default ProtectedByRole
