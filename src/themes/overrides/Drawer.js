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
            backgroundColor: theme.palette.back.lighter,
            boxShadow: theme.customShadows.drawer,
            [theme.breakpoints.down("md")]: {
              width: "100%",
            },
          },
        },
      },
    },
  };
}
