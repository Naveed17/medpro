// ----------------------------------------------------------------------
export default function FormControl() {
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
                border: "1px solid #0696D6",
                boxShadow: "0px 0px 4px rgba(0, 150, 214, 0.25)",
              },
            },
            "&.Mui-focused": {
              background: "transparent",
              fieldset: {
                border: "1px solid #0696D6",
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
