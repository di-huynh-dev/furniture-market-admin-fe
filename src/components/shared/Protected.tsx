import useAuthStore from '@/store/auth-store'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface ProtectedProps {
  children: React.ReactNode
}

const Protected = ({ children }: ProtectedProps) => {
  const navigate = useNavigate()

  const auth = useAuthStore((state) => state.admin_auth)

  useEffect(() => {
    if (!auth.accessToken) {
      navigate('/login')
      return
    }
  }, [auth])
  return <>{children}</>
}

export default Protected
