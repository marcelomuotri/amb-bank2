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

  // Ordenar las opciones alfabéticamente por label
  const sortedOptions = [...options].sort((a, b) => a.label.localeCompare(b.label));

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
              return <span style={{ color: '#374151' }}>{placeholder ? t(placeholder) : t(label)}</span>;
            }
            return sortedOptions.find(option => option.value === selected)?.label || selected;
          }}
          sx={{
            width: "100%",
            minHeight: "46px",
            padding: "8.5px 14px",
            border: "1px solid #d1d5db !important",
            borderRadius: theme.shape.borderRadius,
            fontSize: "16px",
            background: "white",
            "&.Mui-focused": {
              borderColor: "primary.main !important",
              borderWidth: "2px !important",
            },
            "& .MuiSelect-icon": {
              color: "#666",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent !important",
              border: "none !important",
            },
            ...sx,
          }}
        >
          {sortedOptions.map((option) => (
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
