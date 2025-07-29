import { Box, CircularProgress } from "@mui/material";

interface LoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
}

const LoadingOverlay = ({ loading, children }: LoadingOverlayProps) => {

  if (!loading) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ position: "relative", minHeight: "80vh" }}>
      {children}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          minHeight: "60vh",
        }}
      >
        <CircularProgress 
          size={60} 
          sx={{ 
            color: "white"
          }} 
        />
      </Box>
    </Box>
  );
};

export default LoadingOverlay; 