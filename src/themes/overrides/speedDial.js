// ----------------------------------------------------------------------

export default function Switch(theme) {
  return {
    MuiSpeedDial: {
      styleOverrides: {
        root: {
          "& .MuiSpeedDialAction-staticTooltip": {
            "& .MuiSpeedDialAction-staticTooltipLabel": {
              minWidth: "max-content",
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
