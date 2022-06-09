// ----------------------------------------------------------------------

export default function Switch(theme) {
  return {
    MuiSwitch: {
      styleOverrides: {
        thumb: {
          boxShadow: "none",
        },
        track: {
          opacity: 1,
          backgroundColor: "white",
          borderColor: "#ddd",
          borderWidth: "1px",
          borderStyle: "solid",
          borderRadius: 20 / 2,
        },
        switchBase: {
          left: 0,
          right: "auto",
          "&.Mui-checked+.MuiSwitch-track": {
            backgroundColor: "white",
          },
          "&:not(.Mui-checked)": {
            color: "#7C878E",
          },
        },
      },
    },
  };
}
