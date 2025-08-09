import { Box, Autocomplete, TextField, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import React from "react";

interface FAutocompleteProps {
  label: string;
  options: { value: string; label: string }[];
  onChange?: (value: string) => void;
  sx?: object;
  hideLabel?: boolean;
  value?: string;
  placeholder?: string;
}

const FAutocomplete = ({ 
  label, 
  options, 
  onChange, 
  sx, 
  hideLabel = false, 
  value: externalValue, 
  placeholder 
}: FAutocompleteProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [internalValue, setInternalValue] = useState<string>(externalValue || "");

  // Ordenar las opciones alfabéticamente por label
  const sortedOptions = [...options].sort((a, b) => a.label.localeCompare(b.label));

  // Encontrar la opción seleccionada
  const selectedOption = sortedOptions.find(option => option.value === internalValue);

  const handleChange = (event: any, newValue: { value: string; label: string } | null) => {
    const newValueString = newValue?.value || "";
    setInternalValue(newValueString);
    onChange?.(newValueString);
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
        <Autocomplete
          value={selectedOption}
          onChange={handleChange}
          options={sortedOptions}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={placeholder ? t(placeholder) : t(label)}
              sx={{
                "& .MuiOutlinedInput-root": {
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
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent !important",
                    border: "none !important",
                  },
                  "& .MuiInputBase-input": {
                    color: internalValue ? "#000" : "#374151",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#374151",
                    opacity: 1,
                  },
                },
                ...sx,
              }}
            />
          )}
          sx={{
            width: "100%",
            "& .MuiAutocomplete-popupIndicator": {
              color: "#666",
            },
            "& .MuiAutocomplete-clearIndicator": {
              color: "#666",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default FAutocomplete;
