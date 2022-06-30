// ----------------------------------------------------------------------
export default function IconButton(theme) {
  return {
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&.MuiIconButton-colorPrimary": {
            background: "transparent",
            boxSizing: "border-box",
            borderRadius: "10px",
            "&.MuiIconButton-sizeLarge": {
              minHeight: "48px",
              minWidth: "48px",
            },
            "&.MuiIconButton-sizeMedium": {
              minHeight: "40px",
              minWidth: "40px",
            },
            "&.MuiIconButton-sizeSmall": {
              minHeight: "27px",
              minWidth: "27px",
            },
            border: "1px solid transparent",
            "&:hover": {
              border: `1px solid ${theme.palette.grey["A100"]}`,
              boxShadow: theme.shadows[4],
              background: theme.palette.info.main,
            },
            "&:active, &:focus": {
              background: theme.palette.primary.main,
              color: theme.palette.common.white,
              "& svg": {
                "& path": {
                  fill: theme.palette.common.white,
                },
              },
            },
          },
          "&.success-light": {
            border: `1px solid rgba(40, 199, 111, 0.12)`,
            backgroundColor: "rgba(40, 199, 111, 0.12)",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "rgba(40, 199, 111, 0.12)",
            },
            "& svg": {
              "& path": {
                fill: theme.palette.success.main,
              },
            },
          },
          "&.error-light": {
            border: `1px solid rgba(228, 51, 50, 0.1)`,
            backgroundColor: "rgba(228, 51, 50, 0.1)",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "rgba(228, 51, 50, 0.1)",
            },
            "& svg": {
              "& path": {
                fill: theme.palette.error.main,
              },
            },
          },
        },
      },
      variants: [
        {
          props: { variant: "custom" },
          style: {
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "10px",
            "& svg": {
              "& path": {
                fill: "#647F94",
              },
            },
            "&:hover": {
              backgroundColor: "transparent",
            },
          },
        },
        {
          props: { variant: "custom", color: "success" },
          style: {
            border: `1px solid ${theme.palette.success.main}`,
            backgroundColor: theme.palette.success.main,
            "& svg": {
              "& path": {
                fill: theme.palette.common.white,
              },
            },
            "&:hover": {
              backgroundColor: theme.palette.success.main,
            },
          },
        },
        {
          props: { variant: "warning-light" },
          style: {
            border: `1px solid rgba(244, 150, 0, 0.1)`,
            backgroundColor: "rgba(244, 150, 0, 0.1)",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "rgba(244, 150, 0, 0.1)",
            },
            "& svg": {
              "& path": {
                fill: theme.palette.warning.dark,
              },
            },
          },
        },
        {
          props: { variant: "primary-light" },
          style: {
            border: `1px solid rgba(0, 149, 183, 0.1)`,
            backgroundColor: "rgba(0, 149, 183, 0.1)",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "rgba(0, 149, 183, 0.1)",
            },
            "& svg": {
              "& path": {
                fill: theme.palette.primary.main,
              },
            },
          },
        },
      ],
    },
  };
}
