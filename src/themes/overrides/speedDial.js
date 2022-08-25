// ----------------------------------------------------------------------

export default function Switch(theme) {
  return {
    MuiSpeedDial: {
      styleOverrides: {
        root: {
          "& .MuiSpeedDialAction-staticTooltip": {
            "& .MuiSpeedDialAction-staticTooltipLabel": {
              minWidth: "200px",
              textAlign: "right",
              boxShadow: theme.customShadows.speedDial,
            },
            button: {
              boxShadow: theme.customShadows.speedDial,
            },
          },
        },
      },
    },
  };
}
