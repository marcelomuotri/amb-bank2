import { useLocation, Navigate } from 'react-router-dom'
import { Box, useTheme } from '@mui/material'
import Layout from '../components/Layout'
import LoadingFade from '../components/LoadingFade'
import { useAuth } from '../hooks/useAuth'

const AuthGuard = () => {
  const location = useLocation()
  const theme = useTheme()
  const { user, loading } = useAuth()

  const isAuthenticated = !!user
  //const isAuthenticated = true

  if (loading) {
    return (
      <LoadingFade loading={true}>
        <Box sx={{ 
          backgroundColor: "white", 
          minHeight: "100vh", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          borderRadius: theme.shape.borderRadius
        }}>
          <div>Loading...</div>
        </Box>
      </LoadingFade>
    )
  }
  
  if (!isAuthenticated) {   
    return <Navigate to='/login' state={{ from: location }} />
  }

  return <Layout />
}

export default AuthGuard