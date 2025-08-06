import { Box, CircularProgress, useTheme } from "@mui/material";
import { useState, useCallback } from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import SimpleTable from "../../components/SimpleTable";
import { step2Columns, TableRowData } from "../../config/simpleTableColumns";
import React from "react";
import { Bank } from "../../types/supabaseTypes";
import {
  updateTransaction,
  deleteMultipleTransactions,
  updateMultipleTransactions,
  WebhookBatchResponse,
} from "../../services/supabaseService";
import { exportToCSV } from "../../utils/csvExport";

interface Step2Props {
  batchResult: WebhookBatchResponse | null;
  isProcessing: boolean;
  banks: Bank[];
  onDownloadCSV?: (downloadFn: () => void) => void;
}

const Step2 = ({ batchResult, isProcessing, banks, onDownloadCSV }: Step2Props) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [rows, setRows] = useState<TableRowData[]>([]);
  console.log("batchResult", batchResult);

  // Función para generar y descargar CSV
  const downloadCSV = useCallback(() => {
    exportToCSV(rows, t);
  }, [rows, t]);

  // Exponer la función de descarga al componente padre
  React.useEffect(() => {
    if (onDownloadCSV) {
      // Pasar la función de descarga al callback
      onDownloadCSV(downloadCSV);
    }
  }, [onDownloadCSV, downloadCSV]);

  // Actualizar filas cuando llega el resultado del batch
  React.useEffect(() => {
    if (
      batchResult &&
      batchResult.status === "success" &&
      Array.isArray(batchResult.data)
    ) {
      // Agregar el campo id que necesita la tabla
      const dataWithId = batchResult.data.map((item, index) => ({
        ...item,
        id: index + 1,
        checkNumber: "", // Campo opcional para la UI
        bank: item.source || "", // Mapear source a bank
        observations: "", // Campo opcional para la UI
        selected: false, // Campo para el estado de selección
      }));
      setRows(dataWithId);
    }
  }, [batchResult]);

  const handleRowUpdate = (newRow: TableRowData) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === newRow.id ? newRow : row))
    );
  };

  const handleCellUpdate = async (
    transactionId: string,
    columnName: string,
    newValue: string | number
  ) => {
    try {
      console.log("transactionId", transactionId);
      await updateTransaction(transactionId, columnName, newValue);
    } catch (error) {
      console.error("Error actualizando transacción:", error);
      throw error;
    }
  };

  const handleRowDelete = async (transactionIds: string[]) => {
    try {
      console.log("Eliminando transacciones:", transactionIds);
      await deleteMultipleTransactions(transactionIds);

      // Actualizar el estado local removiendo las filas eliminadas
      setRows((prevRows) =>
        prevRows.filter((row) => !transactionIds.includes(row.transaction_id))
      );

      console.log("Transacciones eliminadas exitosamente");
    } catch (error) {
      console.error("Error eliminando transacciones:", error);
      throw error;
    }
  };

  const handleBulkUpdate = async (
    transactionIds: string[],
    updates: { [key: string]: string | number }
  ) => {
    try {
      console.log("Actualizando transacciones en bulk:", {
        transactionIds,
        updates,
      });
      await updateMultipleTransactions(transactionIds, updates);

      // Actualizar el estado local con los cambios
      setRows((prevRows) =>
        prevRows.map((row) => {
          if (transactionIds.includes(row.transaction_id)) {
            return { ...row, ...updates };
          }
          return row;
        })
      );

      console.log("Transacciones actualizadas exitosamente en bulk");
    } catch (error) {
      console.error("Error actualizando transacciones en bulk:", error);
      throw error;
    }
  };

  if (isProcessing) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "70vh",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: theme.shape.borderRadius,
        }}
      >
        <CircularProgress />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "40%",
            flexDirection: "column",
            maxWidth: 436,
          }}
        >
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 600,
              lineHeight: "26px",
            }}
          >
            Estamos procesando tus datos...
          </Typography>
          <Typography
            sx={{
              lineHeight: "22px",
              marginBottom: 16,
              color: "#7C7C7C",
              marginTop: 8,
            }}
          >
            Podría demorar hasta 5 minutos.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: "white", 
      borderRadius: theme.shape.borderRadius,
      overflow: "hidden"
    }}>
      <SimpleTable
        data={rows}
        columns={step2Columns}
        onRowUpdate={handleRowUpdate}
        onCellUpdate={handleCellUpdate}
        onRowDelete={handleRowDelete}
        onBulkUpdate={handleBulkUpdate}
        editable={true}
        searchable={true}
        sortable={true}
        pagination={true}
        resizable={true}
        banks={banks}
        showPendingReview={true}
        batchResult={batchResult}
      />
    </Box>
  );
};

export default Step2;
