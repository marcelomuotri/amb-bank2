import { InputAdornment, TextField, Toolbar, Box } from "@mui/material";
import {
  QuickFilter,
  useGridApiContext,
} from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import FSelect from "./FSelect";

const StyledQuickFilter = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  gap: 16,
}));

const StyledTextField = styled(TextField)(() => ({
  "& .MuiInputBase-root": {
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 8,
    height: "48px",
    display: "flex",
    alignItems: "center",
    "&:hover": {
      border: "1px solid #999",
    },
    "&.Mui-focused": {
      border: "1px solid lightgray",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiInputAdornment-root": {
    color: "#666",
  },
  "& .MuiInputBase-input": {
    paddingLeft: 20,
  },
}));

function CustomToolbar() {
  const { t } = useTranslation();
  const apiRef = useGridApiContext();
  const [selectedColumn, setSelectedColumn] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const handleColumnChange = (value: string) => {
    setSelectedColumn(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  // Apply filter when values change
  useEffect(() => {
    if (searchValue) {
      if (selectedColumn) {
        // Define numeric columns
        const numericColumns = ["credito", "debito", "saldo"];
        const isNumericColumn = numericColumns.includes(selectedColumn);
        
        if (isNumericColumn) {
          // For numeric columns, handle Spanish number format
          // Convert Spanish format (1.234,56) to standard format (1234.56)
          let cleanSearchValue = searchValue;
          
          // If the search value contains a comma, treat it as Spanish format
          if (searchValue.includes(',')) {
            // Replace dots with empty string and comma with dot
            cleanSearchValue = searchValue.replace(/\./g, '').replace(',', '.');
          }
          
          const numericValue = parseFloat(cleanSearchValue);
          
          if (!isNaN(numericValue)) {
            // Use equals operator for exact numeric match
            const filterModel = {
              items: [
                {
                  field: selectedColumn,
                  operator: "=",
                  value: numericValue,
                },
              ],
              quickFilterValues: [],
            };
            apiRef.current.setFilterModel(filterModel);
          } else {
            // If not a valid number, use contains as string (for partial matches)
            const filterModel = {
              items: [
                {
                  field: selectedColumn,
                  operator: "contains",
                  value: searchValue,
                },
              ],
              quickFilterValues: [],
            };
            apiRef.current.setFilterModel(filterModel);
          }
        } else {
          // For text columns, use 'contains' operator
          const filterModel = {
            items: [
              {
                field: selectedColumn,
                operator: "contains",
                value: searchValue,
              },
            ],
            quickFilterValues: [],
          };
          apiRef.current.setFilterModel(filterModel);
        }
      } else {
        // Global search
        apiRef.current.setFilterModel({
          items: [],
          quickFilterValues: [searchValue],
        });
      }
    } else {
      // Clear all filters
      apiRef.current.setFilterModel({
        items: [],
        quickFilterValues: [],
      });
    }
  }, [selectedColumn, searchValue, apiRef]);

  const columnOptions = [
    { value: "", label: t('table.allColumns') },
    { value: "fecha", label: "FECHA" },
    { value: "numeroCheque", label: "Nro. Cheque" },
    { value: "detalle", label: "DETALLE" },
    { value: "credito", label: "CRÉDITO" },
    { value: "debito", label: "DÉBITO" },
    { value: "saldo", label: "SALDO" },
    { value: "cuentaContable", label: "CUENTA CONTABLE" },
    { value: "tipoCuenta", label: "TIPO DE CUENTA" },
    { value: "banco", label: "BANCO" },
  ];

  return (
    <Toolbar>
      <QuickFilter>
        <StyledQuickFilter sx={{ gap: 20 }}>
          {/* Column selector */}
          <Box sx={{ width: "300px", border: "1px solid lightgray", borderRadius: "8px" }}>
            <FSelect
              label=""
              options={columnOptions}
              value={selectedColumn}
              onChange={handleColumnChange}
              hideLabel={true}
              sx={{
                marginTop: 0,
                "& .MuiSelect-root": {
                  padding: "20px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  "&:hover": {
                    border: "1px solid #999",
                  },
                  "&.Mui-focused": {
                    border: "1px solid lightgray",
                  },
                  "&.MuiSelect-select": {
                    border: "1px solid #ccc",
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            />
          </Box>

          {/* Search field */}
          <StyledTextField
            size="small"
            placeholder={t('table.search')}
            value={searchValue}
            onChange={handleSearchChange}
            sx={{ minWidth: 300 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "lightgray" }} />
                  </InputAdornment>
                ),
                endAdornment: searchValue ? (
                  <InputAdornment position="end">
                    <CancelIcon 
                      fontSize="small" 
                      sx={{ cursor: "pointer", color: "lightgray" }}
                      onClick={() => setSearchValue("")}
                    />
                  </InputAdornment>
                ) : null,
              },
            }}
          />
        </StyledQuickFilter>
      </QuickFilter>
    </Toolbar>
  );
}

export default CustomToolbar;
