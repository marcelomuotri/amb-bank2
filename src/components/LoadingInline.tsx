import { Box, CircularProgress, Typography, useTheme } from "@mui/material";

interface LoadingInlineProps {
  loading: boolean;
  children: React.ReactNode;
}

const LoadingInline = ({ loading, children }: LoadingInlineProps) => {
  const theme = useTheme();
  if (!loading) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ 
      backgroundColor: "white", 
      minHeight: "80vh", 
      padding: 24,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.shape.borderRadius
    }}>
      <CircularProgress 
        size={50} 
        sx={{ 
          color: "#009B57",
          mb: 2
        }} 
      />
      <Typography 
        sx={{ 
          color: "#666", 
          fontSize: 14,
          fontWeight: 500
        }}
      >
        Cargando...
      </Typography>
    </Box>
  );
};

export default LoadingInline; 