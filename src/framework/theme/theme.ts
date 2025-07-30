import { typographys } from './typography'
import type { Breakpoint } from '@mui/material'

export const theme = {
  palette: {
    primary: {
      main: '#009B57',
      light: '#D8E8EB',
    },
    secondary: {
      main: '#dde0fb',
      light: '#D8E8EB',
    },
    text: {
      primary: '#374151',
      secondary: '#074A56',
      input: '#495057',
    },
    action: {
      active: '#F7F7F7',
      hover: '#F7F7F7',
      disabled: '#FFF6F4',
      disabledBackground: '#C0A7A1',
      focus: '#024675',
    },
    background: {
      paper: '#F8F9FA',
      default: '#F8F9FA',
    },
    error: {
      main: '#D65B5B',
    },
    success: {
      main: '#12B76A',
    },
    warning: {
      main: '#F79008',
    },
    info: {
      main: '#1C7ED6',
    },
    common: {
      greyE6: '#ADB5BD',
      greyE7: '#757575',
      black: '#000',
      white: '#FFF',
      transparent: 'transparent',
      grey: '#7D7D7D',
      green: '#009B57',
      orange: '#F05050',
      blue: '#D2E0E9',
      icons: '#868E96',
    },
    divider: '#DEE2E6',
  },
  breakpoints: {
    keys: ['sm', 'md', 'lg'] as Breakpoint[],
    values: {
      sm: 600,
      md: 900,
      lg: 1320,
    },
  },
  zIndex: {
    header: 99,
  },
  typography: typographys,
  spacing: 1,
  shape: {
    borderRadius: "8px",
  },
}
