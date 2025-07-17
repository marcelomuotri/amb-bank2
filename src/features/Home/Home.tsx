import { Box, Typography } from "@mui/material"
import Stepper from "../../components/Stepper/Stepper"
import { useState, useRef } from "react"
import Step2 from "./Step2"
import Step1, { Step1Ref } from "./Step1"

const Home = () => {
  const [activeStep, setActiveStep] = useState(1)
  const step1Ref = useRef<Step1Ref>(null)
  
  const handleNextStep = async () => {
    // Simplemente pasar al siguiente paso sin procesar archivos
    setActiveStep(activeStep + 1)
  }
  
  return (
    <Box>
        
        <Stepper 
          activeStep={activeStep} 
          onNextStep={handleNextStep} 
          isStepperLoading={false} 
          stepperButtonDisabled={false}
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