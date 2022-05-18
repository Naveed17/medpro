// ----------------------------------------------------------------------

export default function Paper(theme) {
  return {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: "1px solid #e0e0e0",
        },
      },
    },
  };
}
