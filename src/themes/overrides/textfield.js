// ----------------------------------------------------------------------

export default function TextField(theme) {
  return {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            minHeight: "38px",
            borderRadius: "6px",
            input: {
              padding: "7.5px 14px",
            },
            button: {
              minHeight: 32,
              height: 32,
              minWidth: 32,
              width: 32,
              svg: {
                fontSize: 20,
                color: theme.palette.text.secondary,
              },
            },
            background: theme.palette.grey["A500"],
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
      // variants for textfield
      variants: [
        {
          props: { variant: "standard" },
          style: {
            backgroundColor: theme.palette.error.main,
          },
        },
      ],
    },
  };
}
