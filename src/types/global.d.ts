import { CustomShadowType } from "@themes/shadows";
import React from "react";

declare global {
  type LayoutProps = {
    children: React.ReactNode;
    fallback?: any;
    pageProps?: any;
    session?: any;
  };
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    google: true;
    "text-black": true;
    filter: true;
    "text-primary": true;
    consultationIP: true;
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsVariantOverrides {
    contained: true;
  }
}

declare module "@mui/material" {
  interface Color {
    0: number;
    "500_32": string;
    "500_16": string;
    A0: string;
    A50: string;
    A200: string;
    A300: string;
    A400: string;
    A500: string;
    A600: string;
    A700: string;
    A800: string;
    A900: string;
  }
  interface PaletteColor {
    lighter: string;
  }
  interface ThemeOptions {
    customShadows?: CustomShadowType;
  }
}

declare module "@mui/material/styles" {
  interface Theme {
    customShadows: CustomShadowType;
  }
}
