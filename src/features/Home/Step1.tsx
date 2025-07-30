import { Box, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useClients } from "../../hooks/useClients";
import FSelect from "../../components/FSelect";
import FileUpload from "../../components/FileUpload";
import SummaryItem from "../../components/SummaryItem/SummaryItem";
import LoadingFade from "../../components/LoadingFade";
import { Bank } from "../../types/supabaseTypes";

interface FileItem {
  id: string;
  file: File;
  bankName: string;
  fileName: string;
}

interface Step1Props {
  selectedClient: string | null;
  setSelectedClient: (v: string) => void;
  selectedBank: string | null;
  setSelectedBank: (v: string) => void;
  fileItems: FileItem[];
  setFileItems: (v: FileItem[]) => void;
  banks: Bank[];
  banksLoading: boolean;
  banksError: Error | null;
}

const Step1 = ({
  selectedClient,
  setSelectedClient,
  selectedBank,
  setSelectedBank,
  fileItems,
  setFileItems,
  banks,
  banksLoading,
  banksError,
}: Step1Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    loading: clientsLoading,
    error: clientsError,
    getClientsForSelector,
  } = useClients();

  const handleClientChange = (value: string) => {
    setSelectedClient(value);
  };

  const handleBankChange = (value: string) => {
    setSelectedBank(value);
  };

  const handleFileSelect = (files: File[]) => {
    if (!selectedBank) {
      alert(t("step1.selectBankFirst"));
      return;
    }
    // Buscar el banco por id (selectedBank)
    const selectedBankData = banks.find((bank) => bank.value === selectedBank);
    const bankName = selectedBankData ? selectedBankData.label : selectedBank;
    // Formatear el nombre del archivo como 'Banco - NombreOriginal.extensión'
    const newFileItems = files.map((file) => {
      const fileExtension = file.name.split(".").pop();
      const fileNameWithoutExtension = file.name.replace(
        `.${fileExtension}`,
        ""
      );
      const finalFileName = `${bankName} - ${fileNameWithoutExtension}.${fileExtension}`;
      console.log("Archivo a enviar:", finalFileName, "Banco:", bankName);
      return {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
        bankName: bankName,
        fileName: finalFileName,
      };
    });
    setFileItems([...fileItems, ...newFileItems]);
  };

  const handleDeleteFile = (fileId: string) => {
    setFileItems(fileItems.filter((item) => item.id !== fileId));
  };

  // Validar y notificar al componente padre (opcional, si se requiere)
  useEffect(() => {
    // No hay validación de campos obligatorios en este paso,
    // ya que el usuario debe seleccionar un cliente y un banco.
    // Si se necesita una validación más robusta, se puede implementar aquí.
  }, [selectedClient, selectedBank, fileItems.length]);

  // useClients hook maneja el fetch de clientes

  return (
    <Box
      sx={{
        backgroundColor: "white",
        padding: "24px",
        display: "flex",
        gap: 50,
        height: "100%",
        borderRadius: theme.shape.borderRadius,
      }}
    >
      {/* Left column - 50% width */}
      <Box
        sx={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          gap: 48,
        }}
      >
        <Box>
          <Typography
            component="h1"
            sx={{ fontSize: 24, fontWeight: 700, mb: 10 }}
          >
            {t("step1.selectClient")}
          </Typography>
          <Typography sx={{ fontSize: 16, color: "#6B7280", mb: 20 }}>
            {t("step1.chooseClientSubtitle")}
          </Typography>
          <LoadingFade loading={clientsLoading}>
            {clientsError ? (
              <Typography sx={{ fontSize: 16, color: "red" }}>
                Error cargando clientes
              </Typography>
            ) : (
              <FSelect
                options={getClientsForSelector()}
                label="step1.client"
                onChange={handleClientChange}
                placeholder={t("step1.selectClient")}
              />
            )}
          </LoadingFade>
        </Box>

        {/* Bank selector and upload area - Only show when client is selected */}
        {selectedClient && (
          <Box>
            <Typography
              component="h1"
              sx={{ fontSize: 24, fontWeight: 700, mb: 10 }}
            >
              {t("step1.uploadBankStatement")}
            </Typography>
            <Typography sx={{ fontSize: 16, color: "#6B7280", mb: 20 }}>
              {t("step1.chooseBankSubtitle")}
            </Typography>
            <LoadingFade loading={banksLoading}>
              {banksError ? (
                <Typography sx={{ fontSize: 16, color: "red" }}>
                  Error cargando bancos
                </Typography>
              ) : (
                <FSelect
                  options={banks}
                  label="step1.bank"
                  onChange={handleBankChange}
                  placeholder={t("step1.selectBank")}
                />
              )}
            </LoadingFade>

            {/* File upload area - Always visible when bank is selected */}
            {selectedBank && (
              <Box sx={{ mt: 20 }}>
                <FileUpload onFileSelect={handleFileSelect} />

                {/* Progress indicator */}
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Right column - Summary (50%) - Only show when client is selected */}
      {selectedClient ? (
        <Box sx={{ flex: "1", display: "flex", flexDirection: "column" }}>
          <Typography
            component="h2"
            sx={{ fontSize: 20, fontWeight: 700, mb: 20 }}
          >
            {t("step1.summary")} ({fileItems.length})
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              maxHeight: "calc(100vh - 200px)",
              overflowY: "auto",
            }}
          >
            {fileItems.length === 0 ? (
              <Typography sx={{ color: "#666", fontStyle: "italic" }}>
                {t("step1.noFilesUploaded")}
              </Typography>
            ) : (
              fileItems.map((item) => (
                <SummaryItem
                  key={item.id}
                  bankName={item.bankName}
                  fileName={item.fileName}
                  onDelete={() => handleDeleteFile(item.id)}
                  sx={{ width: 400 }}
                />
              ))
            )}
          </Box>
        </Box>
      ) : (
        /* Invisible placeholder to maintain 50% width for left column */
        <Box sx={{ flex: "1" }} />
      )}
    </Box>
  );
};

export default Step1;

// ... banks array eliminado, ahora se usa el hook useBanks
