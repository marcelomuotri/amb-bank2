import { Box } from "@mui/material";
import Stepper from "../../components/Stepper/Stepper";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Step2 from "./Step2";
import Step1 from "./Step1";
import {
  startBatchPolling,
  uploadFilesToWebhook,
} from "../../services/supabaseService";
import { useBanks } from "../../hooks/useBanks";

const Home = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(1);
  const [batchResult, setBatchResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [fileItems, setFileItems] = useState<any[]>([]);

  const steps = [{ label: t("upload") }, { label: t("clasify") }];

  const { banks, loading: banksLoading, error: banksError } = useBanks();

  const handleNextStep = async () => {
    if (activeStep === 1) {
      // Validar
      if (!selectedClient || !selectedBank || fileItems.length === 0) {
        alert("Por favor completa todos los campos y sube al menos un archivo");
        return;
      }

      // Ir directamente al Step2
      setActiveStep(activeStep + 1);
      setIsProcessing(true);

      try {
        // 1. Subir archivos al webhook
        const files = fileItems.map((item) => item.file);
        const bankName = selectedBank;
        const batchId = await uploadFilesToWebhook(
          files,
          selectedClient,
          bankName
        );
        if (!batchId) {
          setIsProcessing(false);
          return;
        }

        // 2. Iniciar polling usando el servicio
        startBatchPolling(
          batchId,
          () => {
            // Los mensajes de progreso se manejarán en Step2 si es necesario
          },
          (result: any) => {
            // Agregar warning hardcodeado para prueba
            const resultWithWarning = {
              ...result,
              warning: [
                {
                  fileName: "archivo1.pdf",
                  transactionId: "TXN001",
                  description: "Revisar detalles"
                },
                {
                  fileName: "archivo2.xlsx",
                  transactionId: "TXN002", 
                  description: "Revisar valor de la columna credito"
                },
                {
                  fileName: "archivo3.csv",
                  transactionId: "TXN003",
                  description: "Revisar fecha"
                },
                {
                  fileName: "archivo3.csv",
                  transactionId: "TXN004",
                  description: "Formato de archivo no reconocido"
                },
                {
                  fileName: "archivo5.xls",
                  transactionId: "TXN005",
                  description: "Monto negativo detectado"
                },
              ]
            };
            setBatchResult(resultWithWarning);
            setIsProcessing(false);
          },
          () => {
            setIsProcessing(false);
          },
          () => {
            setIsProcessing(false);
          }
        );
      } catch (error) {
        setIsProcessing(false);
      }
    } else if (activeStep === 2) {
      // En el paso 2, el botón "Continue and Download" debería descargar el archivo
      // Por ahora, solo mostramos un mensaje o podemos implementar la descarga
      console.log("Descargando archivo...");
      // Aquí puedes implementar la lógica de descarga
      // Por ejemplo: downloadFile(batchResult);
    }
  };
  console.log("batchResult", batchResult);

  return (
    <Box>
              <Stepper 
          activeStep={activeStep} 
          onNextStep={handleNextStep} 
          isStepperLoading={false} 
          stepperButtonDisabled={
            (activeStep === 1 && (!selectedClient || !selectedBank || fileItems.length === 0)) ||
            (activeStep === 2 && isProcessing)
          }
          currentStep={activeStep === 2 ? "step2" : undefined}
          steps={steps}
          buttonTitle={activeStep === 2 ? t("stepper.continueAndDownload") : t("stepper.continue")}
        />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {activeStep === 1 && (
          <Box>
            <Step1
              selectedClient={selectedClient}
              setSelectedClient={setSelectedClient}
              selectedBank={selectedBank}
              setSelectedBank={setSelectedBank}
              fileItems={fileItems}
              setFileItems={setFileItems}
              banks={banks}
              banksLoading={banksLoading}
              banksError={banksError}
            />
          </Box>
        )}
        {activeStep === 2 && (
          <Box>
            <Step2
              batchResult={batchResult}
              isProcessing={isProcessing}
              banks={banks}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Home;
