import React, { useState, useMemo, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  Row,
  Cell,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  TextField,
  TablePagination,
  IconButton,
  Button,
  Menu,
  Chip,
  Select,
  MenuItem,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import UnfoldMore from "@mui/icons-material/UnfoldMore";
import FilterList from "@mui/icons-material/FilterList";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchField from "./SearchField";
import FSelect from "./FSelect";
import ConfirmDialog from "./ConfirmDialog";
import { useCategories } from "../hooks/useCategories";

// Tipos
interface TableData {
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface Bank {
  value: string;
  label: string;
}

interface SimpleTableProps<TData extends TableData = TableData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  onRowUpdate?: (newRow: TData, oldRow: TData) => void;
  onCellUpdate?: (
    transactionId: string,
    columnName: string,
    newValue: string | number
  ) => Promise<void>;
  onRowDelete?: (transactionIds: string[]) => Promise<void>;
  onBulkUpdate?: (transactionIds: string[], updates: { [key: string]: string | number }) => Promise<void>;
  editable?: boolean;
  searchable?: boolean;
  sortable?: boolean;
  pagination?: boolean;
  resizable?: boolean;
  disableFilter?: boolean;
  disableSearch?: boolean;
  banks?: Bank[];
}

// Estilos personalizados
const StyledTableContainer = styled(TableContainer)(() => ({
  backgroundColor: "white",
  borderRadius: 0,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  "& .MuiTableHead-root": {
    backgroundColor: "#F8F8FA",
    "& .MuiTableCell-head": {
      fontWeight: 600,
      fontSize: 14,
      color: "#131212",
      borderBottom: "2px solid #e0e0e0",
    },
  },
  "& .MuiTableBody-root": {
    "& .MuiTableRow-root": {
      "&:hover": {
        backgroundColor: "#f5f5f5",
      },
      "&.editing": {
        backgroundColor: "#e3f2fd !important",
      },
    },
    "& .MuiTableCell-body": {
      borderBottom: "1px solid #e0e0e0",
      padding: "12px 16px",
      fontSize: 14,
      "& > *": {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        width: "100%",
      },
    },
  },
  "& .MuiTableCell-root": {
    width: "auto",
    minWidth: "auto",
    maxWidth: "none",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    flex: "none",
  },
  "& table": {
    tableLayout: "fixed !important",
    width: "100% !important",
  },
}));

const SearchContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 16,
  padding: "20px",
  borderBottom: "1px solid #e0e0e0",
  backgroundColor: "white",
  justifyContent: "flex-end",
}));

// Estilos para el resize handle
const ResizeHandle = styled(Box)(({ theme }) => ({
  position: "absolute",
  right: 0,
  top: 0,
  bottom: 0,
  width: "4px",
  cursor: "col-resize",
  backgroundColor: "transparent",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
  },
  "&.resizing": {
    backgroundColor: theme.palette.primary.main,
    width: "2px",
  },
}));

