import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material'

export const useStyles = makeStyles()((theme: Theme) => ({
  stepperContainer: {
    padding: 16,
    background: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    //borderRadius: '8px',
    alignItems: 'center',
    marginBottom: 24,
  },
  cancelButton: {
    fontSize: '12px',
    padding: '8px 16px',
    color: '#6F757B',
    lineHeight: '12px',
    fontWeight: 600,
  },
  stepper: {
    display: 'flex',
    alignSelf: 'end',
    gap: 16,
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    color: '#9CA3AF', // Color gris para steps inactivos
    transition: 'color 0.6s ease-in-out',
  },
  active: {
    color: theme.palette.primary.main,
  },
  stepText: {
    fontSize: '12px',
    lineHeight: '16px',
  },
  stepConnector: {
    width: 81,
    height: 8,
    borderRadius: 12,
    backgroundColor: '#E5E7EB', // Color gris para connectors inactivos
  },
  activeConnector: {
    backgroundColor: theme.palette.primary.main, // Color cuando está activo
  },
  continueButton: {
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: 600,
  },
}))
