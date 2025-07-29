import { Box, CircularProgress, Fade } from "@mui/material";

interface LoadingFadeProps {
  loading: boolean;
  children: React.ReactNode;
}

const LoadingFade = ({ loading, children }: LoadingFadeProps) => {
  return (
    <Box sx={{ position: "relative" }}>
      <Fade in={!loading} timeout={300}>
        <Box>{children}</Box>
      </Fade>
      
      <Fade in={loading} timeout={300}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(2px)",
          }}
        >
          <CircularProgress 
            size={40} 
            sx={{ 
              color: "#009B57"
            }} 
          />
        </Box>
      </Fade>
    </Box>
  );
};

export default LoadingFade; 