export default function SimpleTable<TData extends TableData = TableData>({
  data,
  columns,
  onRowUpdate,
  onCellUpdate,
  onRowDelete,
  onBulkUpdate,
  editable = false,
  searchable = true,
  sortable = true,
  pagination = true,
  resizable = false,
  disableFilter = false,
  disableSearch = false,
  banks,
}: SimpleTableProps<TData>) {
  console.log("columns", columns);
  const theme = useTheme();
  const { t } = useTranslation();
  const { categories, subcategories, loading: categoriesLoading } = useCategories();
  const [globalFilter, setGlobalFilter] = useState("");
  const [editingCell, setEditingCell] = useState<{
    rowId: string;
    columnId: string;
  } | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [selectOpen, setSelectOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>("");
  const [bankFilter, setBankFilter] = useState<string>("");
  const [accountFilter, setAccountFilter] = useState<string>("");
  const [clientFilter, setClientFilter] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState<{
    dateRange: { start: string; end: string };
    accountType: string;
    bank: string;
    account: string;
    client: string;
  }>({
    dateRange: { start: "", end: "" },
    accountType: "",
    bank: "",
    account: "",
    client: "",
  });
  const [bulkEditMenuAnchor, setBulkEditMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [bulkAccount, setBulkAccount] = useState("");
  const [bulkAccountType, setBulkAccountType] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Debug: log rowSelection changes
  console.log("RowSelection state:", rowSelection);
  const tableRef = useRef<HTMLDivElement>(null);
  const resizeStartRef = useRef<{ width: number; x: number } | null>(null);

  // Debounce para la búsqueda
  const debouncedSearch = useCallback((value: string) => {
    const timeoutId = setTimeout(() => {
      setGlobalFilter(value);
    }, 300); // 300ms de delay

    return () => clearTimeout(timeoutId);
  }, []);

  // Manejar cambios en la búsqueda con debounce
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  // Columnas con funcionalidad de ordenamiento
  const tableColumns = useMemo(() => {
    return columns.map((column) => ({
      ...column,
      enableSorting: column.id === "select" ? false : sortable,
    }));
  }, [columns, sortable]);

  // Función de filtrado global simplificada
  const globalFilterFn = useCallback(
    (row: Row<TableData>, columnId: string, filterValue: string) => {
      // Si no hay filtro, mostrar todas las filas
      if (!filterValue || filterValue.trim() === "") {
        return true;
      }

      // Filtrar en todas las columnas
      const value = row.getValue(columnId);
      if (value == null) return false;

      const searchValue = filterValue.toLowerCase();
      const cellValue = String(value).toLowerCase();

      // Manejar valores numéricos formateados
      if (typeof value === "number") {
        // También buscar en el valor numérico sin formato
        const numericValue = value.toString();
        if (numericValue.includes(searchValue)) return true;
      }

      // Buscar en el valor formateado
      return cellValue.includes(searchValue);
    },
    []
  );

  // Datos filtrados por filtros personalizados
  const filteredData = useMemo(() => {
    return data.filter((rowData) => {
      // Filtro por rango de fechas
      if (activeFilters.dateRange.start || activeFilters.dateRange.end) {
        const rowDate = rowData.date;
        if (rowDate) {
          const date = new Date(rowDate);

          if (activeFilters.dateRange.start) {
            const startDate = new Date(activeFilters.dateRange.start);
            if (date < startDate) return false;
          }

          if (activeFilters.dateRange.end) {
            const endDate = new Date(activeFilters.dateRange.end);
            if (date > endDate) return false;
          }
        }
      }

      // Filtro por tipo de cuenta
      if (activeFilters.accountType && rowData.accountType) {
        if (rowData.accountType !== activeFilters.accountType) {
          return false;
        }
      }

      // Filtro por banco
      if (activeFilters.bank && rowData.bank) {
        if (rowData.bank !== activeFilters.bank) {
          return false;
        }
      }

      // Filtro por cuenta
      if (activeFilters.account && rowData.account) {
        if (rowData.account !== activeFilters.account) {
          return false;
        }
      }

      // Filtro por cliente
      if (activeFilters.client && rowData.client) {
        if (rowData.client !== activeFilters.client) {
          return false;
        }
      }

      return true;
    });
  }, [data, activeFilters]);

  // Extraer opciones únicas de accountType y bank
  const accountTypeOptions = useMemo(() => {
    const uniqueAccountTypes = [
      ...new Set(data.map((row) => row.accountType).filter(Boolean)),
    ];
    return uniqueAccountTypes.sort();
  }, [data]);

  const accountOptions = useMemo(() => {
    const uniqueAccounts = [
      ...new Set(data.map((row) => row.account).filter(Boolean)),
    ];
    return uniqueAccounts.sort();
  }, [data]);

  const clientOptions = useMemo(() => {
    const uniqueClients = [
      ...new Set(data.map((row) => row.client).filter(Boolean)),
    ];
    return uniqueClients.sort();
  }, [data]);

  // Verificar si hay datos de cliente en la tabla
  const hasClientData = useMemo(() => {
    return data.some((row) => row.client);
  }, [data]);

  // Tabla con filtrado optimizado
  const table = useReactTable({
    data: filteredData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
    state: {
      globalFilter,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
  });

  // Obtener filas seleccionadas
  const selectedRows = useMemo(() => {
    const rows = table.getFilteredSelectedRowModel().rows;
    console.log("Selected rows:", rows.length, rows);
    console.log("Should show delete bar:", rows.length > 0);
    return rows;
  }, [table, rowSelection]);

  // Funciones de redimensionamiento
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, columnId: string) => {
      if (!resizable) return;

      e.preventDefault();
      e.stopPropagation();

      // Guardar el estado inicial del resize
      const currentWidth =
        columnWidths[columnId] ||
        columns.find((col) => col.id === columnId)?.size ||
        10;
      resizeStartRef.current = {
        width: currentWidth,
        x: e.clientX,
      };

      setResizingColumn(columnId);

      const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();

        if (!resizeStartRef.current) return;

        const deltaX = e.clientX - resizeStartRef.current.x;
        const tableWidth = tableRef.current?.offsetWidth || 1000;
        const widthChange = (deltaX / tableWidth) * 100;
        const newWidth = Math.max(
          5,
          Math.min(50, resizeStartRef.current.width + widthChange)
        );

        setColumnWidths((prev) => ({
          ...prev,
          [columnId]: newWidth,
        }));
      };

      const handleMouseUp = () => {
        setResizingColumn(null);
        resizeStartRef.current = null;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [resizable, columnWidths, columns]
  );

  // Manejar menú de filtros
  const handleFilterMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleApplyFilters = () => {
    // Aplicar los filtros activos
    setActiveFilters({
      dateRange,
      accountType: accountTypeFilter,
      bank: bankFilter,
      account: accountFilter,
      client: clientFilter,
    });
    setFilterMenuAnchor(null);
  };

  const handleClearFilters = () => {
    setDateRange({ start: "", end: "" });
    setAccountTypeFilter("");
    setBankFilter("");
    setAccountFilter("");
    setClientFilter("");
    setActiveFilters({
      dateRange: { start: "", end: "" },
      accountType: "",
      bank: "",
      account: "",
      client: "",
    });
  };

  // Manejar edición de celdas
  const handleCellClick = (row: Row<TableData>, columnId: string) => {
    if (!editable) return;

    // No permitir edición en la columna de checkbox
    if (columnId === "select") return;

    const value = row.getValue(columnId);
    setEditingCell({ rowId: row.id, columnId });
    setEditingValue(value?.toString() || "");

    // Si es la columna account, accountType o bank, abrir el select automáticamente
    if (
      columnId === "category" ||
      columnId === "subcategory" ||
      columnId === "bank"
    ) {
      setSelectOpen(true);
    }
  };

  const handleCellSave = async () => {
    if (!editingCell || !onRowUpdate) return;

    const row = table.getRow(editingCell.rowId);
    const oldRow = row.original;

    // Convertir el valor según el tipo de campo
    let processedValue: string | number = editingValue;
    const isNumericField = [
      "credit_amount",
      "debit_amount",
      "balance",
    ].includes(editingCell.columnId);

    if (isNumericField && editingValue !== "") {
      processedValue = parseFloat(editingValue);
      if (isNaN(processedValue)) {
        processedValue = 0;
      }
    }

    const newRow = { ...oldRow, [editingCell.columnId]: processedValue };

    // Llamar al callback de actualización de celda si existe
    console.log("onCellUpdate");
    console.log("oldRow", oldRow);
    if (onCellUpdate && oldRow.transaction_id) {
      try {
        await onCellUpdate(
          oldRow.transaction_id,
          editingCell.columnId,
          processedValue
        );
      } catch (error) {
        console.error("Error actualizando celda:", error);
        // Opcional: mostrar un mensaje de error al usuario
        return;
      }
    }

    onRowUpdate(newRow, oldRow);
    setEditingCell(null);
    setEditingValue("");
  };

  const saveCellWithValue = async (value: string) => {
    if (!editingCell) return;

    const row = table.getRow(editingCell.rowId);
    const oldRow = row.original;

    // Si tenemos onCellUpdate, usarlo para actualizar la base de datos
    if (onCellUpdate && oldRow.transaction_id) {
      try {
        await onCellUpdate(oldRow.transaction_id, editingCell.columnId, value);
      } catch (error) {
        console.error('Error updating cell:', error);
        return;
      }
    }

    // Si tenemos onRowUpdate, usarlo para actualizar el estado local
    if (onRowUpdate) {
      const newRow = { ...oldRow, [editingCell.columnId]: value };
      onRowUpdate(newRow, oldRow);
    }

    setEditingCell(null);
    setEditingValue("");
    setSelectOpen(false);
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditingValue("");
    setSelectOpen(false);
  };

  // Función para manejar la eliminación de filas
  const handleDeleteRows = async () => {
    if (!onRowDelete || selectedRows.length === 0) return;
    setDeleting(true);
    try {
      const transactionIds = selectedRows.map(row => row.original.transaction_id).filter(Boolean);
      if (transactionIds.length === 0) {
        setDeleting(false);
        return;
      }
      await onRowDelete(transactionIds);
      setRowSelection({});
    } catch (error) {
      alert(t('table.deleteError') || 'Error al eliminar las transacciones. Por favor, intenta de nuevo.');
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  // Memoizar la validación numérica
  const numericFields = useMemo(
    () => new Set(["credit_amount", "debit_amount", "balance"]),
    []
  );

  // Opciones para el select de account (category)
  const categorySelectOptions = useMemo(
    () => categories.map(category => ({
      label: category.name,
      value: category.name
    })),
    [categories]
  );

  // Opciones para el select de account_type (subcategory)
  const subcategorySelectOptions = useMemo(
    () => subcategories.map(subcategory => ({
      label: subcategory.name,
      value: subcategory.name
    })),
    [subcategories]
  );

  // // Opciones para el select de bank
  // const bankSelectOptions = useMemo(() => [
  //   { label: 'Test bank', value: 'Test bank' },
  //   { label: 'Wells Fargo', value: 'Wells Fargo' },
  // ], []);

  // Función optimizada para validar números
  const validateNumericInput = useCallback((value: string) => {
    return /^-?\d*\.?\d*$/.test(value) || value === "";
  }, []);

  // Manejar menú de edición masiva
  const handleBulkEditMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setBulkEditMenuAnchor(event.currentTarget);
  };

  const handleBulkEditMenuClose = () => {
    setBulkEditMenuAnchor(null);
  };

  const handleBulkEditApply = async () => {
    if (!onBulkUpdate || selectedRows.length === 0) {
      setBulkEditMenuAnchor(null);
      return;
    }

    try {
      // Extraer los transaction_ids de las filas seleccionadas
      const transactionIds = selectedRows.map(row => row.original.transaction_id).filter(Boolean);
      
      if (transactionIds.length === 0) {
        console.warn('No se encontraron transaction_ids válidos para actualizar');
        setBulkEditMenuAnchor(null);
        return;
      }

      // Preparar las actualizaciones basadas en los valores seleccionados
      const updates: { [key: string]: string | number } = {};
      
      if (bulkAccount) {
        updates.category = bulkAccount;
      }
      
      if (bulkAccountType) {
        updates.subcategory = bulkAccountType;
      }

      // Solo actualizar si hay cambios
      if (Object.keys(updates).length > 0) {
        await onBulkUpdate(transactionIds, updates);
        console.log('Transacciones actualizadas exitosamente en bulk');
      }

      // Limpiar el estado
      setBulkAccount("");
      setBulkAccountType("");
      setBulkEditMenuAnchor(null);
      
    } catch (error) {
      console.error('Error actualizando transacciones en bulk:', error);
      alert(t('table.bulkUpdateError') || 'Error al actualizar las transacciones. Por favor, intenta de nuevo.');
    }
  };

  // Renderizar celda
  const renderCell = (cell: Cell<TData, unknown>, row: Row<TData>) => {
    const isEditing =
      editingCell?.rowId === row.id && editingCell?.columnId === cell.column.id;

    if (isEditing) {
      // Determinar el tipo de input basado en el campo
      const isNumericField = numericFields.has(cell.column.id);
      const isAccountField = cell.column.id === "category";
      const isAccountTypeField = cell.column.id === "subcategory";
      const isBankField = cell.column.id === "bank";

      // Si es la columna account, mostrar select
      if (isAccountField) {
        return (
          <Select
            value={editingValue}
            onChange={async (e) => {
              const value = e.target.value;
              setEditingValue(value);
              // Guardar inmediatamente con el valor seleccionado
              await saveCellWithValue(value);
              setSelectOpen(false);
            }}
            open={selectOpen}
            onOpen={() => setSelectOpen(true)}
            onClose={() => setSelectOpen(false)}
            size="small"
            variant="standard"
            autoFocus
            sx={{
              "& .MuiSelect-select": {
                padding: "4px 8px",
                fontSize: "14px",
              },
              "& .MuiInput-underline:before": {
                borderBottom: "none",
              },
              "& .MuiInput-underline:after": {
                borderBottom: "none",
              },
            }}
          >
            {categorySelectOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        );
      }

      // Si es la columna accountType, mostrar select
      if (isAccountTypeField) {
        return (
          <Select
            value={editingValue}
            onChange={async (e) => {
              const value = e.target.value;
              setEditingValue(value);
              // Guardar inmediatamente con el valor seleccionado
              await saveCellWithValue(value);
              setSelectOpen(false);
            }}
            open={selectOpen}
            onOpen={() => setSelectOpen(true)}
            onClose={() => setSelectOpen(false)}
            size="small"
            variant="standard"
            autoFocus
            sx={{
              "& .MuiSelect-select": {
                padding: "4px 8px",
                fontSize: "14px",
              },
              "& .MuiInput-underline:before": {
                borderBottom: "none",
              },
              "& .MuiInput-underline:after": {
                borderBottom: "none",
              },
            }}
          >
            {subcategorySelectOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        );
      }

      // Si es la columna bank, mostrar select
      if (isBankField) {
        return (
          <Select
            value={editingValue}
            onChange={(e) => {
              const selectedValue = e.target.value;
              // Buscar el banco seleccionado para obtener su label
              const selectedBank = banks.find(
                (bank) => bank.value === selectedValue
              );
              const bankLabel = selectedBank
                ? selectedBank.label
                : selectedValue;
              setEditingValue(bankLabel);
              // Guardar inmediatamente con el nombre del banco (label)
              saveCellWithValue(bankLabel);
              setSelectOpen(false);
            }}
            open={selectOpen}
            onOpen={() => setSelectOpen(true)}
            onClose={() => setSelectOpen(false)}
            size="small"
            variant="standard"
            autoFocus
            sx={{
              "& .MuiSelect-select": {
                padding: "4px 8px",
                fontSize: "14px",
              },
              "& .MuiInput-underline:before": {
                borderBottom: "none",
              },
              "& .MuiInput-underline:after": {
                borderBottom: "none",
              },
            }}
          >
            {banks.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        );
      }

      return (
        <TextField
          value={editingValue}
          onChange={(e) => {
            const newValue = e.target.value;
            // Para campos numéricos, solo permitir números y decimales
            if (isNumericField) {
              if (validateNumericInput(newValue)) {
                setEditingValue(newValue);
              }
            } else {
              setEditingValue(newValue);
            }
          }}
          onBlur={handleCellSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCellSave();
            if (e.key === "Escape") handleCellCancel();
          }}
          autoFocus
          size="small"
          variant="standard"
          type={isNumericField ? "number" : "text"}
          sx={{
            "& .MuiInputBase-input": {
              padding: "4px 8px",
              fontSize: "14px",
            },
            "& .MuiInput-underline:before": {
              borderBottom: "none",
            },
            "& .MuiInput-underline:after": {
              borderBottom: "none",
            },
          }}
        />
      );
    }

    return (
      <Box
        onClick={() => handleCellClick(row, cell.column.id)}
        sx={{
          cursor: editable ? "pointer" : "default",
          "&:hover": editable ? { backgroundColor: "#f0f0f0" } : {},
          padding: "4px 8px",
          borderRadius: "4px",
          minHeight: "20px",
          display: "flex",
          alignItems: "center",
          width: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </Box>
    );
  };

  // Estado para el modal de confirmación
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <>
      {/* Barra de búsqueda - se oculta cuando hay filas seleccionadas */}
      {searchable && !disableSearch && selectedRows.length === 0 && (
      <Box sx={{ minHeight: 90, backgroundColor: "white"}}>

        <SearchContainer>
          <SearchField
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={t("table.searchAllColumns")}
          />
          {!disableFilter && (
            <IconButton
              onClick={handleFilterMenuOpen}
              sx={{
                color: filterMenuAnchor ? "primary.main" : "text.secondary",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <FilterList />
            </IconButton>
          )}
          
        </SearchContainer>
      </Box>
      )}

      {/* Barra de eliminación - se muestra cuando hay filas seleccionadas */}
      {selectedRows.length > 0 && (
        <Box sx={{ paddingLeft: 14, borderBottom: "1px solid #e0e0e0", display: "flex", alignItems: "center", height: 90, gap: 20 }}>
          <Button
            onClick={() => setConfirmOpen(true)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#d32f2f",
              fontWeight: 500,
              fontSize: "14px",
              cursor: "pointer",
              border: "1px solid red",
              padding: 8,
              borderRadius: 4,
              minWidth: 40,
              "&:hover": {
                backgroundColor: "#d32f2f",
                color: "#fff",
              },
            }}
          >
            <DeleteIcon sx={{ fontSize: 20 }} />
            {selectedRows.length === 1
              ? t("table.deleteOneRow")
              : t("table.deleteManyRows", { count: selectedRows.length })}
          </Button>
                     <Button
             onClick={handleBulkEditMenuOpen}
             sx={{
               display: "flex",
               alignItems: "center",
               gap: 1,
               color: theme.palette.primary.main,
               fontWeight: 500,
               fontSize: "14px",
               cursor: "pointer",
               border: `1px solid ${theme.palette.primary.main}`,
               padding: 8,
               borderRadius: 4,
               minWidth: 40,
               "&:hover": {
                 backgroundColor: theme.palette.primary.main,
                 color: "#fff",
               },
             }}
           >
             <EditIcon sx={{ fontSize: 20 }} />
             {selectedRows.length === 1
               ? t("table.editOneRow")
               : t("table.editManyRows", { count: selectedRows.length })}
           </Button>
        </Box>
      )}


      {/* Chips de filtros activos */}
      {(activeFilters.dateRange.start ||
        activeFilters.dateRange.end ||
        activeFilters.accountType ||
        activeFilters.bank ||
        activeFilters.account) && (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            padding: "12px 20px",
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #e0e0e0",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Box sx={{ fontSize: "12px", color: "#666", marginRight: 1 }}>
            Active filters:
          </Box>
          {(activeFilters.dateRange.start || activeFilters.dateRange.end) && (
            <Chip
              label={
                activeFilters.dateRange.start && activeFilters.dateRange.end
                  ? `${new Date(
                      activeFilters.dateRange.start
                    ).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })} to ${new Date(
                      activeFilters.dateRange.end
                    ).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}`
                  : activeFilters.dateRange.start
                  ? `From: ${new Date(
                      activeFilters.dateRange.start
                    ).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}`
                  : `To: ${new Date(
                      activeFilters.dateRange.end
                    ).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}`
              }
              onDelete={() => {
                setActiveFilters((prev) => ({
                  ...prev,
                  dateRange: { start: "", end: "" },
                }));
                setDateRange({ start: "", end: "" });
              }}
              size="medium"
              color="primary"
              variant="outlined"
            />
          )}
          {activeFilters.accountType && (
            <Chip
              label={`Account Type: ${activeFilters.accountType}`}
              onDelete={() => {
                setActiveFilters((prev) => ({ ...prev, accountType: "" }));
                setAccountTypeFilter("");
              }}
              size="medium"
              color="primary"
              variant="outlined"
            />
          )}
          {activeFilters.bank && (
            <Chip
              label={`Bank: ${activeFilters.bank}`}
              onDelete={() => {
                setActiveFilters((prev) => ({ ...prev, bank: "" }));
                setBankFilter("");
              }}
              size="medium"
              color="primary"
              variant="outlined"
            />
          )}
          {activeFilters.account && (
            <Chip
              label={`Account: ${activeFilters.account}`}
              onDelete={() => {
                setActiveFilters((prev) => ({ ...prev, account: "" }));
                setAccountFilter("");
              }}
              size="medium"
              color="primary"
              variant="outlined"
            />
          )}
          {hasClientData && activeFilters.client && (
            <Chip
              label={`Client: ${activeFilters.client}`}
              onDelete={() => {
                setActiveFilters((prev) => ({ ...prev, client: "" }));
                setClientFilter("");
              }}
              size="medium"
              color="primary"
              variant="outlined"
            />
          )}
          <Button
            size="small"
            onClick={handleClearFilters}
            sx={{
              fontSize: "11px",
              textTransform: "none",
              color: "#666",
              "&:hover": {
                backgroundColor: "transparent",
                textDecoration: "underline",
              },
            }}
          >
            Clear all
          </Button>
        </Box>
      )}

      {/* Menú flotante de filtros */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={handleFilterMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 600,
            mt: 1,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            borderRadius: "12px",
            overflow: "visible",
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
      >
        <Box sx={{ p: 3, padding: 24 }}>
          {/* Header del menú */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FilterList sx={{ color: "primary.main", fontSize: 20 }} />
              <Box sx={{ fontWeight: 600, fontSize: "16px", color: "#333" }}>
                Advanced Filters
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: "12px",
                color: "#666",
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor:
                    activeFilters.dateRange.start ||
                    activeFilters.dateRange.end ||
                    activeFilters.accountType ||
                    activeFilters.bank ||
                    activeFilters.account ||
                    (hasClientData && activeFilters.client)
                      ? "#4caf50"
                      : "#ccc",
                }}
              />
              {activeFilters.dateRange.start ||
              activeFilters.dateRange.end ||
              activeFilters.accountType ||
              activeFilters.bank ||
              activeFilters.account ||
              (hasClientData && activeFilters.client)
                ? "Active filters"
                : "No filters"}
            </Box>
          </Box>

          {/* Campos de filtro */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Filtro de rango de fechas */}
            <Box>
              <Box
                sx={{
                  fontSize: "13px",
                  color: "#666",
                  marginBottom: "12px",
                  fontWeight: 500,
                }}
              >
                Date Range
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, start: e.target.value }))
                  }
                  size="small"
                  sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "6px",
                      backgroundColor: "#f8f9fa",
                      fontSize: "13px",
                      "&:hover": {
                        backgroundColor: "#f0f0f0",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "white",
                      },
                    },
                  }}
                  placeholder={t("table.from")}
                />
                <TextField
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, end: e.target.value }))
                  }
                  size="small"
                  sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "6px",
                      backgroundColor: "#f8f9fa",
                      fontSize: "13px",
                      "&:hover": {
                        backgroundColor: "#f0f0f0",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "white",
                      },
                    },
                  }}
                  placeholder={t("table.to")}
                />
              </Box>
            </Box>

            {/* Filtro de cuenta */}
            <Box>
              <Box
                sx={{
                  fontSize: "13px",
                  color: "#666",
                  marginBottom: "12px",
                  fontWeight: 500,
                }}
              >
                {t("table.account")}
              </Box>
              <FSelect
                label=""
                options={[
                  { value: "", label: t("table.allAccounts") },
                  ...accountOptions.map((account) => ({
                    value: account,
                    label: account,
                  })),
                ]}
                value={accountFilter}
                onChange={setAccountFilter}
                hideLabel={true}
                sx={{
                  marginTop: 0,
                  "& .MuiSelect-root": {
                    borderRadius: "6px",
                    backgroundColor: "#f8f9fa",
                    fontSize: "13px",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "white",
                    },
                  },
                }}
              />
            </Box>

            {/* Filtro de tipo de cuenta */}
            <Box>
              <Box
                sx={{
                  fontSize: "13px",
                  color: "#666",
                  marginBottom: "12px",
                  fontWeight: 500,
                }}
              >
                {t("table.accountType")}
              </Box>
              <FSelect
                label=""
                options={[
                  { value: "", label: t("table.allTypes") },
                  ...accountTypeOptions.map((accountType) => ({
                    value: accountType,
                    label: accountType,
                  })),
                ]}
                value={accountTypeFilter}
                onChange={setAccountTypeFilter}
                hideLabel={true}
                sx={{
                  marginTop: 0,
                  "& .MuiSelect-root": {
                    borderRadius: "6px",
                    backgroundColor: "#f8f9fa",
                    fontSize: "13px",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "white",
                    },
                  },
                }}
              />
            </Box>

            {/* Filtro de banco */}
            <Box>
              <Box
                sx={{
                  fontSize: "13px",
                  color: "#666",
                  marginBottom: "12px",
                  fontWeight: 500,
                }}
              >
                {t("table.bank")}
              </Box>
              <FSelect
                label=""
                options={[
                  { value: "", label: t("table.allBanks") },
                  ...(banks || []).map((bank) => ({
                    value: bank.value,
                    label: bank.label,
                  })),
                ]}
                value={bankFilter}
                onChange={setBankFilter}
                hideLabel={true}
                sx={{
                  marginTop: 0,
                  "& .MuiSelect-root": {
                    borderRadius: "6px",
                    backgroundColor: "#f8f9fa",
                    fontSize: "13px",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "white",
                    },
                  },
                }}
              />
            </Box>

            {/* Filtro de cliente - solo mostrar si hay datos de cliente */}
            {hasClientData && (
              <Box>
                <Box
                  sx={{
                    fontSize: "13px",
                    color: "#666",
                    marginBottom: "12px",
                    fontWeight: 500,
                  }}
                >
                  Client
                </Box>
                <FSelect
                  label=""
                  options={[
                    { value: "", label: "All Clients" },
                    ...clientOptions.map((client) => ({
                      value: client,
                      label: client,
                    })),
                  ]}
                  value={clientFilter}
                  onChange={setClientFilter}
                  hideLabel={true}
                  sx={{
                    marginTop: 0,
                    "& .MuiSelect-root": {
                      borderRadius: "6px",
                      backgroundColor: "#f8f9fa",
                      fontSize: "13px",
                      "&:hover": {
                        backgroundColor: "#f0f0f0",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "white",
                      },
                    },
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Botones de acción */}
          <Box
            sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 3 }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={handleClearFilters}
              sx={{
                borderRadius: "6px",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "12px",
                padding: "6px 16px",
              }}
            >
              {t("table.clear")}
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleApplyFilters}
              sx={{
                borderRadius: "6px",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "12px",
                padding: "6px 16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
              }}
            >
              {t("table.apply")}
            </Button>
          </Box>
        </Box>
      </Menu>

      {/* Menú flotante de edición masiva */}
      <Menu
        anchorEl={bulkEditMenuAnchor}
        open={Boolean(bulkEditMenuAnchor)}
        onClose={handleBulkEditMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 400,
            mt: 1,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            borderRadius: "12px",
            overflow: "visible",
          },
        }}
      >
        <Box
          sx={{
            p: 3,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <Box sx={{ fontWeight: 600, fontSize: "16px", color: "#333", mb: 3 }}>
            {t("table.editBulk")}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Box>
              <Box
                sx={{
                  fontSize: "13px",
                  color: "#666",
                  marginBottom: "12px",
                  fontWeight: 500,
                }}
              >
                {t("table.account")}
              </Box>
              <FSelect
                label=""
                options={[
                  { value: "", label: t("table.selectOne") },
                  ...categorySelectOptions.map((option) => ({
                    value: option.value,
                    label: option.label,
                  })),
                ]}
                value={bulkAccount}
                onChange={setBulkAccount}
                hideLabel={true}
                sx={{ marginTop: 0 }}
              />
            </Box>
            <Box>
              <Box
                sx={{
                  fontSize: "13px",
                  color: "#666",
                  marginBottom: "12px",
                  fontWeight: 500,
                }}
              >
                {t("table.accountType")}
              </Box>
              <FSelect
                label=""
                options={[
                  { value: "", label: t("table.selectOne") },
                  ...subcategorySelectOptions.map((option) => ({
                    value: option.value,
                    label: option.label,
                  })),
                ]}
                value={bulkAccountType}
                onChange={setBulkAccountType}
                hideLabel={true}
                sx={{ marginTop: 0 }}
              />
            </Box>
          </Box>
          <Box
            sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 3 }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={handleBulkEditMenuClose}
              sx={{
                borderRadius: "6px",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "12px",
                padding: "6px 16px",
              }}
            >
              {t("table.cancel")}
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleBulkEditApply}
              sx={{
                borderRadius: "6px",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "12px",
                padding: "6px 16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
              }}
            >
              {t("table.apply")}
            </Button>
          </Box>
        </Box>
      </Menu>

      {/* Tabla */}
      <StyledTableContainer ref={tableRef}>
        <Table sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const columnId = header.column.id;
                  const customWidth = columnWidths[columnId];
                  const width = customWidth || header.column.getSize();

                  return (
                    <TableCell
                      key={header.id}
                      sx={{
                        width: `${width}% !important`,
                        minWidth: `${width}% !important`,
                        maxWidth: `${width}% !important`,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: "none",
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: header.column.getCanSort()
                            ? "pointer"
                            : "default",
                        }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <Box>
                            {header.column.getIsSorted() === "asc" ? (
                              <ExpandMore sx={{ color: "lightgray" }} />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ExpandLess sx={{ color: "lightgray" }} />
                            ) : (
                              <UnfoldMore sx={{ color: "lightgray" }} />
                            )}
                          </Box>
                        )}
                      </Box>
                      {resizable && (
                        <ResizeHandle
                          className={
                            resizingColumn === columnId ? "resizing" : ""
                          }
                          onMouseDown={(e) => handleResizeStart(e, columnId)}
                        />
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={editingCell?.rowId === row.id ? "editing" : ""}
                >
                  {row.getVisibleCells().map((cell) => {
                    const columnId = cell.column.id;
                    const customWidth = columnWidths[columnId];
                    const width = customWidth || cell.column.getSize();

                    return (
                      <TableCell
                        key={cell.id}
                        sx={{
                          width: `${width}% !important`,
                          minWidth: `${width}% !important`,
                          maxWidth: `${width}% !important`,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: "none",
                        }}
                      >
                        {renderCell(cell, row)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  sx={{
                    textAlign: "center",
                    padding: "40px 16px",
                    color: "#666",
                    fontSize: "14px",
                  }}
                >
                  {globalFilter
                    ? t("table.noSearchResults")
                    : t("table.noDataAvailable")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Paginación */}
      {pagination && (
        <TablePagination
          component="div"
          count={table.getFilteredRowModel().rows.length}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
          rowsPerPage={table.getState().pagination.pageSize}
          onRowsPerPageChange={(e) => {
            const size = Number(e.target.value);
            table.setPageSize(size);
          }}
          rowsPerPageOptions={[10, 25, 50]}
          labelRowsPerPage={t("table.rowsPerPage")}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      )}
      {/* Modal de confirmación de borrado */}
      <ConfirmDialog
        open={confirmOpen}
        title={t("table.deleteConfirmTitle")}
        description={selectedRows.length === 1
          ? t("table.deleteConfirmOne")
          : t("table.deleteConfirmMany", { count: selectedRows.length })}
        confirmText={t("table.delete")}
        cancelText={t("table.cancel")}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteRows}
        loading={deleting}
      />
    </>
  );
}
