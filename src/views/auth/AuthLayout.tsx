import { Navigate, Outlet } from 'react-router-dom'

import { useAppStore } from '@/store/useAppStore'

export default function AuthLayout() {
  const token = useAppStore((state) => state.token)

  if (token) {
    return <Navigate replace to='/educational-materials' />
  }

  return <Outlet />
}