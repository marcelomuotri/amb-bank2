import { Box, Typography, Avatar, useTheme, Skeleton } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../../supaconfig";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LogoutIcon from "@mui/icons-material/Logout";

interface UserProfileProps {
  onExpandedChange?: (expanded: boolean) => void;
  loading?: boolean;
  collapsed?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ onExpandedChange, loading = false, collapsed = false }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

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

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onExpandedChange?.(newExpanded);
  };

  const handleLogout = () => {
    supabase.auth.signOut();
  };

  if (!user?.email) return null;

  return (
    <Box
      sx={{
        position: "relative",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {/* Contenido principal */}
      <Box
        onClick={() => !loading && handleToggle()}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: collapsed ? 0 : 10,
          borderRadius: theme.shape.borderRadius,
          backgroundColor: isExpanded ? `${theme.palette.primary.main}10` : "transparent",
          transition: "all 0.2s ease",
          cursor: loading ? "default" : "pointer",
          "&:hover": {
            backgroundColor: loading ? "transparent" : `${theme.palette.primary.main}10`,
          },
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        {loading ? (
          <Skeleton variant="circular" width={35} height={35} />
        ) : (
          <Avatar
            sx={{
              width: 35,
              height: 35,
              backgroundColor: getAvatarColor(user.email),
              color: "white",
              fontWeight: 600,
              fontSize: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            {getInitials(user.email)}
          </Avatar>
        )}
        
        {/* Solo mostrar texto cuando no esté colapsado */}
        {!collapsed && (
          <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            {loading ? (
              <>
                <Skeleton width="60%" height={20} />
                <Skeleton width="80%" height={16} />
              </>
            ) : (
              <>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#333",
                    lineHeight: 1.2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.email.split('@')[0]}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#666",
                    lineHeight: 1.2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.email}
                </Typography>
              </>
            )}
          </Box>
        )}

        {/* Solo mostrar flechas cuando no esté colapsado */}
        {!collapsed && (
          <>
            {isExpanded ? (
              <KeyboardArrowDownIcon
                sx={{
                  color: "#666",
                  transition: "transform 0.2s ease",
                  opacity: loading ? 0.5 : 1,
                }}
              />
            ) : (
              <KeyboardArrowUpIcon
                sx={{
                  color: "#666",
                  transition: "transform 0.2s ease",
                  opacity: loading ? 0.5 : 1,
                }}
              />
            )}
          </>
        )}
      </Box>

      {/* Dropdown con opción de logout */}
      <Box
        sx={{
          position: "absolute",
          bottom: "100%",
          left: 0,
          right: 0,
          backgroundColor: "white",
          borderRadius: theme.shape.borderRadius,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          overflow: "hidden",
          transition: "all 0.2s ease",
          opacity: isExpanded ? 1 : 0,
          transform: isExpanded ? "translateY(0)" : "translateY(100%)",
          pointerEvents: isExpanded ? "auto" : "none",
          zIndex: 1000,
          marginBottom: "8px",
        }}
      >
        <Box
          onClick={handleLogout}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            padding: "12px 16px",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <LogoutIcon sx={{ fontSize: 20, color: "#666" }} />
          {!collapsed && (
            <Typography
              sx={{
                fontSize: "14px",
                color: "#666",
                fontWeight: 500,
              }}
            >
              {t("layout.signOut")}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfile; 