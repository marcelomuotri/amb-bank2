import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import FButton from "./FButton/FButton";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmText,
  cancelText,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        <Typography>{description}</Typography>
      </DialogContent>
      <DialogActions>
        <FButton 
          onClick={onClose} 
          disabled={loading}
          title={cancelText || t("table.cancel")}
          variant="outlined"
        />
        <FButton
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
          title={confirmText || t("table.delete")}
        />
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog; 