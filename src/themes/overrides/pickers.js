export default function Pickers(theme) {
  return {
    MuiDatePicker: {
      styleOverrides: {
        backgroundColor: "red",
        button: {
          minWidth: 27,
          minHeight: 27,
        },
      },
    },
  };
}
