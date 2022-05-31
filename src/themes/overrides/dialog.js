// ----------------------------------------------------------------------

export default function Dialog(theme) {
  return {
    MuiDialog: {
      styleOverrides: {
        root: {
          '& .MuiDialogTitle-root':{
            background: theme.palette.primary.main,
            color: 'white'
          },
          "& .MuiPaper-root": {

          },
        },
      },
    },
  };
}
