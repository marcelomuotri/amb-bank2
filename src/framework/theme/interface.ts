import { CSSProperties } from 'react'

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false
    xl: false
  }

  interface TypographyVariants {
    h1Regular: CSSProperties
    h1SemiBold: CSSProperties
    h1ExtraBold: CSSProperties
    titleRegular: CSSProperties
    titleSemiBold: CSSProperties
    titleExtraBold: CSSProperties
    bodyRegular: CSSProperties
    bodySemiBold: CSSProperties
    bodyExtraBold: CSSProperties
    bodyRegularError: CSSProperties
    bodyRegularSmall: CSSProperties
  }

  interface TypographyVariantsOptions {
    h1Regular?: CSSProperties
    h1SemiBold?: CSSProperties
    h1ExtraBold?: CSSProperties
    titleRegular?: CSSProperties
    titleSemiBold?: CSSProperties
    titleExtraBold?: CSSProperties
    bodyRegular?: CSSProperties
    bodySemiBold?: CSSProperties
    bodyExtraBold?: CSSProperties
    bodyRegularError?: CSSProperties
    bodyRegularSmall?: CSSProperties
  }
}

declare module '@mui/material/styles/createPalette' {
  interface CommonColors {
    transparent?: string
    grey?: string
    green?: string
    orange?: string
    blue?: string
    icons?: string
    greyE6?: string
  }

  interface TypeText {
    input: string
  }

  interface TypeAction {
    disabledBorder: string
  }
}

declare module '@mui/material/styles/zIndex' {
  interface ZIndex {
    header: number
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    h1: false
    h2: false
    h3: false
    h4: false
    h5: false
    h6: false
    subtitle1: false
    subtitle2: false
    body1: false
    body2: false
    button: false
    caption: false
    overline: false
    h1Regular: true
    h1SemiBold: true
    h1ExtraBold: true
    titleRegular: true
    titleSemiBold: true
    titleExtraBold: true
    bodyRegular: true
    bodySemiBold: true
    bodyExtraBold: true
    bodyRegularError: true
    bodyRegularSmall: true
  }
}
