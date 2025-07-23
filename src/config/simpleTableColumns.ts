import { ColumnDef } from '@tanstack/react-table';
import React from 'react';

// Tipo para los datos de la tabla - actualizado para coincidir con el webhook
export interface TableRowData {
  id: number;
  transaction_id: string;
  date: string;
  description: string;
  credit_amount: number | null;
  debit_amount: number | null;
  balance: number | null;
  category: string;
  subcategory: string;
  source: string;
  client_id: number;
  checkNumber?: string;
  bank?: string;
  observations?: string;
  selected?: boolean; // Campo para el estado de selección
}

// Configuración base de columnas comunes
export const baseColumns: ColumnDef<TableRowData>[] = [
  {
    id: 'select',
    header: ({ table }) => {
      const isIndeterminate = table.getIsSomePageRowsSelected();
      return React.createElement('input', {
        type: 'checkbox',
        checked: table.getIsAllPageRowsSelected(),
        ref: (el) => {
          if (el) {
            el.indeterminate = isIndeterminate;
          }
        },
        onChange: table.getToggleAllPageRowsSelectedHandler(),
        style: { cursor: 'pointer' }
      });
    },
    size: 1, // 4% del ancho total
    enableSorting: false,
    enableColumnFilter: false,
    enableHiding: false,
    sortDescFirst: false,
    cell: ({ row }) => {
      return React.createElement('input', {
        type: 'checkbox',
        checked: row.getIsSelected(),
        onChange: row.getToggleSelectedHandler(),
        style: { cursor: 'pointer' }
      });
    },
  },
  {
    id: 'date',
    header: 'DATE',
    accessorKey: 'date',
    size: 20, // 8% del ancho total
    cell: ({ getValue }) => {
      try {
        const value = getValue() as string;
        return value ? new Date(value).toLocaleDateString('en-US') : '';
      } catch (error) {
        console.error('Error formateando fecha:', error);
        return '';
      }
    },
  },
  {
    id: 'description',
    header: 'DETAILS',
    accessorKey: 'description',
    size: 45, // 36% del ancho total (más ancho para texto largo)
  },
  {
    id: 'credit_amount',
    header: 'CREDIT',
    accessorKey: 'credit_amount',
    size: 10, // 10% del ancho total
    cell: ({ getValue }) => {
      try {
        const value = getValue() as number | null;
        return value ? value.toLocaleString('en-US') : '';
      } catch (error) {
        console.error('Error formateando crédito:', error);
        return '';
      }
    },
  },
  {
    id: 'debit_amount',
    header: 'DEBIT',
    accessorKey: 'debit_amount',
    size: 7, // 7% del ancho total
    cell: ({ getValue }) => {
      try {
        const value = getValue() as number | null;
        return value ? value.toLocaleString('en-US') : '';
      } catch (error) {
        console.error('Error formateando débito:', error);
        return '';
      }
    },
  },
  {
    id: 'balance',
    header: 'BALANCE',
    size: 7, // 7% del ancho total
    cell: ({ row, table }) => {
      try {
        // Calcular balance acumulativo basándose en todas las filas
        const allRows = table.getRowModel().rows;
        const currentRowIndex = row.index;
        let accumulatedBalance = 0;
        
        // Sumar todos los créditos y débitos hasta la fila actual
        for (let i = 0; i <= currentRowIndex; i++) {
          const currentRow = allRows[i];
          if (currentRow) {
            const credit = currentRow.getValue('credit_amount') as number || 0;
            const debit = currentRow.getValue('debit_amount') as number || 0;
            accumulatedBalance += credit - debit;
          }
        }
        
        return accumulatedBalance ? accumulatedBalance.toLocaleString('en-US') : '';
      } catch (error) {
        console.error('Error calculando balance:', error);
        return '';
      }
    },
  },
  {
    id: 'category',
    header: 'ACCOUNT',
    accessorKey: 'category',
    size: 12, // 12% del ancho total
  },
  {
    id: 'subcategory',
    header: 'ACCOUNT TYPE',
    accessorKey: 'subcategory',
    size: 12, // 12% del ancho total
  },
  {
    id: 'bank',
    header: 'BANK',
    accessorKey: 'bank',
    size: 13, // 13% del ancho total
  },
  {
    id: 'observations',
    header: 'OBSERVATIONS',
    accessorKey: 'observations',
    size: 18,
    enableSorting: false,
    cell: ({ getValue }) => {
      try {
        return getValue() || '';
      } catch (error) {
        console.error('Error obteniendo observaciones:', error);
        return '';
      }
    },
    // editable por defecto en SimpleTable si la tabla es editable
  },
];

// Columnas para la tabla de búsqueda (editables + columna cliente)
export const searchColumns: ColumnDef<TableRowData>[] = [
  
  ...baseColumns,
];

// Columnas para Step2 (editables)
export const step2Columns: ColumnDef<TableRowData>[] = baseColumns; 