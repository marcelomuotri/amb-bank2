import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import SimpleTable from "../../components/SimpleTable";
import { searchColumns, TableRowData } from "../../config/simpleTableColumns";

const rowsData: TableRowData[] = [
  { id: 1, date: '2024-01-01', checkNumber: '', details: 'Western Funding Payables 122923 F_WFI1069038', credit: 2380.48, debit: 0, balance: 123137.99, account: 'Sales', accountType: 'Income', bank: 'Wells Fargo', client: 'client1' },
  { id: 2, date: '2024-01-02', checkNumber: '', details: 'Purchase authorized on 12/29 Wesco Insurance CO 012-345-6789 PA S583363650522916 Card 7995', credit: 0, debit: 3905.20, balance: 119232.79, account: 'Insurance Expense', accountType: 'Expense', bank: 'Wells Fargo', client: 'client2' },
  { id: 3, date: '2024-01-03', checkNumber: '', details: 'Purchase authorized on 12/29 Wesco Insurance CO 012-345-6789 PA S583363650537856 Card 7995', credit: 0, debit: 1380.00, balance: 117852.79, account: 'Insurance Expense', accountType: 'Expense', bank: 'Wells Fargo', client: 'client3' },
  { id: 4, date: '2024-01-04', checkNumber: '1178', details: 'Deposited OR Cashed Check', credit: 0, debit: 875.00, balance: 116977.79, account: 'Sales Commissions', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client1' },
  { id: 5, date: '2024-01-05', checkNumber: '', details: '01/02Bankcard Deposit -0328121737', credit: 0, debit: 855.51, balance: 116122.28, account: 'Office Supplies', accountType: 'Expense', bank: 'Wells Fargo', client: 'client2' },
  { id: 6, date: '2024-01-06', checkNumber: '', details: 'Purchase authorized on 12/30 Fedex595938084 800-4633339 TN S383364482441490 Card 5347', credit: 0, debit: 66.36, balance: 116055.92, account: 'Shipping', accountType: 'Cost of Goods Sold', bank: 'Wells Fargo', client: 'client3' },
];

const SearchWithSimpleTable = () => {
  const { t } = useTranslation();
  const [rows, setRows] = useState<TableRowData[]>(rowsData);

  const handleRowUpdate = (newRow: TableRowData, oldRow: TableRowData) => {
    setRows(prevRows => 
      prevRows.map(row => row.id === oldRow.id ? newRow : row)
    );
    console.log('Row updated:', { newRow, oldRow });
  };

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "0px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <Typography
          component="h4"
          sx={{
            fontWeight: 600,
            color: "#333",
            fontSize: "1.5rem",
            margin: 0,
          }}
        >
          {t('search.newTableTitle')}
        </Typography>
      </Box>
      
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "0px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <SimpleTable
          data={rows}
          columns={searchColumns}
          onRowUpdate={handleRowUpdate}
          editable={false}
          searchable={true}
          sortable={true}
          pagination={true}
          resizable={true}
        />
      </Box>
    </Box>
  );
};

export default SearchWithSimpleTable; 