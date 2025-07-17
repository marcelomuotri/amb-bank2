import { Box, Button, Typography } from '@mui/material'
import { useStyles } from './stepper.styles'
import FButton from '../FButton/FButton'
import DownloadIcon from "../../assets/DownloadIcon"
import { useTranslation } from 'react-i18next'

interface StepperProps {
  activeStep: number
  onNextStep: () => void
  isStepperLoading: boolean
  stepperButtonDisabled: boolean
  currentStep?: string
}

const Stepper = ({
  activeStep,
  onNextStep,
  isStepperLoading,
  stepperButtonDisabled,
  currentStep,
}: StepperProps) => {
  const { t } = useTranslation()
  const { classes: styles } = useStyles()

  const steps = [
    { label: t('upload') },
    { label: t('clasify') },
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
        endIcon={activeStep === 3 ? <DownloadIcon /> : undefined}
        disabled={stepperButtonDisabled}
        onClick={onNextStep}
        title={
          activeStep === 3 
            ? t('stepper.download') 
            : currentStep === 'step2' 
              ? t('stepper.continueAndDownload')
              : t('stepper.continue')
        }
        loading={isStepperLoading}
        size={'small'}
        textClassName={styles.continueButton}
      />
    </Box>
  )
}

export default Stepper
