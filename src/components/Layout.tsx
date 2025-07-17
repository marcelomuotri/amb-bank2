import { Box, Button, Avatar } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
// Logo URL - puedes cambiar esta URL por cualquier otra que prefieras
const logoUrl = "https://cdn-icons-png.flaticon.com/512/2830/2830282.png";
import { useNavigate } from "react-router-dom";
import { supabase } from '../../supaconfig'
import { useAuth } from '../hooks/useAuth';

const Layout = () => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Función para obtener la primera letra del email
  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  // Función para generar color basado en el email
  const getAvatarColor = (email: string) => {
    const colors = [
      '#1976d2', '#388e3c', '#d32f2f', '#7b1fa2', 
      '#303f9f', '#ff8f00', '#c2185b', '#5d4037',
      '#455a64', '#ff6f00', '#8e24aa', '#1565c0'
    ];
    const index = email.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Box display="flex" height="100vh">
      <Sidebar 
        width="220px"
        collapsed={collapsed}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          zIndex: 1000,
        }}
      >
        <Box display="flex" flexDirection="column" height="98%" >
          <Menu>
            <MenuItem>
              <img src={logoUrl} style={{ width: 30, height: 30 }} alt="logo" />
            </MenuItem>
            <MenuItem icon={<FileUploadIcon />} onClick={() => navigate('/')}>{t('layout.uploadFiles')}</MenuItem>
            <MenuItem icon={<SearchIcon />} onClick={() => navigate('/search')}>{t('layout.searchClients')}</MenuItem>
          </Menu>
          <Box flexGrow={1} />
          <Menu>
            <MenuItem icon={<LogoutIcon />} onClick={() => supabase.auth.signOut()}>{t('layout.signOut')}</MenuItem>
          </Menu>
        </Box>
      </Sidebar>
      <Box 
        component="main" 
        flexGrow={1}
        sx={{
          marginLeft: collapsed ? '80px' : '220px',
          transition: 'margin-left 0.2s',
        }}
      >
        <Button
          onClick={toggleCollapsed}
          sx={{
            minWidth: 0,
            width: 32,
            height: 32,
            borderRadius: "50%",
            position: "absolute",
            left: collapsed ? 60 : 210,
            top: 16,
            zIndex: 1001,
            transition: "left 0.2s",
            boxShadow: 1,
            background: "white",
            color: "black",
            "&:hover": {
              background: "#f0f0f0",
            },
          }}
        >
          {collapsed ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M10 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M14 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </Button>
        
        <Box
          sx={{ 
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '16px 24px',
            backgroundColor: 'white',
            borderBottom: '1px solid #DEE2E6',
            marginBottom: '24px',
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: user?.email ? getAvatarColor(user.email) : '#ccc',
              color: 'white',
              fontWeight: 600,
              fontSize: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {user?.email ? getInitials(user.email) : 'U'}
          </Avatar>
        </Box>
        <Box sx={{
          paddingLeft: '24px',
          paddingRight: '24px',
        }}>
        <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
