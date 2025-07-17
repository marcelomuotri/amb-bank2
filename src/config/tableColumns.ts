import { GridColDef } from '@mui/x-data-grid';

// Configuración base de columnas comunes
const baseColumns: GridColDef[] = [
  {
    field: "fecha",
    headerName: "FECHA",
    flex: 1,
    valueFormatter: (params: { value: string }) => {
      return new Date(params.value).toLocaleDateString('es-ES');
    },
  },
  {
    field: "numeroCheque",
    headerName: "NRO. CHEQUE",
    flex: 1,
  },
  {
    field: "detalle",
    headerName: "DETALLE",
    flex: 1,
  },
  {
    field: "credito",
    headerName: "CRÉDITO",
    flex: 1,
    type: "number",
    valueFormatter: (params: { value: number }) => {
      return params.value ? params.value.toLocaleString('es-CL') : '';
    },
  },
  {
    field: "debito",
    headerName: "DÉBITO",
    flex: 1,
    type: "number",
    valueFormatter: (params: { value: number }) => {
      return params.value ? params.value.toLocaleString('es-CL') : '';
    },
  },
  {
    field: "saldo",
    headerName: "SALDO",
    flex: 1,
    type: "number",
    valueFormatter: (params: { value: number }) => {
      return params.value ? params.value.toLocaleString('es-CL') : '';
    },
  },
  {
    field: "cuentaContable",
    headerName: "CUENTA CONTABLE",
    flex: 1,
  },
  {
    field: "tipoCuenta",
    headerName: "TIPO DE CUENTA",
    flex: 1,
  },
  {
    field: "banco",
    headerName: "BANCO",
    flex: 1,
  },
];

// Columnas para la tabla de búsqueda (solo lectura + columna cliente)
export const searchColumns: GridColDef[] = [
  {
    field: "cliente",
    headerName: "CLIENTE",
    flex: 1,
    editable: false,
  },
  ...baseColumns.map(col => ({ ...col, editable: false })),
];

// Columnas para Step2 (editables)
export const step2Columns: GridColDef[] = baseColumns.map(col => ({
  ...col,
  editable: true,
  filterable: true,
})); 