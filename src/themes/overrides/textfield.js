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
            background: "#F9F9FB",
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
      // variants for textfield
      variants: [
        {
          props: { variant: "standard" },
          style: {
            backgroundColor: "red",
          },
        },
      ],
    },
  };
}
