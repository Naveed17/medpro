export default function Pickers(theme) {
  return {
    MuiDatePicker: {
      styleOverrides: {
        backgroundColor: theme.palette.error.main,
        button: {
          minWidth: 27,
          minHeight: 27,
        },
      },
    },
  };
}
