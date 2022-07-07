// ----------------------------------------------------------------------
import { alpha } from "@mui/material/styles";

export default function Drawer(theme) {
  return {
    MuiDrawer: {
      styleOverrides: {
        root: {
          "& .MuiBackdrop-root": {
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
          },
          "& .MuiDrawer-paperAnchorRight": {
            boxShadow: theme.customShadows.drawer,
          },
        },
      },
    },
  };
}
