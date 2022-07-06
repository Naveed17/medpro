// ----------------------------------------------------------------------
export default function FormControl(theme) {
  return {
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            background: theme.palette.grey["A500"],
            "& .MuiInputBase-inputSizeSmall.MuiSelect-root": {
              minHeight: "1.5rem",
            },
            fieldset: {
              borderRadius: "6px",
            },
            "&:hover": {
              fieldset: {
                border: `1px solid ${theme.palette.primary.main}`,
                boxShadow: theme.customShadows.textField,
              },
            },
            "&.Mui-focused": {
              background: "transparent",
              fieldset: {
                border: `1px solid ${theme.palette.primary.main}`,
                boxShadow: "none",
                outline: "none",
              },
            },
          },
        },
      },
    },
  };
}
