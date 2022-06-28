// ----------------------------------------------------------------------

export default function Dialog(theme) {
  return {
    MuiDialog: {
      styleOverrides: {
        root: {
          "& .MuiDialogTitle-root": {
            background: theme.palette.primary.main,
            color: "white",
          },
          "& .MuiPaper-root": {
            [theme.breakpoints.down("sm")]: {
              margin: "6px",
            },
            maxWidth: "100%",
            "& .modal-actions": {
              position: "relative",
              [theme.breakpoints.down("sm")]: {
                "& .btn-right": {
                  "& .MuiButton-startIcon": {
                    marginRight: "0px",
                    marginLeft: "0px",
                  },
                  button: {
                    width: 32,
                    minWidth: 32,
                  },
                },
                "& .sm-none": {
                  display: "none",
                },
              },
            },
          },
        },
      },
    },
  };
}
