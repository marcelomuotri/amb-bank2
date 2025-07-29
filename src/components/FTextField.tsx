import { Box, TextField, Typography, SxProps, Theme, Chip, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

interface FTextFieldProps {
  label: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  sx?: SxProps<Theme>;
  hideLabel?: boolean;
  value?: string;
  required?: boolean;
  type?: string;
  multiline?: boolean;
  rows?: number;
  enableChips?: boolean;
  onChipsChange?: (chips: string[]) => void;
  chips?: string[];
}

const FTextField = ({
  label,
  placeholder,
  onChange,
  sx,
  hideLabel = false,
  value: externalValue,
  required = false,
  type = "text",
  multiline = false,
  rows = 1,
  enableChips = false,
  onChipsChange,
  chips: externalChips,
}: FTextFieldProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [internalValue, setInternalValue] = useState(externalValue || "");
  const [internalChips, setInternalChips] = useState<string[]>(externalChips || []);

  const handleChange = (newValue: string) => {
    setInternalValue(newValue);
    if (!enableChips) {
      onChange?.(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (enableChips && e.key === 'Enter' && internalValue.trim()) {
      e.preventDefault();
      const newChip = internalValue.trim();
      if (!internalChips.includes(newChip)) {
        const updatedChips = [...internalChips, newChip];
        setInternalChips(updatedChips);
        onChipsChange?.(updatedChips);
        setInternalValue("");
      }
    }
  };

  const handleDeleteChip = (chipToDelete: string) => {
    const updatedChips = internalChips.filter(chip => chip !== chipToDelete);
    setInternalChips(updatedChips);
    onChipsChange?.(updatedChips);
  };

  // Update internal value when external value changes
  React.useEffect(() => {
    if (externalValue !== undefined) {
      setInternalValue(externalValue);
    }
  }, [externalValue]);

  // Update internal chips when external chips change
  React.useEffect(() => {
    if (externalChips !== undefined) {
      setInternalChips(externalChips);
    }
  }, [externalChips]);

  return (
    <Box
      sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 10, width: "100%", ...sx }}
    >
      {!hideLabel && (
        <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
          {t(label)}
        </Typography>
      )}
      <Box sx={{ width: "100%" }}>
        <TextField
          value={internalValue}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ? t(placeholder) : undefined}
          required={required}
          type={type}
          multiline={multiline}
          rows={rows}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              padding: "8.5px 14px",
              fontSize: "16px",
              background: "white",
              border: "1px solid #c4c4c4",
              borderRadius: theme.shape.borderRadius,
              minHeight: enableChips && internalChips.length > 0 ? "auto" : "56px",
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,

              "&.Mui-focused": {
                borderColor: "primary.main",
                borderWidth: "2px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiInputBase-input": {
                padding: 0,
                flex: 1,
                minWidth: "120px",
              },
            },
            ...sx,
          }}
          InputProps={{
            startAdornment: enableChips && internalChips.length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mr: 1 }}>
                {internalChips.map((chip, index) => (
                  <Chip
                    key={index}
                    label={chip}
                    onDelete={() => handleDeleteChip(chip)}
                    deleteIcon={<CloseIcon />}
                    size="small"
                    sx={{
                      backgroundColor: `${theme.palette.primary.main}20`,
                      color: theme.palette.primary.main,
                      height: "24px",
                      fontSize: "12px",
                      "& .MuiChip-deleteIcon": {
                        color: theme.palette.primary.main,
                        fontSize: "16px",
                        "&:hover": {
                          color: theme.palette.error.main,
                        },
                      },
                    }}
                  />
                ))}
              </Box>
            ) : undefined,
          }}
        />
      </Box>
    </Box>
  );
};

export default FTextField;
