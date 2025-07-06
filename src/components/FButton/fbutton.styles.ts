import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material'

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
    },
    '&.MuiButton-sizeSmall': {
      padding: '8px 24px',
    },
    '&.MuiButton-sizeMedium': {
      paddingLeft: 48,
      paddingRight: 48,
    },
  },
  title: {
    fontWeight: 600,
    lineHeight: '14px',
    color: 'white',
  },
  disabled: {
    color: '#C0A7A1!important',
  },
}))
