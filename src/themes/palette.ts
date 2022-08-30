import { alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

function createGradient(color1: string, color2: string) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

// SETUP COLORS
const PRIMARY = {
  lighter: alpha("#0696D6", 0.1),
  light: alpha("#0696D6", 0.12),
  main: "#0696D6",
  dark: "#04618B",
  darker: "#005249",
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
  dark: "#0C53B7",
  darker: "#04297A",
};
const SUCCESS = {
  lighter: "#E9FCD4",
  light: "#AAF27F",
  main: "#1BC47D",
  dark: "#28C76F",
  darker: "#138958",
};
const WARNING = {
  lighter: "#FFF7CD",
  light: "#FFE16A",
  main: "#FFD400",
  dark: "#B78103",
  darker: "#B49602",
};
const ERROR = {
  lighter: "#FFE7E9",
  light: "#FFA48D",
  main: "#E83B68",
  dark: "#B72136",
  darker: "#E83B68",
};
const BACK = {
  lighter: "#F0F7FA",
  light: "#F0F7FA",
  main: "#F0F7FA",
  dark: "#F0F7FA",
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
  100: "#F2F2F2",
  200: "#DDDDDD",
  300: "#C9C8C8",
  400: "#7C878E",
  500: "#3C3C3B",
  600: "#1B2746",
  700: "#B8BCCA",
  800: "#212B36",
  900: "#161C24",
  A0: "#959CBD",
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
  500_8: alpha("#919EAB", 0.08),
  500_12: alpha("#919EAB", 0.12),
  500_16: alpha("#919EAB", 0.16),
  500_24: alpha("#919EAB", 0.24),
  500_32: alpha("#919EAB", 0.32),
  500_48: alpha("#919EAB", 0.48),
  500_56: alpha("#919EAB", 0.56),
  500_80: alpha("#919EAB", 0.8)
};

const GRADIENTS = {
  primary: createGradient(PRIMARY.light, PRIMARY.main),
  info: createGradient(INFO.light, INFO.main),
  success: createGradient(SUCCESS.light, SUCCESS.main),
  warning: createGradient(WARNING.light, WARNING.main),
  error: createGradient(ERROR.light, ERROR.main),
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
  white: { ...WHITE, contrastText: "#fff" },
  black: { ...BLACK, contrastText: "#000" },
  back: { ...BACK, contrastText: "#fff" },
  grey: GREY,
  gradients: GRADIENTS,
  divider: "#DDDDDD",
  action: {
    hover: GREY[500_8],
    selected: GREY[500_16],
    disabled: GREY[500_80],
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
    secondary: "#7C878E",
    disabled: "#959CBD",
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
