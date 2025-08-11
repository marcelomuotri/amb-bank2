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
import { useDashboard } from "../../contexts/DashboardContext";

const Home = () => {
  const { t } = useTranslation();
  const { updateUsedFiles } = useDashboard();
  const [activeStep, setActiveStep] = useState(1);
  const [batchResult, setBatchResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [fileItems, setFileItems] = useState<any[]>([]);
  const [downloadCSVFunction, setDownloadCSVFunction] = useState<(() => void) | null>(null);

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
        
        // Obtener el nombre del banco desde fileItems (ya tiene el nombre correcto)
        const bankName = fileItems.length > 0 ? fileItems[0].bankName : selectedBank;
        
        console.log('Enviando archivos con banco:', bankName);
        
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
            // Usar los warnings reales que vienen del backend
            setBatchResult(result);
            setIsProcessing(false);
            
            // Actualizar el contador de archivos usados
            updateUsedFiles(fileItems.length);
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
      // En el paso 2, el botón "Continue and Download" descarga el CSV y se queda en el step
      console.log("Descargando CSV...");
      // Llamar a la función de descarga
      if (downloadCSVFunction) {
        downloadCSVFunction();
      }
      // No avanzar al siguiente paso, quedarse en Step2
      return;
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
          buttonTitle={activeStep === 2 ? t("stepper.download") : t("stepper.continue")}
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
              onDownloadCSV={(downloadFn) => {
                setDownloadCSVFunction(() => downloadFn);
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Home;
