// ----------------------------------------------------------------------
export default function FormControl(theme) {
  return {
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            background: "#F9F9FB",
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
