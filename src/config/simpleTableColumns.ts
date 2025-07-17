import { ColumnDef } from '@tanstack/react-table';

// Tipo para los datos de la tabla
export interface TableRowData {
  id: number;
  date: string;
  checkNumber: string;
  details: string;
  credit: number;
  debit: number;
  balance: number;
  account: string;
  accountType: string;
  bank: string;
  client?: string;
}

// Configuración base de columnas comunes
export const baseColumns: ColumnDef<TableRowData>[] = [
  {
    id: '1',
    header: 'DATE',
    accessorKey: 'date',
    size: 8, // 8% del ancho total
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return new Date(value).toLocaleDateString('en-US');
    },
  },
  {
    id: '2',
    header: 'CHECK NO.',
    accessorKey: 'checkNumber',
    size: 5, // 5% del ancho total
  },
  {
    id: '3',
    header: 'DETAILS',
    accessorKey: 'details',
    size: 36, // 36% del ancho total (más ancho para texto largo)
  },
  {
    id: '4',
    header: 'CREDIT',
    accessorKey: 'credit',
    size: 10, // 10% del ancho total
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return value ? value.toLocaleString('en-US') : '';
    },
  },
  {
    id: '5',
    header: 'DEBIT',
    accessorKey: 'debit',
    size: 7, // 7% del ancho total
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return value ? value.toLocaleString('en-US') : '';
    },
  },
  {
    id: '6',
    header: 'BALANCE',
    accessorKey: 'balance',
    size: 7, // 7% del ancho total
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return value ? value.toLocaleString('en-US') : '';
    },
  },
  {
    id: '7',
    header: 'ACCOUNT',
    accessorKey: 'account',
    size: 12, // 12% del ancho total
  },
  {
    id: '8',
    header: 'ACCOUNT TYPE',
    accessorKey: 'accountType',
    size: 12, // 12% del ancho total
  },
  {
    id: '9',
    header: 'BANK',
    accessorKey: 'bank',
    size: 13, // 13% del ancho total
  },
];

// Columnas para la tabla de búsqueda (editables + columna cliente)
export const searchColumns: ColumnDef<TableRowData>[] = [
  {
    id: '0',
    header: 'CLIENT',
    accessorKey: 'client',
    size: 8, // 8% del ancho total
    enableSorting: true,
  },
  ...baseColumns,
];

// Columnas para Step2 (editables)
export const step2Columns: ColumnDef<TableRowData>[] = baseColumns; 