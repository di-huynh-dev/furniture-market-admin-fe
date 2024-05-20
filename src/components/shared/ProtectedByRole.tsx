import useAuthStore from '@/store/auth-store'
import React from 'react'
import toast from 'react-hot-toast'
  
interface ProtectedProps {
  children: React.ReactNode
  role: string
}

const ProtectedByRole = ({ children, role }: ProtectedProps) => {
  const auth = useAuthStore((state) => state.admin_auth)
  if (auth.user.role !== role && auth.user.role !== 'ADMIN') {
    toast.error('Bạn không có quyền truy cập vào mục này')
    return null
  }
  return <>{children}</>
}

export default ProtectedByRole
