import { Box, Typography, useTheme } from "@mui/material";
import { useState, useCallback } from "react";
import SimpleTable from "../../components/SimpleTable";
import { searchColumns, TableRowData } from "../../config/simpleTableColumns";
import { t } from "i18next";
import { useClients } from "../../hooks/useClients";
import FSelect from "../../components/FSelect";
import FButton from "../../components/FButton/FButton";
import { searchTransactionsByClient, updateMultipleTransactions, updateTransaction } from "../../services/supabaseService";
import DownloadIcon from "@mui/icons-material/Download";
import { exportToCSV } from "../../utils/csvExport";

// Tipo para las transacciones de Supabase
interface SupabaseTransaction {
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
  check_number?: string;
  bank?: string;
  observations?: string;
}

const Search = () => {
  const theme = useTheme();
  const [rows, setRows] = useState<TableRowData[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRowUpdate = (newRow: TableRowData, oldRow: TableRowData) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === oldRow.id ? newRow : row))
    );
    console.log("Row updated:", { newRow, oldRow });
  };

  const handleCellUpdate = async (
    transactionId: string,
    columnName: string,
    newValue: string | number
  ) => {
    try {
      console.log("Updating cell:", { transactionId, columnName, newValue });
      await updateTransaction(transactionId, columnName, newValue);
      console.log("Cell updated successfully");
    } catch (error) {
      console.error("Error updating cell:", error);
      throw error;
    }
  };

  const handleRowDelete = async (transactionIds: string[]) => {
    try {
      // TODO: Implementar delete en Supabase
      console.log("Deleting transactions:", transactionIds);

      // Actualizar estado local
      setRows((prevRows) =>
        prevRows.filter((row) => !transactionIds.includes(row.transaction_id))
      );
    } catch (error) {
      console.error("Error deleting transactions:", error);
      alert(
        "Error al eliminar las transacciones. Por favor, intenta de nuevo."
      );
    }
  };

  const handleBulkUpdate = async (
    transactionIds: string[],
    updates: { [key: string]: string | number }
  ) => {
    try {
      console.log("Bulk updating transactions:", { transactionIds, updates });

      // Llamar a Supabase para actualizar las transacciones
      await updateMultipleTransactions(transactionIds, updates);

      // Actualizar estado local
      setRows((prevRows) =>
        prevRows.map((row) =>
          transactionIds.includes(row.transaction_id)
            ? { ...row, ...updates }
            : row
        )
      );

      console.log("Transacciones actualizadas exitosamente en bulk");
    } catch (error) {
      console.error("Error bulk updating transactions:", error);
      alert(
        "Error al actualizar las transacciones. Por favor, intenta de nuevo."
      );
    }
  };

  const { getClientsForSelector } = useClients();
  const [selectedClient, setSelectedClient] = useState("");
  console.log(selectedClient);

  // Función para generar y descargar CSV
  const downloadCSV = useCallback(() => {
    exportToCSV(rows, t);
  }, [rows, t]);

  const handleSearch = async () => {
    if (!selectedClient) {
      alert("Por favor selecciona un cliente");
      return;
    }

    setIsLoading(true);
    setShowTable(false);

    try {
      // Hardcodeamos client_id = 1 como solicitado
      const clientId = parseInt(selectedClient);

      // Buscar transacciones del cliente en Supabase
      const transactions = await searchTransactionsByClient(clientId);

      // Convertir los datos de Supabase al formato de TableRowData
      const formattedData: TableRowData[] = transactions.map(
        (transaction: SupabaseTransaction) => ({
          id: transaction.id,
          transaction_id: transaction.transaction_id,
          date: transaction.date,
          description: transaction.description,
          credit_amount: transaction.credit_amount,
          debit_amount: transaction.debit_amount,
          balance: transaction.balance,
          category: transaction.category,
          subcategory: transaction.subcategory,
          source: transaction.source,
          client_id: transaction.client_id,
          checkNumber: transaction.check_number || "",
          bank: transaction.bank || "",
          observations: transaction.observations || "",
        })
      );

      setRows(formattedData);
      setShowTable(true);
    } catch (error) {
      console.error("Error buscando transacciones:", error);
      alert("Error al buscar las transacciones. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
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
          display: "flex",
          alignItems: "center",
          gap: 2,
          justifyContent: "space-between",
        }}
      >
        <Typography
          component="h4"
          sx={{
            fontWeight: 600,
            color: "#333",
            fontSize: "1.5rem",
            margin: 0,
            marginBottom: "8px",
            marginRight: 3,
          }}
        >
          {t("searchClients")}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 16 }}>
          <FSelect
            label=""
            options={getClientsForSelector()}
            value={selectedClient}
            onChange={setSelectedClient}
            hideLabel={true}
            sx={{ marginTop: 0, width: 390 }}
            placeholder={t("step1.selectClient")}
          />
          <FButton
            variant="contained"
            onClick={handleSearch}
            disabled={!selectedClient}
            loading={isLoading}
            sx={{ ml: 2, height: 40 }}
            title={t("table.search")}
          />
        </Box>
      </Box>

      {showTable && (
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
            onCellUpdate={handleCellUpdate}
            onRowDelete={handleRowDelete}
            onBulkUpdate={handleBulkUpdate}
            editable={true}
            searchable={true}
            sortable={true}
            pagination={true}
            resizable={true}
            onDownloadCSV={downloadCSV}
          />
        </Box>
      )}
    </Box>
  );
};

export default Search;
