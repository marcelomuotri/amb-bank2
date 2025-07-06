import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './App.css'
import AuthGuard from './routes/AuthGuard'
import Login from './features/Login'
import { ThemeProvider } from '@mui/material/styles'
import appTheme from './framework/theme/app-theme'
import Home from './features/Home'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthGuard />,
    children: [
      {
        index: true,
        element: <Navigate to='/home' replace />,
      },
      {
        path: 'home',
        element: <Home />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
])

function App() {

  return (
    <ThemeProvider theme={appTheme}>
        <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
