import { Box, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import SimpleTable from "../../components/SimpleTable";
import { searchColumns, TableRowData } from "../../config/simpleTableColumns";

const rowsData: TableRowData[] = [
  { 
    id: 1, 
    transaction_id: "5d29bed8",
    date: '2024-01-01', 
    description: 'Western Funding Payables 122923 F_WFI1069038', 
    credit_amount: 2380.48, 
    debit_amount: null, 
    balance: null, 
    category: 'Sales', 
    subcategory: 'Income', 
    source: '1',
    client_id: 1,
    checkNumber: '', 
    bank: 'Wells Fargo', 
    observations: '',
    selected: false
  },
  { 
    id: 2, 
    transaction_id: "fd5434a4",
    date: '2024-01-02', 
    description: 'Purchase authorized on 12/29 Wesco Insurance CO 012-345-6789 PA S583363650522916 Card 7995', 
    credit_amount: null, 
    debit_amount: 3905.20, 
    balance: null, 
    category: 'Insurance Expense', 
    subcategory: 'Expense', 
    source: '1',
    client_id: 2,
    checkNumber: '', 
    bank: 'Wells Fargo', 
    observations: '',
    selected: false
  },
  { 
    id: 3, 
    transaction_id: "5c797129",
    date: '2024-01-03', 
    description: 'Purchase authorized on 12/29 Wesco Insurance CO 012-345-6789 PA S583363650537856 Card 7995', 
    credit_amount: null, 
    debit_amount: 1380.00, 
    balance: null, 
    category: 'Insurance Expense', 
    subcategory: 'Expense', 
    source: '1',
    client_id: 3,
    checkNumber: '', 
    bank: 'Wells Fargo', 
    observations: '',
    selected: false
  },
  { 
    id: 4, 
    transaction_id: "6d888f4e",
    date: '2024-01-04', 
    description: 'Deposited OR Cashed Check', 
    credit_amount: null, 
    debit_amount: 875.00, 
    balance: null, 
    category: 'Sales Commissions', 
    subcategory: 'Cost of Goods Sold', 
    source: '1',
    client_id: 1,
    checkNumber: '1178', 
    bank: 'Wells Fargo', 
    observations: '',
    selected: false
  },
  { 
    id: 5, 
    transaction_id: "c3ef97a3",
    date: '2024-01-05', 
    description: '01/02Bankcard Deposit -0328121737', 
    credit_amount: null, 
    debit_amount: 855.51, 
    balance: null, 
    category: 'Office Supplies', 
    subcategory: 'Expense', 
    source: '1',
    client_id: 2,
    checkNumber: '', 
    bank: 'Wells Fargo', 
    observations: '',
    selected: false
  },
  { 
    id: 6, 
    transaction_id: "b9b5fc77",
    date: '2024-01-06', 
    description: 'Purchase authorized on 12/30 Fedex595938084 800-4633339 TN S383364482441490 Card 5347', 
    credit_amount: null, 
    debit_amount: 66.36, 
    balance: null, 
    category: 'Shipping', 
    subcategory: 'Cost of Goods Sold', 
    source: '1',
    client_id: 3,
    checkNumber: '', 
    bank: 'Wells Fargo', 
    observations: '',
    selected: false
  },
];

const SearchWithSimpleTable = () => {
  const { t } = useTranslation();
  const theme = useTheme();
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
          borderRadius: theme.shape.borderRadius,
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
          borderRadius: theme.shape.borderRadius,
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