// ----------------------------------------------------------------------
import { alpha } from "@mui/material/styles";

export default function Checkbox(theme) {
  return {
    MuiDrawer: {
      styleOverrides: {
        root: {
          "& .MuiBackdrop-root": {
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
          },
          "& .MuiDrawer-paperAnchorRight": {
            boxShadow: theme.customShadows.drawer,
            "& > div": {
              [theme.breakpoints.down("sm")]: {
                minWidth: "100vw",
              },
            },
          },
        },
      },
    },
  };
}
