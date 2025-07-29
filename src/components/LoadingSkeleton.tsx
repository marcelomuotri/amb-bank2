import { Box, Skeleton, useTheme } from "@mui/material";

interface LoadingSkeletonProps {
  loading: boolean;
  children: React.ReactNode;
}

const LoadingSkeleton = ({ loading, children }: LoadingSkeletonProps) => {
  const theme = useTheme();
  if (!loading) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ backgroundColor: "white", minHeight: "80vh", padding: 24, borderRadius: theme.shape.borderRadius }}>
      {/* Header skeleton */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Skeleton variant="text" width={200} height={32} />
        <Skeleton variant="rectangular" width={150} height={48} />
      </Box>

      {/* Table skeleton */}
      <Box sx={{ width: "100%" }}>
        {/* Table header */}
        <Box sx={{ display: "flex", mb: 2 }}>
          <Skeleton variant="text" width={400} height={24} sx={{ mr: 2 }} />
          <Skeleton variant="text" width={300} height={24} sx={{ mr: 2 }} />
          <Skeleton variant="text" width={300} height={24} sx={{ mr: 2 }} />
          <Skeleton variant="text" width={150} height={24} />
        </Box>

        {/* Table rows */}
        {[...Array(8)].map((_, index) => (
          <Box key={index} sx={{ display: "flex", mb: 1 }}>
            <Skeleton variant="text" width={400} height={20} sx={{ mr: 2 }} />
            <Skeleton variant="text" width={300} height={20} sx={{ mr: 2 }} />
            <Skeleton variant="text" width={300} height={20} sx={{ mr: 2 }} />
            <Skeleton variant="text" width={150} height={20} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default LoadingSkeleton; 