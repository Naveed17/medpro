import { alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------
function createGradient(color1: string, color2: string) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

// SETUP COLORS
const PRIMARY = {
  lighter: "#E6F7FE",
  light: '#60BCE6',
  main: "#0696D6",
  dark: "#034665",
  darker: "#022C3F",
};

const SECONDARY = {
  lighter: "#D6E4FF",
  light: "#84A9FF",
  main: "#24388A",
  dark: "#1939B7",
  darker: "#091A7A",
};

const INFO = {
  lighter: "#D0F2FF",
  light: "#74CAFF",
  main: "#F0F7FA",
  dark: "#bdc4c7",
  darker: "#bdc4c7",
};

const SUCCESS = {
  lighter: "#EAFBF3",
  light: "#76E5B3",
  main: "#2AD587",
  dark: "#14613E",
  darker: "#0C3B26",
};

const WARNING = {
  lighter: "#FFFBE5",
  light: "#FFE45C",
  main: "#FFD400",
  dark: "#766100",
  darker: "##483B00",
};

const ERROR = {
  lighter: "#FFE3E3",
  light: "#FF5656",
  main: "#E60000",
  dark: "#7A0000",
  darker: "#510000",
};

const EXPIRE = {
  lighter: "#ffc15a",
  light: "#ffc15a",
  main: "#e79029",
  dark: "#b06200",
  darker: "#b06200",
};

const BACK = {
  lighter: "#F0F7FA",
  light: "#F0F7FA",
  main: "#EEF2F6",
  dark: "#666D81",
  darker: "#F0F7FA",
};

const WHITE = {
  lighter: "#FFFFFF",
  light: "#F2F2F2",
  main: "#DDDDDD",
  dark: "#C9C8C8",
  darker: "#3F4254",
};

const BLACK = {
  lighter: "#000000",
  light: "#212121",
  main: "#0c0c0c",
  dark: "#1e1d1d",
  darker: "#34393b",
};

export const GREY = {
  0: "#FFFFFF",
  50:"#EEF2F6",
  100: "#DCE3ED",
  200: "#C8D4E2",
  300: "#B4C5D7",
  400: "#A0B6CC",
  500: "#8CA7C1",
  600: "#71899D",
  700: "#576A7A",
  800: "#3D4B57",
  900: "#232C34",
  A0: "#959CBD",
  A10: "#f8fafc",
  A11: "#E4E4E4",
  A50: "#647F94",
  A60: "#7E7E7E",
  A100: "#E3EAEF",
  A200: "#6E6B7B",
  A300: "#E0E0E0",
  A400: "#F1FAFF",
  A500: "#F9F9FB",
  A600: "#BDBDBD",
  A700: "#E7F5FB",
  A800: "#FCFCFC",
  A900: "#EEEEEE",
  B900: "#F89C47",
  B901: "#7E8299",
  B902: "#FAFAFA",
  B903: "#828282",
  B904: "#B5B5C3",
  B905: "#E6E6E6",
  B906:"#EBEDF3",
  B907:"#BEC2CC",
  B908:"#3D4B57",
  500_8: alpha("#919EAB", 0.08),
  500_12: alpha("#919EAB", 0.12),
  500_16: alpha("#919EAB", 0.16),
  500_24: alpha("#919EAB", 0.24),
  500_32: alpha("#919EAB", 0.32),
  500_48: alpha("#919EAB", 0.48),
  500_56: alpha("#919EAB", 0.56),
  500_80: alpha("#919EAB", 0.8),
  500_90: alpha("#212529",0.40)
};

const GRADIENTS = {
  primary: createGradient(PRIMARY.light, PRIMARY.main),
  info: createGradient(INFO.light, INFO.main),
  success: createGradient(SUCCESS.light, SUCCESS.main),
  warning: createGradient(WARNING.light, WARNING.main),
  error: createGradient(ERROR.light, ERROR.main),
  expire: createGradient(EXPIRE.light, EXPIRE.main),
  back: createGradient(BACK.light, BACK.main),
  white: createGradient(WHITE.lighter, WHITE.lighter),
  black: createGradient(BLACK.lighter, BLACK.lighter),
};

const COMMON = {
  common: { black: "#000", white: "#fff" },
  primary: { ...PRIMARY, contrastText: "#fff" },
  secondary: { ...SECONDARY, contrastText: "#fff" },
  info: { ...INFO, contrastText: "#000" },
  success: { ...SUCCESS, contrastText: "#fff" },
  warning: { ...WARNING, contrastText: GREY[800] },
  error: { ...ERROR, contrastText: "#fff" },
  expire: { ...EXPIRE, contrastText: "#fff" },
  white: { ...WHITE, contrastText: GREY[600] },
  black: { ...BLACK, contrastText: "#000" },
  back: { ...BACK, contrastText: GREY[600] },
  grey: GREY,
  gradients: GRADIENTS,
  divider: GREY[200],
  action: {
    hover: GREY[500_8],
    selected: GREY[500_16],
    disabled: GREY[500_90],
    disabledBackground: GREY[500_24],
    focus: GREY[500_24],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

const palette = {
  ...COMMON,
  text: {
    primary: "#1B2746",
    secondary: GREY[700],
    disabled: COMMON.action.disabled,
  },
  background: {
    default: "#F0FAFF",
    paper: "#ffffff",
    neutral: "#E7F5FB",
  },
  action: {
    active: GREY[600],
    ...COMMON.action,
  },
};

export default palette;
