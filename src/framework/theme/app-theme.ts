import { createTheme } from '@mui/material/styles'
import { theme } from './theme'
import { appTypographys } from './app-typography'
import { appComponents } from './app-components'
import '@fontsource/inter'

const appTheme = createTheme({
  palette: {
    primary: {
      main: theme.palette.primary.main,
      light: theme.palette.primary.light,
    },
    secondary: {
      main: theme.palette.secondary.main,
      light: theme.palette.secondary.light,
    },
    text: {
      primary: theme.palette.text.primary,
      secondary: theme.palette.text.secondary,
      input: theme.palette.text.input,
    },
    action: {
      active: theme.palette.action.active,
      hover: theme.palette.action.hover,
      disabled: theme.palette.action.disabled,
      disabledBorder: theme.palette.action.disabledBorder,
    },
    background: {
      paper: theme.palette.background.paper,
      default: theme.palette.background.default,
    },
    error: {
      main: theme.palette.error.main,
    },
    success: {
      main: theme.palette.success.main,
    },
    warning: {
      main: theme.palette.warning.main,
    },
    info: {
      main: theme.palette.info.main,
    },
    common: {
      black: theme.palette.common.black,
      white: theme.palette.common.white,
      transparent: theme.palette.common.transparent,
      grey: theme.palette.common.grey,
      green: theme.palette.common.green,
      orange: theme.palette.common.orange,
      blue: theme.palette.common.blue,
      icons: theme.palette.common.icons,
      greyE6: theme.palette.common.greyE6,
    },
    divider: theme.palette.divider,
  },
  breakpoints: {
    keys: theme.breakpoints.keys,
    values: {
      sm: theme.breakpoints.values.sm,
      md: theme.breakpoints.values.md,
      lg: theme.breakpoints.values.lg,
    },
  },
  zIndex: theme.zIndex,
  typography: appTypographys,
  spacing: theme.spacing,
  components: appComponents,
  shape: {
    borderRadius: theme.shape.borderRadius,
  },
})

export default appTheme
