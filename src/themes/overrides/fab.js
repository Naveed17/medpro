// ----------------------------------------------------------------------

export default function Fab(theme) {
  return {
    MuiFab: {
      styleOverrides: {
        // root: {
        //   boxShadow: "none",
        //   borderRadius: "0.375rem",
        //   padding: "0.5rem 1.125rem",
        // },
      },
      // variants for buttons
      variants: [
        {
          props: { color: "warning" },
          style: {
            backgroundColor: theme.palette.warning.main,
            boxShadow: "none",
            "&:hover, &:active": {
              backgroundColor: theme.palette.warning.main,
              boxShadow: theme.shadows[8],
            },
            "&:focus": {
              backgroundColor: theme.palette.warning.dark,
              "& path": {
                stroke: "#fff",
              },
            },
            // svg: {
            //   height: 15,
            // },
          },
        },
      ],
    },
  };
}
