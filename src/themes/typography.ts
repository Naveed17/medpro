import { pxToRem } from "@themes/formatFontSize";

// ----------------------------------------------------------------------

function responsiveFontSizes({ sm, md, lg }: any) {
  return {
    "@media (max-width:900px)": {
      fontSize: pxToRem(sm),
    },
    "@media (min-width:900px)": {
      fontSize: pxToRem(md),
    },
    "@media (min-width:1200px)": {
      fontSize: pxToRem(lg),
    },
  };
}

const FONT_PRIMARY = ["Poppins"].join(", ");
// const FONT_SECONDARY = ["Montserrat"];

const typography: any = {
  fontFamily: FONT_PRIMARY,
  fontWeightRegular: 500,
  fontWeightMedium: 600,
  fontWeightBold: 700,
  h1: {
    fontWeight: 700,
    fontFamily: "Poppins-Bold",
    lineHeight: 80 / 64,
    fontSize: pxToRem(64),
    ...responsiveFontSizes({ sm: 40, md: 58, lg: 64 }),
  },
  h2: {
    fontFamily: "Poppins-Bold",
    fontWeight: 700,
    lineHeight: 64 / 48,
    fontSize: pxToRem(56),
    ...responsiveFontSizes({ sm: 32, md: 44, lg: 56 }),
  },
  h3: {
    fontFamily: "Poppins-Bold",
    lineHeight: 1.5,
    fontWeight: 600,
    fontSize: pxToRem(48),
    ...responsiveFontSizes({ sm: 26, md: 30, lg: 48 }),
  },
  h4: {
    fontFamily: "Poppins-Bold",
    lineHeight: 1.5,
    fontWeight: 600,
    fontSize: pxToRem(40),
    ...responsiveFontSizes({ sm: 20, md: 24, lg: 40 }),
  },
  h5: {
    fontFamily: "Poppins-Bold",
    lineHeight: 1.5,
    fontWeight: 600,
    fontSize: pxToRem(32),
    ...responsiveFontSizes({ sm: 19, md: 20, lg: 32 }),
  },
  h6: {
    fontFamily: "Poppins-SemiBold",
    fontWeight: 600,
    lineHeight: 28 / 18,
    fontSize: pxToRem(24),
    ...responsiveFontSizes({ sm: 18, md: 18, lg: 24 }),
  },
  subtitle1: {
    fontWeight: 500,
    fontSize: pxToRem(18),
    lineHeight: 1.5,
  },
  subtitle2: {
    fontSize: pxToRem(16),
    lineHeight: 22 / 14,
    fontWeight: 500,
  },
  body1: {
    fontSize: pxToRem(14),
    lineHeight: 1.5,
    fontWeight: 400,
  },
  body2: {
    fontSize: pxToRem(12),
    lineHeight: 22 / 14,
    fontWeight: 400,
  },
  caption: {
    fontSize: pxToRem(12),
    lineHeight: 1.5,
  },
  overline: {
    fontSize: pxToRem(12),
    lineHeight: 1.5,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  button: {
    textTransform: "normal",
    borderRadius: 6,
    fontWeight: 500,
    fontFamily: "Poppins-Medium",
  },
};

export default typography;
