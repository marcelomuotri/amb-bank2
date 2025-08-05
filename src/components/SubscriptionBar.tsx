import React, { useState } from "react";
import { Box, Typography, LinearProgress, Skeleton } from "@mui/material";
import { styled } from "@mui/material/styles";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useTranslation } from "react-i18next";


interface SubscriptionBarProps {
  used: number;
  total: number;
  unit?: string;
  renewalDate?: string;
  loading?: boolean;
}

const StyledSubscriptionBar = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  padding: "12px 16px",
  borderRadius: "8px",
}));

const HeaderRow = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const ProgressContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 8,
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: `${theme.palette.primary.main}20`,
  "& .MuiLinearProgress-bar": {
    borderRadius: 4,
    backgroundColor: theme.palette.primary.main,
  },
}));

const InfoRow = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "12px",
  color: "#6B7280",
}));

const ExpandableContent = styled(Box)(() => ({
  overflow: "hidden",
  transition: "all 0.3s ease-in-out",
}));

const SubscriptionBar: React.FC<SubscriptionBarProps> = ({
  used,
  total,
  renewalDate = "1/7/2025",
  loading = false,
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const percentage = Math.min((used / total) * 100, 100);
  const remaining = total - used;

  return (
    <StyledSubscriptionBar>
      <HeaderRow>
        <Typography
          sx={{
            fontSize: 16,
            color: "#1F2937",
            fontWeight: 600,
          }}
        >
          {t("subscription.totalAvailable")}
        </Typography>
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 1,
            cursor: loading ? "default" : "pointer"
          }}
          onClick={() => !loading && setIsExpanded(!isExpanded)}
        >
          {loading ? (
            <Skeleton width={40} height={24} />
          ) : (
            <Typography
              sx={{
                fontSize: 16,
                color: "#1F2937",
                fontWeight: 600,
              }}
            >
              {remaining}
            </Typography>
          )}
          <KeyboardArrowRightIcon 
            sx={{ 
              fontSize: 30, 
              color: "#1F2937",
              transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease-in-out",
              opacity: loading ? 0.5 : 1,
            }} 
          />
        </Box>
      </HeaderRow>

      <ProgressContainer>
        {loading ? (
          <Skeleton width="100%" height={8} sx={{ borderRadius: 1 }} />
        ) : (
          <StyledLinearProgress
            variant="determinate"
            value={percentage}
          />
        )}
      </ProgressContainer>

      <ExpandableContent
        sx={{
          maxHeight: isExpanded ? "120px" : "0px",
          opacity: isExpanded ? 1 : 0,
          transform: isExpanded ? "translateY(0)" : "translateY(-10px)",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: "8px" }}>
          <InfoRow>
            <span>{t("subscription.creditsAvailable")}</span>
            <span>{remaining}</span>
          </InfoRow>
          <InfoRow>
            <span>{t("subscription.usedThisMonth")}</span>
            <span>{used}</span>
          </InfoRow>
          <InfoRow>
            <span>{t("subscription.renewsOn")} {renewalDate}</span>
            <span></span>
          </InfoRow>
        </Box>
      </ExpandableContent>
    </StyledSubscriptionBar>
  );
};

export default SubscriptionBar; 