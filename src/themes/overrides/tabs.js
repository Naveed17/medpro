export default function Tabs(theme) {
  return {
    MuiTabs: {
      styleOverrides: {
        root: {
          "& .MuiTab-root": {
            color: theme.palette.grey[600],
          },
          "& .Mui-disabled": {
            color: theme.palette.grey[200],
          },
          "&.tabs-bg-white": {
            position: "sticky",
            top: 54,
            borderTop: "none",
            zIndex: 112,
            backgroundColor: theme.palette.background.paper,
            button: {
              "&.Mui-selected": {
                color: (theme) => theme.palette.primary.main,
              },
            },
            [theme.breakpoints.down("md")]: {
              borderTop: `1px solid ${theme.palette.divider}`,
            },
          },
        },
      },
    },
  };
}
