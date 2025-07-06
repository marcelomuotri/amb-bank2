import type { Components, Theme } from '@mui/material'
import { theme } from './theme'

export const appComponents: Components<Omit<Theme, 'components'>> = {
  MuiCssBaseline: {
    // styleOverrides: {
    //   body: {
    //     '&::-webkit-scrollbar, *::-webkit-scrollbar': {
    //       width: 18,
    //       height: 14,
    //       backgroundColor: theme.palette.common.white,
    //     },

    //     '&::-webkit-scrollbar-thumb, *::-webkit-scrollbar-thumb': {
    //       borderRadius: theme.shape.borderRadius,
    //       backgroundColor: theme.palette.action.disabled,
    //       border: '5px solid transparent',
    //       backgroundClip: 'padding-box',
    //     },
    //     '&::-webkit-scrollbar-thumb:focus, *::-webkit-scrollbar-thumb:focus': {
    //       backgroundColor: theme.palette.common.greyE6,
    //     },
    //     '&::-webkit-scrollbar-thumb:active, *::-webkit-scrollbar-thumb:active':
    //       {
    //         backgroundColor: theme.palette.common.greyE6,
    //       },
    //     '&::-webkit-scrollbar-thumb:hover, *::-webkit-scrollbar-thumb:hover': {
    //       backgroundColor: theme.palette.common.greyE6,
    //     },
    //   },
    // },
  },
  // MuiLink: {
  //   defaultProps: {
  //     color: theme.palette.text.secondary,
  //     fontWeight: 600,
  //   },
  //   styleOverrides: {
  //     root: {
  //       cursor: 'pointer',
  //     },
  //   },
  // },
  MuiTypography: {
    defaultProps: {
      variantMapping: {
        h1Regular: 'h1',
        h1SemiBold: 'h1',
        h1ExtraBold: 'h1',
        titleRegular: 'h2',
        titleSemiBold: 'h2',
        titleExtraBold: 'h2',
        bodyRegular: 'p',
        bodySemiBold: 'p',
        bodyExtraBold: 'p',
      },
    },
    styleOverrides: {
      root: {
        fontSize: '16px', // Establece el tamaño de fuente aquí
        //letterSpacing: '0.45px',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        boxShadow: 'none',
        ':active': {
          boxShadow: 'none',
        },
        ':hover': {
          boxShadow: 'none',
        },
        borderRadius: theme.shape.borderRadius,
        '&.Mui-disabled': {
          backgroundColor: '#FFF6F4',
          color: '#C0A7A1',
        },
      },
    },
  },
  MuiSkeleton: {
    styleOverrides: {
      root: {
        backgroundColor: theme.palette.divider,
        borderRadius: 2,
        ':after': {
          animation: 'animation-wiooy9 1.6s linear 0.5s infinite',
          background: `linear-gradient( 90deg, transparent, ${theme.palette.common.greyE6}, transparent )`,
        },
      },
    },
  },
  MuiToolbar: {
    styleOverrides: {
      root: {
        '@media (min-width: 600px)': {
          minHeight: 34 /* También asegúrate de manejar el media query */,
        },
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 13,
        height: 50,
        //padding: '16px 32px',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#DFE5E9',
          transition: 'border-color 0.3s ease-in-out',
          borderWidth: 1,
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#DFE5E9', // Color al pasar el mouse
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.action.focus, // Color cuando está enfocado
          borderWidth: 1,
        },
      },
      input: {
        padding: '14px 30px',
        fontSize: 14,
      },
    },
  },
  MuiDataGrid: {
    styleOverrides: {
      columnHeaderRow: {
        backgroundColor: '#F8F8FA',
        color: '#131212',
        fontWeight: 600,
        FontSize: 14,
      },
      root: {
        '& .MuiSelect-root': {
          backgroundColor: 'white', // Fondo de los selects
          //color: '#1e88e5', // Color del texto
          borderRadius: '0px', // Bordes redondeados
          //padding: '4px 8px', // Espaciado interno
          borderColor: 'transparent!important',
          border: 'none',
        },
        '& .MuiSelect-icon': {
          //color: '#1e88e5', // Color del ícono del dropdown
        },
        '& .MuiOutlinedInput-input': {
          padding: '10px !important', // Elimina el padding interno
          border: 'none',
        },
        '& .MuiDataGrid-cell': {
          display: 'flex',
          alignItems: 'center',
          //justifyContent: 'center',
        },
        '& .MuiDataGrid-cell:focus': {
          outline: 'none', // Elimina el borde de enfoque al hacer clic
          border: 'none',
          boxShadow: 'none',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'white!important', // Cambia el color del borde
        },
        '& .MuiDataGrid-cell--editing:focus-within': {
          outline: 'none!important', // Elimina el borde de edición
        },
        '& .MuiDataGrid-cell--editing': {
          boxShadow: 'none !important', // Elimina cualquier sombra
          backgroundColor: 'transparent', // Opcional: evita cambios de color de fondo
          display: 'flex',
          alignItems: 'center',
        },
      },
    },
  },
  MuiSelect: {
    styleOverrides: {
      icon: {
        color: theme.palette.text.primary,
      },
    },
  },
}
