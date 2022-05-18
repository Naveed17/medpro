// ----------------------------------------------------------------------

export default function Button(theme) {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderRadius: "0.375rem",
          padding: "0.5rem 1.125rem",
          '&.Mui-disabled': {
            backgroundColor: theme.palette.grey[300],
            color: theme.palette.common.white,
            boxShadow: "none",
          }
        },
      },
      // variants for buttons
      variants: [
        {
          props: { size: "small" },
          style: {
            minHeight: 27,
            padding: "0rem 0.5em",
            fontSize: 12,
            svg: {
              height: 15,
            },
          },
        },
        {
          props: { variant: "navlink" },
          style: {
            fontSize: 18,
            backgroundColor: "transparent",
            "&:hover, &:focus": {
              backgroundColor: "transparent",
            },
            "&.active": {
              color: theme.palette.primary.main,
              "&::after": {
                content: '""',
                height: 3,
                width: 30,
                position: "absolute",
                bottom: 3,
                background: theme.palette.primary.main,
                borderRadius: 14,
              },
            },
          },
        },
        {
          props: { variant: "text" },
          style: {
            "&:hover": {
              boxShadow: theme.shadows[0],
              background: theme.palette.common.white,
            },
            "&:active, &:focus": {
              background: "#04618B",
              color: theme.palette.common.white,
              boxShadow: "none",
              "& svg": {
                "& path": {
                  fill: theme.palette.common.white,
                },
              },
            },
          },
        },
        {
          props: { variant: "text", color: "error" },
          style: {
            "&:hover": {
              boxShadow: theme.shadows[2],
            },
            "&:active,&:focus": {
              backgroundColor: theme.palette.error.darker,
            },
          },
        },
        {
          props: { variant: "text-primary" },
          style: {
            color: theme.palette.text.primary,
            backgroundColor: "transparent",
            "& svg": {
              "& path": {
                fill: theme.palette.text.primary,
              },
            },
            "&:hover": {
              boxShadow: theme.shadows[4],
              backgroundColor: theme.palette.common.white,
            },
            "&:active,&:focus": {
              backgroundColor: theme.palette.primary.dark,
              color: theme.palette.common.white,
            },
          },
        },
        {
          props: { variant: "text-secondary" },
          style: {
            color: "#6E6B7B",
          },
        },
        {
          props: { variant: "contained", color: "warning" },
          style: {
            "&:hover": {
              boxShadow: theme.shadows[8],
              backgroundColor: theme.palette.warning.main,
            },
            "&:active,&:focus": {
              backgroundColor: theme.palette.warning.darker,
              color: theme.palette.common.white,
              opacity: 1,
              path: {
                fill: theme.palette.common.white,
              },
            },
          },
        },
        {
          props: { variant: "contained", color: "success" },
          style: {
            "&:hover": {
              boxShadow: theme.shadows[1],
            },
            "&:active,&:focus": {
              backgroundColor: theme.palette.success.darker,
            },
          },
        },
        {
          props: { variant: "contained", color: "primary" },
          style: {
            "&:hover": {
              boxShadow: theme.shadows[6],
            },
            "&:active,&:focus": {
              backgroundColor: theme.palette.primary.dark,
            },
          },
        },
        {
          props: { variant: "text-white" },
          style: {
            color: theme.palette.common.white,
            backgroundColor: "transparent",
            "&:hover": {
              opacity: 0.8,
            },
            "&:active,&:focus": {
              backgroundColor: "transparent",
            },
          },
        },
        {
          props: { variant: "text-black" },
          style: {
            color: theme.palette.common.black,
            backgroundColor: "transparent",
            "& svg": {
              "& path": {
                fill: theme.palette.common.black,
              },
            },
            "&:hover": {
              boxShadow: theme.shadows[4],
              backgroundColor: theme.palette.common.white,
            },
            "&:active,&:focus": {
              backgroundColor: theme.palette.primary.dark,
            },
          },
        },
        {
          props: { variant: "text-warning" },
          style: {
            color: theme.palette.text.secondary,
            backgroundColor: "transparent",
            "& svg": {
              "& path": {
                fill: theme.palette.primary.main,
              },
            },
            "&:hover": {
              backgroundColor: theme.palette.warning.main,
              color: theme.palette.text.primary,
              "& svg": {
                "& path": {
                  fill: theme.palette.text.primary,
                },
              },
            },
          },
        },
        {
          props: { variant: "facebook" },
          style: {
            color: theme.palette.common.white,
            backgroundColor: "#4E6297",
            "& svg": {
              "& path": {
                fill: theme.palette.common.white,
              },
            },
            "&:hover": {
              backgroundColor: '#4E6297',
              color: theme.palette.common.white,
              "& svg": {
                "& path": {
                  fill: theme.palette.common.white,
                },
              },
            },
          },
        },
        {
          props: { variant: "google" },
          style: {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.grey[100],
            border: "1px solid #E0E0E0",
            "&:hover": {
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.grey[100],
            },
          },
        },
      ],
    },
  };
}
