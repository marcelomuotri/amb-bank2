import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import FSelect from "../../components/FSelect";
import FileUpload from "../../components/FileUpload";
import SummaryItem from "../../components/SummaryItem/SummaryItem";
import { 
  uploadFilesToWebhook, 
  startBatchPolling 
} from "../../services/supabaseService";

interface FileItem {
  id: string;
  file: File;
  bankName: string;
  fileName: string;
}

interface Step1Props {
  onValidationChange?: (isValid: boolean) => void;
  onBatchComplete?: (batchId: string) => void;
}

export interface Step1Ref {
  processFiles: () => Promise<boolean>;
}

const Step1 = forwardRef<Step1Ref, Step1Props>(({ onValidationChange, onBatchComplete }, ref) => {
  const { t } = useTranslation();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  
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

    const bankOption = banks.find(bank => bank.value === selectedBank);
    const bankName = bankOption ? bankOption.label : selectedBank;
    
    const newFileItems: FileItem[] = files.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      bankName,
      fileName: file.name
    }));

    setFileItems(prev => [...prev, ...newFileItems]);
  };

  const handleDeleteFile = (fileId: string) => {
    setFileItems(prev => prev.filter(item => item.id !== fileId));
  };

  // Función para manejar el proceso completo
  const handleProcessFiles = async (): Promise<boolean> => {
    if (!selectedClient || !selectedBank || fileItems.length === 0) {
      alert('Por favor completa todos los campos y sube al menos un archivo');
      return false;
    }

    setUploadProgress('Iniciando proceso...');

    try {
      // 1. Subir archivos al webhook
      const files = fileItems.map(item => item.file);
      console.log('Archivos a subir:', files.length);
      console.log('Cliente seleccionado:', selectedClient);
      
      // Obtener nombre del banco seleccionado
      const bankOption = banks.find(bank => bank.value === selectedBank);
      const bankName = bankOption ? bankOption.label : selectedBank;
      console.log('Banco seleccionado:', bankName);
      
      const batchId = await uploadFilesToWebhook(files, selectedClient, bankName);
      console.log('batchId recibido:', batchId);
      console.log('Tipo de batchId:', typeof batchId);
      
      if (!batchId) {
        setUploadProgress('Error al subir archivos');
        return false;
      }

      setUploadProgress('Archivos subidos. Procesando...');

      // 2. Iniciar polling usando el servicio
      startBatchPolling(
        batchId,
        // onProgress
        (message: string) => {
          setUploadProgress(message);
        },
        // onComplete
        (completedBatchId: string) => {
          setUploadProgress('¡Proceso completado!');
          onBatchComplete?.(completedBatchId);
        },
        // onError
        (error: string) => {
          setUploadProgress(`Error: ${error}`);
        },
        // onTimeout
        () => {
          setUploadProgress('Timeout: El proceso tardó demasiado');
        }
      );

      return true; // Proceso iniciado correctamente

    } catch (error) {
      console.error('Error en el proceso:', error);
      setUploadProgress('Error en el proceso: ' + error);
      return false;
    }
  };

  // Exponer función de procesar al componente padre
  useImperativeHandle(ref, () => ({
    processFiles: handleProcessFiles
  }));

  // Validar y notificar al componente padre
  useEffect(() => {
    const isValid = selectedClient !== null && selectedBank !== null && fileItems.length > 0;
    onValidationChange?.(isValid);
  }, [selectedClient, selectedBank, fileItems.length, onValidationChange]);

  return (
    <Box
      sx={{
        backgroundColor: "white",
        padding: "24px",
        display: "flex",
        gap: 50,
        height: "100%",
      }}
    >
      {/* Left column - Always 2/3 width */}
      <Box sx={{ 
        flex: "2", 
        display: "flex", 
        flexDirection: "column", 
        gap: 20,
      }}>
        <Box>
          <Typography sx={{ fontSize: 24, fontWeight: 700, mb: 10 }}>
            {t("step1.selectClient")}
          </Typography>
          <FSelect 
            options={clients} 
            label="step1.client" 
            onChange={handleClientChange}
          />
        </Box>
        
        {/* Bank selector and upload area - Only show when client is selected */}
        {selectedClient && (
          <Box>
            <Typography sx={{ fontSize: 24, fontWeight: 700, mb: 10 }}>
              {t("step1.uploadBankStatement")}
            </Typography>
            <FSelect 
              options={banks} 
              label="step1.bank" 
              onChange={handleBankChange}
            />
            
            {/* File upload area - Always visible when bank is selected */}
            {selectedBank && (
              <Box sx={{ mt: 20 }}>
                <FileUpload onFileSelect={handleFileSelect} />
                
                {/* Progress indicator */}
                {uploadProgress && (
                  <Typography sx={{ mt: 10, color: '#666', fontSize: '14px' }}>
                    {uploadProgress}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Right column - Summary (1/3) - Only show when client is selected */}
      {selectedClient ? (
        <Box sx={{ flex: "1", display: "flex", flexDirection: "column" }}>
          <Typography sx={{ fontSize: 20, fontWeight: 700, mb: 20 }}>
            {t("step1.summary")} ({fileItems.length})
          </Typography>
          <Box sx={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: 10,
            maxHeight: "calc(100vh - 200px)",
            overflowY: "auto"
          }}>
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
                />
              ))
            )}
          </Box>
        </Box>
      ) : (
        /* Invisible placeholder to maintain 2/3 width for left column */
        <Box sx={{ flex: "1" }} />
      )}
    </Box>
  );
});

export default Step1;

const clients = [
  { label: "Cliente 1", value: "1" },
  { label: "Cliente 2", value: "2" },
  { label: "Cliente 3", value: "3" },
  { label: "Cliente 4", value: "4" },
  { label: "Cliente 5", value: "5" },
  { label: "Cliente 6", value: "6" },
  { label: "Cliente 7", value: "7" },
  { label: "Cliente 8", value: "8" },
  { label: "Cliente 9", value: "9" },
  { label: "Cliente 10", value: "10" },
];

const banks = [
  { label: "Banco Santander", value: "1" },
  { label: "Banco BBVA", value: "2" },
  { label: "Banco de Chile", value: "3" },
  { label: "Banco Estado", value: "4" },
  { label: "Banco BCI", value: "5" },
  { label: "Chase Bank", value: "6" },
];
