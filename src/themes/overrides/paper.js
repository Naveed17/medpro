// ----------------------------------------------------------------------

export default function Paper(theme) {
  return {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: `1px solid ${theme.palette.grey["A300"]}`,
        },
      },
    },
  };
}
