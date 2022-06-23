// ----------------------------------------------------------------------
import IconUrl from "../urlIcon";

export default function Checkbox(theme) {
  return {
    MuiDrawer: {
      styleOverrides: {
        root: {
          "& .MuiBackdrop-root": {
            backgroundColor: "transparent",
          },
          "& .MuiDrawer-paperAnchorRight": {
            boxShadow: "-5px 14px 26px rgba(0, 150, 214, 0.37)",
          },
        },
      },
    },
  };
}
