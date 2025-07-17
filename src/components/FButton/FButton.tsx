import { ReactElement } from 'react'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { useStyles } from './fbutton.styles'

type SharedBtnProps = {
  onClick: () => void
  title?: string
  titleTypography?: ReactElement
  startIcon?: ReactElement
  endIcon?: ReactElement
  variant?: 'contained' | 'outlined' | 'text'
  color?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning'
  size?: 'small' | 'medium' | 'large'
  className?: string // ✅ Permitir pasar className externa
  sx?: object // ✅ Permitir estilos de MUI desde fuera
  disabled?: boolean
  fullWidth?: boolean
  href?: string
  textTransform?: 'inherit' | 'initial' | 'none' | 'lowercase' | 'uppercase'
  padding?: string
  loading?: boolean // Nueva prop para mostrar el loader
  textClassName?: string
}

const FButton = ({
  className, // ✅ Recibir className externa
  sx, // ✅ Permitir sx para estilos personalizados
  ...props
}: SharedBtnProps) => {
  const { classes: styles } = useStyles()
  //props.loading = true
  return (
    <Button
      href={props.href}
      disabled={props.disabled || props.loading}
      className={`${styles.button} ${className || ''}`} // ✅ Aplica la className externa
      sx={{ ...sx }} // ✅ Permite usar sx para estilos inline
      variant={props.variant || 'contained'}
      color={props.color || 'primary'}
      size={props.size || 'medium'}
      onClick={(e) => {
        e.preventDefault()
        props.onClick()
      }}
      startIcon={!props.loading && props.startIcon}
      fullWidth={props.fullWidth}
      endIcon={!props.loading && props.endIcon}
    >
      {props.loading ? (
        <Box sx={{ display: 'flex', gap: 6 }}>
          <Typography
            variant={'bodyRegular'}
            className={`${styles.title} ${props.textClassName || ''}`}
          >
            {props.title}
          </Typography>
          <CircularProgress size={14} color='inherit' />
        </Box>
      ) : props.title ? (
        <Typography
          variant={'bodyRegular'}
          className={`${styles.title} ${props.textClassName || ''}`}
        >
          {props.title}
        </Typography>
      ) : (
        props.titleTypography
      )}
    </Button>
  )
}

export default FButton
