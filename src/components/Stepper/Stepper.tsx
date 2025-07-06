import { Box, Button, Typography } from '@mui/material'
import { useStyles } from './stepper.styles'
import FButton from '../FButton/FButton'
import DownloadIcon from "../../assets/DownloadIcon"

interface StepperProps {
  activeStep: number
  onNextStep: () => void
  isStepperLoading: boolean
  stepperButtonDisabled: boolean
}

const Stepper = ({
  activeStep,
  onNextStep,
  isStepperLoading,
  stepperButtonDisabled,
}: StepperProps) => {
  const { classes: styles } = useStyles()

  const steps = [
    { label: "Subida" },
    { label: "Clasificación" },
    { label: "Descarga" },
  ]

  return (
    <Box className={styles.stepperContainer}>
      <Button className={styles.cancelButton}></Button>
      <Box className={styles.stepper}>
        {steps.map((step, index) => {
          const isCompleted = index + 1 < activeStep
          const isCurrent = index + 1 === activeStep
          const isActiveOrCompleted = isCompleted || isCurrent
          return (
            <Box
              key={step.label}
              className={`${styles.step} ${isActiveOrCompleted ? styles.active : ''}`}
            >
              <Box
                className={`${styles.stepConnector} ${isActiveOrCompleted ? styles.activeConnector : ''
                  }`}
              />
              <Typography className={styles.stepText}>{step.label}</Typography>
            </Box>
          )
        })}
      </Box>
      <FButton
        endIcon={activeStep === 4 && <DownloadIcon />}
        disabled={stepperButtonDisabled}
        onClick={onNextStep}
        title={activeStep === 4 ? "Descargar" : "Continuar"}
        loading={isStepperLoading}
        size={'small'}
        textClassName={styles.continueButton}
      />
    </Box>
  )
}

export default Stepper
