import React from 'react'

interface ProtectedProps {
  children: React.ReactNode
  role: string
}

const ProtectedByRole = ({ children, role }: ProtectedProps) => {
  const [localStorageRole] = React.useState(() => localStorage.getItem('role') || '')

  const isMatchRole = () => {
    const roles = localStorageRole.split(',').map((role) => role.trim())
    return roles.includes(role)
  }

  return isMatchRole() ? <>{children}</> : null
}

export default ProtectedByRole
