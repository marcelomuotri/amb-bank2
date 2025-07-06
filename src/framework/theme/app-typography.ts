import { theme } from './theme'

const LINE_HEIGHT_MULTIPLIER = 1.5

export const appTypographys = {
  fontFamily: theme.typography.fontFamily,
  htmlFontSize: theme.typography.htmlFontSize,
  fontWeightRegular: theme.typography.fontWeightRegular,
  fontWeightMedium: theme.typography.fontWeightMedium,
  fontWeightBold: theme.typography.fontWeightBold,
  h1Regular: {
    fontFamily: theme.typography.h1Regular.fontFamily,
    fontSize: theme.typography.h1Regular.fontSize + 'rem',
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.palette.text.primary,
    lineHeight:
      theme.typography.h1Regular.fontSize * LINE_HEIGHT_MULTIPLIER + 'rem',
  },
  h1SemiBold: {
    fontFamily: theme.typography.h1SemiBold.fontFamily,
    fontSize: theme.typography.h1SemiBold.fontSize + 'rem',
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.text.primary,
    lineHeight:
      theme.typography.h1SemiBold.fontSize * LINE_HEIGHT_MULTIPLIER + 'rem',
  },
  h1ExtraBold: {
    fontFamily: theme.typography.h1ExtraBold.fontFamily,
    fontSize: theme.typography.h1ExtraBold.fontSize + 'rem',
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary,
    lineHeight:
      theme.typography.h1ExtraBold.fontSize * LINE_HEIGHT_MULTIPLIER + 'rem',
  },
  titleRegular: {
    fontFamily: theme.typography.titleRegular.fontFamily,
    fontSize: theme.typography.titleRegular.fontSize + 'rem',
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.palette.text.primary,
    lineHeight:
      theme.typography.titleRegular.fontSize * LINE_HEIGHT_MULTIPLIER + 'rem',
  },
  titleSemiBold: {
    fontFamily: theme.typography.titleSemiBold.fontFamily,
    fontSize: theme.typography.titleSemiBold.fontSize + 'rem',
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.text.primary,
    lineHeight:
      theme.typography.titleSemiBold.fontSize * LINE_HEIGHT_MULTIPLIER + 'rem',
  },
  titleExtraBold: {
    fontFamily: theme.typography.titleExtraBold.fontFamily,
    fontSize: theme.typography.titleExtraBold.fontSize + 'rem',
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary,
    lineHeight:
      theme.typography.titleExtraBold.fontSize * LINE_HEIGHT_MULTIPLIER + 'rem',
  },
  bodyRegular: {
    fontFamily: theme.typography.bodyRegular.fontFamily,
    fontSize: theme.typography.bodyRegular.fontSize + 'rem',
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.palette.text.primary,
    lineHeight:
      theme.typography.bodyRegular.fontSize * LINE_HEIGHT_MULTIPLIER + 'rem',
  },
  bodySemiBold: {
    fontFamily: theme.typography.bodySemiBold.fontFamily,
    fontSize: theme.typography.bodySemiBold.fontSize + 'rem',
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.text.primary,
    lineHeight:
      theme.typography.bodySemiBold.fontSize * LINE_HEIGHT_MULTIPLIER + 'rem',
  },
  bodyExtraBold: {
    fontFamily: theme.typography.bodyExtraBold.fontFamily,
    fontSize: theme.typography.bodyExtraBold.fontSize + 'rem',
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary,
    lineHeight:
      theme.typography.bodyExtraBold.fontSize * LINE_HEIGHT_MULTIPLIER + 'rem',
  },
  bodyRegularError: {
    fontFamily: theme.typography.bodyRegular.fontFamily,
    fontSize: theme.typography.bodyRegular.fontSize + 'rem',
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.palette.error.main,
    lineHeight:
      theme.typography.bodyRegular.fontSize * LINE_HEIGHT_MULTIPLIER + 'rem',
  },
  bodyRegularSmall: {
    fontFamily: theme.typography.bodyRegularSmall.fontFamily,
    fontSize: theme.typography.bodyRegularSmall.fontSize + 'rem',
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.palette.text.primary,
    lineHeight:
      theme.typography.bodyRegularSmall.fontSize * LINE_HEIGHT_MULTIPLIER +
      'rem',
  },
}
