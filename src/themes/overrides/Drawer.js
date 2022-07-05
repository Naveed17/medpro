// ----------------------------------------------------------------------
import IconUrl from "../urlIcon";

export default function Drawer(theme) {
  return {
    MuiDrawer: {
      styleOverrides: {
        root: {
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(6, 150, 214, 0.2);",
          },
          "& .MuiDrawer-paperAnchorRight": {
            boxShadow: "-5px 14px 26px rgba(0, 150, 214, 0.37)",
            // "& > div": {
            //   [theme.breakpoints.down("sm")]: {
            //     minWidth: "100vw",
            //   },
            // },
          },
        },
      },
    },
  };
}
