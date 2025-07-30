import { Box, MenuItem, Select, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import React from "react";

interface FSelectProps {
  label: string;
  options: { value: string; label: string }[];
  onChange?: (value: string) => void;
  sx?: object;
  hideLabel?: boolean;
  value?: string;
  placeholder?: string;
}

const FSelect = ({ label, options, onChange, sx, hideLabel = false, value: externalValue, placeholder }: FSelectProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [internalValue, setInternalValue] = useState(externalValue || "");

  const handleChange = (newValue: string) => {
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  // Update internal value when external value changes
  React.useEffect(() => {
    if (externalValue !== undefined) {
      setInternalValue(externalValue);
    }
  }, [externalValue]);

  return (
    <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 10, ...sx }}>
      {!hideLabel && (
        <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{t(label)}</Typography>
      )}
      <Box>
        <Select
          value={internalValue}
          onChange={(e) => handleChange(e.target.value)}
          displayEmpty
          renderValue={(selected) => {
            if (!selected) {
              return <span style={{ color: '#6B7280' }}>{placeholder || t(label)}</span>;
            }
            return options.find(option => option.value === selected)?.label || selected;
          }}
          sx={{
            width: "100%",
            //height: "40px",
            padding: "8.5px 14px",
            border: "1px solid #c4c4c4",
            borderRadius: theme.shape.borderRadius,
            fontSize: "16px",
            background: "white",
            ...sx,
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
};

export default FSelect;
