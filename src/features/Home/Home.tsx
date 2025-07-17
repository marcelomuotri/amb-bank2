import { Box, Typography } from "@mui/material"
import Stepper from "../../components/Stepper/Stepper"
import { useState, useRef } from "react"
import Step2 from "./Step2"
import Step1, { Step1Ref } from "./Step1"

const Home = () => {
  const [activeStep, setActiveStep] = useState(1)
  const [step1Valid, setStep1Valid] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const step1Ref = useRef<Step1Ref>(null)
  
  const handleNextStep = async () => {
    if (activeStep === 1) {
      // En el Step1, procesar archivos antes de continuar
      setIsProcessing(true)
      try {
        const success = await step1Ref.current?.processFiles()
        if (success) {
          setActiveStep(activeStep + 1)
        }
      } catch (error) {
        console.error('Error procesando archivos:', error)
      } finally {
        setIsProcessing(false)
      }
    } else {
      // Para otros pasos, simplemente continuar
      setActiveStep(activeStep + 1)
    }
  }
  
  return (
    <Box>
        
        <Stepper 
          activeStep={activeStep} 
          onNextStep={handleNextStep} 
          isStepperLoading={isProcessing} 
          stepperButtonDisabled={activeStep === 1 && !step1Valid}
          currentStep={activeStep === 2 ? 'step2' : undefined}
        />
        
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}>
          {activeStep === 1 && (
            <Box>
                <Step1 
                  ref={step1Ref}
                  onValidationChange={setStep1Valid} 
                  onBatchComplete={(batchId) => {
                    console.log('Batch completado:', batchId);
                    // Aquí puedes agregar lógica adicional cuando se complete el batch
                  }}
                />
            </Box>
          )}
          {activeStep === 2 && (
            <Box>
              <Step2 />
            </Box>
          )}
          {activeStep === 3 && (
            <Box>
              <Typography>
                Descargar archivo
              </Typography>
            </Box>
          )}
        </Box>
    </Box>
  )
}

export default Home