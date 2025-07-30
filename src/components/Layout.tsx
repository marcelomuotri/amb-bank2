import { Box, Button, useTheme } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router-dom";
import UserProfile from "./UserProfile";

// Logo URL - imagen de dos manos dándose la mano
const logoUrl = "https://cdn-icons-png.flaticon.com/512/2830/2830284.png";

// Configuración del menú
const menuItems = [
  {
    path: "/",
    icon: FileUploadIcon,
    label: "layout.uploadFiles",
  },
  {
    path: "/search",
    icon: SearchIcon,
    label: "layout.searchClients",
  },
  {
    path: "/clients",
    icon: PeopleIcon,
    label: "layout.clients",
  },
];

const Layout = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Función para determinar si un item está activo
  const isActive = (path: string) => {
    if (path === "/") {
      return (
        location.pathname === "/" ||
        location.pathname === "/home" ||
        location.pathname === ""
      );
    }
    return location.pathname.startsWith(path);
  };

  // Función para obtener los estilos de un item del menú
  const getMenuItemStyle = (path: string) => ({
    backgroundColor: isActive(path)
      ? `${theme.palette.primary.main}20`
      : "transparent",
    color: isActive(path) ? theme.palette.primary.main : "inherit",
    fontWeight: isActive(path) ? 700 : 400,
    borderRadius: theme.shape.borderRadius,
  });

  // Función para renderizar un item del menú
  const renderMenuItem = ({
    path,
    icon: Icon,
    label,
  }: (typeof menuItems)[0]) => (
    <MenuItem
      key={path}
      icon={<Icon />}
      onClick={() => navigate(path)}
      style={getMenuItemStyle(path)}
    >
      {t(label)}
    </MenuItem>
  );

  return (
    <Box display="flex" height="100vh">
      <Sidebar
        width="280px"
        collapsed={collapsed}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          zIndex: 1000,
        }}
        rootStyles={{
          "& .ps-menu-button": {
            paddingLeft: "5px !important",
            paddingRight: "5px !important",
          },
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          height="98%"
          sx={{ paddingLeft: "20px", paddingRight: "18px" }}
        >
          <Menu>
            <MenuItem rootStyles={{ paddingBottom: "10px" }}>
              <img
                src={logoUrl}
                style={{
                  marginTop: "20px",
                  width: 30,
                  height: 30,
                  objectFit: "cover",
                  objectPosition: "top",
                }}
                alt="logo"
              />
            </MenuItem>
            {menuItems.map(renderMenuItem)}
          </Menu>
          <Box flexGrow={1} />
          <UserProfile />
        </Box>
      </Sidebar>

      <Box
        component="main"
        flexGrow={1}
        sx={{
          marginLeft: collapsed ? "80px" : "280px",
          transition: "margin-left 0.2s",
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
            left: collapsed ? 60 : 270,
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
            paddingLeft: "24px",
            paddingRight: "24px",
            paddingTop: "32px",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
