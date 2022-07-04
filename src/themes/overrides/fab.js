// ----------------------------------------------------------------------

export default function Fab(theme) {
  return {
    MuiFab: {
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
                stroke: theme.palette.common.white,
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
