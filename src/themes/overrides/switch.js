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
          backgroundColor: theme.palette.common.white,
          borderColor: theme.palette.divider,
          borderWidth: "1px",
          borderStyle: "solid",
          borderRadius: 20 / 2,
        },
        switchBase: {
          left: 0,
          right: "auto",
          "&.Mui-checked+.MuiSwitch-track": {
            backgroundColor: theme.palette.common.white,
          },
          "&:not(.Mui-checked)": {
            color: theme.palette.grey[400],
          },
        },
      },
    },
  };
}
