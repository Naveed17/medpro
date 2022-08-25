// ----------------------------------------------------------------------

export default function ControlLabel(theme) {
  return {
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          ...theme.typography.caption,
          color: theme.palette.text.primary,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginTop: theme.spacing(1),
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.text.disabled,
        },
      },
    },
  };
}
