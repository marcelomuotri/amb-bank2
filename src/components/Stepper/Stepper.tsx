import { Box, Button, Typography } from '@mui/material'
import { useStyles } from './stepper.styles'
import FButton from '../FButton/FButton'
import DownloadIcon from "../../assets/DownloadIcon"
import { useTranslation } from 'react-i18next'

interface Step {
  label: string
}

interface StepperProps {
  activeStep: number
  onNextStep: () => void
  isStepperLoading: boolean
  stepperButtonDisabled: boolean
  currentStep?: string
  steps: Step[]
  buttonTitle: string
}

const Stepper = ({
  activeStep,
  onNextStep,
  isStepperLoading,
  stepperButtonDisabled,
  currentStep,
  steps,
  buttonTitle,
}: StepperProps) => {
  const { t } = useTranslation()
  const { classes: styles } = useStyles()

  return (
    <Box className={styles.stepperContainer}>
      <Button className={styles.cancelButton}></Button>
      <Box className={styles.stepper}>
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < activeStep
          const isCurrent = stepNumber === activeStep
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
        endIcon={activeStep === 2 ? <DownloadIcon /> : undefined}
        disabled={stepperButtonDisabled}
        onClick={onNextStep}
        title={buttonTitle}
        loading={isStepperLoading}
        size={'small'}
        textClassName={styles.continueButton}
      />
    </Box>
  )
}

export default Stepper
