import { alpha } from "@mui/material/styles";
import palette from "./palette";
export const shadows: any = [
  "0px 1px 5px rgba(0, 85, 121, 0.44)",
  "0px 1px 5px rgba(0, 112, 50, 0.7)",
  "0px 1px 5px rgba(244, 167, 170, 0.78)",
  "0px 0px 3px 1px rgba(219, 219, 219, 1)",
  "0px 0px 6px rgba(6, 150, 214, 0.2)",
  "0px 5px 12px rgba(0, 0, 0, 0.06)",
  "0px 1px 5px #0096D6",
  "0px 0px 6px rgba(0, 0, 0, 0.07)",
  "0px 1px 5px rgba(116, 95, 0, 0.72)",
  "0px 0px 16px rgba(0, 0, 0, 0.1)",
  "0px 1px 5px rgba(0, 112, 50, 0.7)",
  "0px 1px 5px rgba(0, 150, 214, 0.25)",
  "0px 1px 5px rgba(0, 112, 50, 0.7)",
  "0px 1px 5px rgba(0, 112, 50, 0.7)",
  "0px 1px 5px rgba(0, 112, 50, 0.7)",
  "0px 1px 5px rgba(0, 112, 50, 0.7)",
  "0px 1px 5px rgba(0, 112, 50, 0.7)",
  "0px 1px 5px rgba(0, 112, 50, 0.7)",
  "0px 1px 5px rgba(0, 112, 50, 0.7)",
  "0px 1px 5px rgba(0, 112, 50, 0.7)",
  "0px 1px 5px rgba(0, 112, 50, 0.7)",
  "0px 1px 5px rgba(0, 112, 50, 0.7)",
  "0px 1px 5px rgba(0, 112, 50, 0.7)",
  "0px 1px 5px rgba(0, 112, 50, 0.7)",
  "0px 1px 5px rgba(0, 112, 50, 0.7)",
];

const LIGHT_MODE = palette.grey[500];

const createCustomShadow = () => {

  return {
    primary: `0px 1px 5px #0096D6`,
    secondary: `0 8px 16px 0 ${alpha(palette.secondary.main, 0.24)}`,
    info: `0 8px 16px 0 ${alpha(palette.info.main, 0.24)}`,
    success: `0 8px 16px 0 ${alpha(palette.success.main, 0.24)}`,
    warning: `0 8px 16px 0 ${alpha(palette.warning.main, 0.24)}`,
    error: `0 8px 16px 0 ${alpha(palette.error.main, 0.24)}`,
    primaryButton: `0px 1px 5px #0096D6`,
    secondaryButton: `0px 1px 5px #0096D6`,
    infoButton: `0px 1px 5px #0096D6`,
    successButton: `0px 1px 5px rgba(0, 112, 50, 0.7)`,
    warningButton: ` 0px 1px 5px rgba(116, 95, 0, 0.72)`,
    textPrimaryButton: `0px 1px 5px rgba(0, 85, 121, 0.44)`,
    textSecondaryButton: `0px 1px 5px rgba(0, 112, 50, 0.7)`,
    textInfoButton: `0px 1px 5px rgba(0, 112, 50, 0.7)`,
    textSuccessButton: `0px 1px 5px rgba(0, 112, 50, 0.7)`,
    textWarningButton: `0px 1px 5px rgba(0, 112, 50, 0.7)`,
    textErrorButton: `0px 1px 5px rgba(244, 167, 170, 0.78)`,
    modifireButton: `0px 1px 5px rgba(6, 150, 214, 0.3)`,
    documentButton: `0px 0px 6px rgba(6, 150, 214, 0.2)`,
    callanderButton: `0px 1px 5px rgba(0, 150, 214, 0.25)`,
    filterButton: `0px 0px 7px rgba(0, 0, 0, 0.32)`,
    ListingPageFilter: '0px 2px 4px rgba(0, 0, 0, 0.06)'
  };
};

export const customShadows = {
  ...createCustomShadow(LIGHT_MODE),
};
