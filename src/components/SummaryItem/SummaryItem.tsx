import { Box, Typography, useTheme } from "@mui/material";
import PaperIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close";
// import EditIcon from "@mui/icons-material/Edit";
// import CheckIcon from "@mui/icons-material/Check";
// import CancelIcon from "@mui/icons-material/Cancel";
// import { useState } from "react";
// import { useTranslation } from "react-i18next";

interface SummaryItemProps {
  bankName: string;
  fileName: string;
  onDelete?: () => void;
  sx?: object;
  // onUpdate?: (newBankName: string, newFileName: string) => void;
}

const SummaryItem = ({ bankName, fileName, onDelete, sx }: SummaryItemProps) => {
  const theme = useTheme();
  // const { t } = useTranslation();
  // const [isEditing, setIsEditing] = useState(false);
  // const [editBankName, setEditBankName] = useState(bankName);
  // const [editFileName, setEditFileName] = useState(fileName);

  // const handleEdit = () => {
  //   setIsEditing(true);
  // };

  // const handleSave = () => {
  //   if (onUpdate) {
  //     onUpdate(editBankName, editFileName);
  //   }
  //   setIsEditing(false);
  // };

  // const handleCancel = () => {
  //   setEditBankName(bankName);
  //   setEditFileName(fileName);
  //   setIsEditing(false);
  // };

  // const handleKeyPress = (event: React.KeyboardEvent) => {
  //   if (event.key === 'Enter') {
  //     handleSave();
  //   } else if (event.key === 'Escape') {
  //     handleCancel();
  //   }
  // };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 24,
        border: "1px solid lightgrey",
        borderRadius: "20px",
        backgroundColor: "white",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        },
        ...sx,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 20, flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 50,
            height: 50,
            borderRadius: "50%",
            backgroundColor: `${theme.palette.primary.main}20`,
          }}
        >
          <PaperIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
        </Box>
        
        {/* {isEditing ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
            <TextField
              size="small"
              value={editBankName}
              onChange={(e) => setEditBankName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t("summaryItem.bankNamePlaceholder")}
              sx={{ 
                "& .MuiOutlinedInput-root": { 
                  fontSize: 14,
                  fontWeight: 600 
                } 
              }}
            />
            <TextField
              size="small"
              value={editFileName}
              onChange={(e) => setEditFileName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t("summaryItem.fileNamePlaceholder")}
              sx={{ 
                "& .MuiOutlinedInput-root": { 
                  fontSize: 12,
                  fontWeight: 500 
                } 
              }}
            />
          </Box>
        ) : ( */}
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
              {bankName}
            </Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#666" }}>
              {fileName}
            </Typography>
          </Box>
        {/* )} */}
      </Box>
      
      <Box sx={{ display: "flex", gap: 1 }}>
        {/* {isEditing ? (
          <>
            <IconButton 
              size="small" 
              onClick={handleSave}
              sx={{ color: "green" }}
            >
              <CheckIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={handleCancel}
              sx={{ color: "orange" }}
            >
              <CancelIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton 
              size="small" 
              onClick={handleEdit}
              sx={{ color: "blue" }}
            >
              <EditIcon sx={{ fontSize: 20 }} />
            </IconButton> */}
            {onDelete && (
              <Box sx={{ cursor: "pointer" }} onClick={onDelete}>
                <CloseIcon sx={{ fontSize: 30, color: "grey" }} />
              </Box>
            )}
          {/* </>
        )} */}
      </Box>
    </Box>
  );
};

export default SummaryItem;
