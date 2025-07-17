import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material'

// Función helper para generar color disabled basado en el primary
const getDisabledColor = (primaryColor: string) => {
  // Convertir hex a RGB y aplicar transparencia
  const hex = primaryColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, 0.5)`; // Más visible que 0.4
};

// Función helper para generar background disabled más claro
const getDisabledBackground = (primaryColor: string) => {
  const hex = primaryColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, 0.08)`; // Más sutil para el background
};

export const useStyles = makeStyles()((theme: Theme) => ({
  button: {
    padding: '12px 20px',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid transparent',
    borderRadius: theme.shape.borderRadius,
    color: 'white',
    backgroundColor: theme.palette.primary.main,
    //fontWeight: 700,
    ':hover': {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.main,
    },
    '&.MuiButton-outlined': {
      borderColor: theme.palette.primary.main,
      borderWidth: 1,
      backgroundColor: 'transparent',
      color: theme.palette.primary.main,
      ':hover': {
        backgroundColor: 'rgba(25, 118, 210, 0.04)',
        borderColor: theme.palette.primary.main,
      },
    },
    '&.MuiButton-sizeSmall': {
      padding: '8px 24px',
    },
    '&.MuiButton-sizeMedium': {
      paddingLeft: 48,
      paddingRight: 48,
    },
    // Estilos para estado disabled
    '&.Mui-disabled': {
      color: getDisabledColor(theme.palette.primary.main) + '!important',
      backgroundColor: getDisabledBackground(theme.palette.primary.main) + '!important',
      borderColor: getDisabledColor(theme.palette.primary.main) + '!important',
      cursor: 'not-allowed!important',
      opacity: '1 !important', // Evitar la opacidad por defecto de MUI
    },
  },
  title: {
    fontWeight: 600,
    lineHeight: '14px',
    color: 'white',
    '.MuiButton-outlined &': {
      color: 'inherit',
    },
    // Estilos para texto disabled
    '.Mui-disabled &': {
      color: getDisabledColor(theme.palette.primary.main) + '!important',
    },
  },
  disabled: {
    color: getDisabledColor(theme.palette.primary.main) + '!important',
    backgroundColor: getDisabledBackground(theme.palette.primary.main) + '!important',
    borderColor: getDisabledColor(theme.palette.primary.main) + '!important',
    cursor: 'not-allowed!important',
  },
}))
