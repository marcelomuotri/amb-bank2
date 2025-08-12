import { Box, Button, useTheme } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import AddchartIcon from "@mui/icons-material/Addchart";
import { useNavigate } from "react-router-dom";
import UserProfile from "./UserProfile";
import SubscriptionBar from "./SubscriptionBar";
import { getFilesDashboard } from "../services/supabaseService";
import { useDashboard } from "../contexts/DashboardContext";
import { useOrganization } from "../hooks/useOrganization";

// Configuración del menú
const menuItems = [
  {
    path: "/",
    icon: AddchartIcon,
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
  const {
    dashboardData,
    setDashboardData,
    loading: dashboardLoading,
    setLoading: setDashboardLoading,
  } = useDashboard();
  const [blockTransactions, setBlockTransactions] = useState(false);
  const [userProfileExpanded, setUserProfileExpanded] = useState(false);

  // Obtener datos de la organización para el logo
  const { organizationData } = useOrganization();

  // Usar logo de la organización o logo por defecto
  const logoUrl = organizationData?.logo_url;

  // Obtener datos del dashboard de archivos
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardLoading(true);
        const data = await getFilesDashboard();
        setDashboardData(data);
        setBlockTransactions(data.block_transactions);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
  }: (typeof menuItems)[0]) => {
    // Bloquear "New Statement" si blockTransactions es true O si files_available es 0
    const isBlocked =
      (blockTransactions || dashboardData?.files_available === 0) &&
      path === "/";

    return (
      <MenuItem
        key={path}
        icon={<Icon />}
        onClick={() => !isBlocked && navigate(path)}
        style={{
          ...getMenuItemStyle(path),
          opacity: isBlocked ? 0.5 : 1,
          cursor: isBlocked ? "not-allowed" : "pointer",
        }}
        disabled={isBlocked}
      >
        {t(label)}
      </MenuItem>
    );
  };

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
          "& .ps-sidebar-container": {
            backgroundColor: "white",
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
            
            {menuItems.map(renderMenuItem)}
          </Menu>
          <Box flexGrow={1} />
          {/* Subscription Bar - Solo mostrar cuando el menú no esté colapsado */}
          {!collapsed && (
            <Box sx={{ marginBottom: userProfileExpanded ? "40px" : "16px" }}>
              <SubscriptionBar
                used={dashboardData?.used_this_month || 0}
                total={dashboardData?.total_available || 120}
                renewalDate={
                  dashboardData?.renews_on
                    ? new Date(dashboardData.renews_on).toLocaleDateString(
                        "es-ES",
                        {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                        }
                      )
                    : "1/7/2025"
                }
                loading={dashboardLoading}
              />
            </Box>
          )}

          <UserProfile
            onExpandedChange={setUserProfileExpanded}
            loading={dashboardLoading}
            collapsed={collapsed}
          />
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
