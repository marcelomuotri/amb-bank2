import { useLocation, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import Layout from '../components/Layout'
import { useAuth } from '../hooks/useAuth'

const AuthGuard = () => {
  const location = useLocation()
  const { user, loading } = useAuth()

  const isAuthenticated = !!user
  //const isAuthenticated = true

  if (loading) {
    return (
      <Box>
        <div>Loading...</div>
      </Box>
    )
  }
  
  if (!isAuthenticated) {   
    return <Navigate to='/login' state={{ from: location }} />
  }

  return <Layout />
}

export default AuthGuard