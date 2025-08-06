import { TableRowData } from "../config/simpleTableColumns";

export const exportToCSV = (
  rows: TableRowData[],
  t: (key: string) => string,
  filename?: string
) => {
  if (!rows || rows.length === 0) {
    alert(t("step2.noDataToDownload"));
    return;
  }

  // Definir las columnas que queremos en el CSV
  const csvColumns = [
    'transaction_id',
    'date',
    'description',
    'credit_amount',
    'debit_amount',
    'balance',
    'category',
    'subcategory',
    'source'
  ];

  // Crear el header del CSV
  const headers = csvColumns.map(col => t(`table.${col}`)).join(',');
  
  // Crear las filas del CSV
  const csvRows = rows.map((row, index) => {
    return csvColumns.map(col => {
      let value;
      
      // Calcular balance acumulativo si es la columna balance
      if (col === 'balance') {
        let accumulatedBalance = 0;
        // Calcular balance acumulativo hasta la fila actual
        for (let i = 0; i <= index; i++) {
          const credit = rows[i].credit_amount || 0;
          const debit = rows[i].debit_amount || 0;
          accumulatedBalance += credit - debit;
        }
        value = accumulatedBalance;
      } else {
        value = row[col as keyof TableRowData];
      }
      
      // Escapar comillas y envolver en comillas si contiene coma
      const escapedValue = String(value || '').replace(/"/g, '""');
      return escapedValue.includes(',') ? `"${escapedValue}"` : escapedValue;
    }).join(',');
  });

  // Combinar header y filas
  const csvContent = [headers, ...csvRows].join('\n');

  // Crear el blob y descargar
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename || `transactions_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 