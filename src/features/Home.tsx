import { Box, Typography } from "@mui/material"
import Stepper from "../components/Stepper/Stepper"

const Home = () => {
  return (
    <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            backgroundColor: 'white',
            borderBottom: '1px solid #DEE2E6',
            marginBottom: '24px',
          }}
        >
          <Box>
            <Typography >
              Logo de la empresa
            </Typography>
          </Box>
          
            <Box
              sx={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#231F20',
              }}
            >
              Usuario
            </Box>
        </Box>
        <Stepper activeStep={3} onNextStep={() => {}} isStepperLoading={false} stepperButtonDisabled={false} />
    </Box>
  )
}

export default Home