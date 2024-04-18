// ----------------------------------------------------------------------

export default function Button(theme) {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 500,
          fontFamily: "Poppins",
          fontSize: 14,
          padding: "0.75rem 1rem",
          lineHeight: '80%',

          "&.Mui-disabled": {
            backgroundColor: theme.palette.back.main,
            color: theme.palette.grey["B907"],
            boxShadow: "none",
            cursor: "not-allowed",
            border: `1px solid ${theme.palette.grey['B907']}`,
            "& svg": {
              color: theme.palette.grey["B907"],
              path: {
                fill: theme.palette.grey["B907"]
              }
            }

          },
          "&.MuiButton-sizeLarge": {
            padding: "0.876rem 1.25rem",
            fontSize: "1rem",
          },
          "&.MuiButton-sizeMedium": {
            minHeight: 40,
            ".MuiButton-startIcon": {
              svg: {
                width: 16,
                height: 16
              }
            },
            ".MuiButton-endIcon": {
              svg: {
                width: 16,
                height: 16
              }
            }
          },
          "&.MuiButton-sizeSmall": {
            minHeight: 32
          },
          "&:hover": {
            boxShadow: 'none',
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
              background: theme.palette.primary.dark,
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
          props: { variant: "text", color: "primary" },
          style: {
            "&:hover": {
              boxShadow: theme.customShadows.textPrimaryButton,
            },
            "&:active,&:focus": {
              backgroundColor: theme.palette.primary.dark,
            },
          },
        },
        {
          props: { variant: "contained", color: "error" },
          style: {
            "&:hover": {
              backgroundColor: theme.palette.error.dark,
            },
            "&:active,&:focus": {
              backgroundColor: theme.palette.error.light,
            },
          },
        },
        {
          props: { variant: "contained-white", color: "error" },
          style: {
            background: theme.palette.common.white,
            color: theme.palette.error.main,
            "& :not(.Mui-disabled) svg path": {
              // fill: theme.palette.error.main,
            },
            "&:hover": {
              boxShadow: theme.customShadows.textErrorButton,
            },
            "&:active,&:focus": {
              backgroundColor: theme.palette.error.darker,
              color: theme.palette.common.white,
              "& svg path": {
                fill: theme.palette.common.white,
              },
            },
          },
        },
        {
          props: { variant: "text", color: "error" },
          style: {
            "&:hover": {
              boxShadow: theme.customShadows.textErrorButton,
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
              "& path": {
                fill: theme.palette.common.white,
              },
            },
          },
        },
        {
          props: { variant: "text-secondary" },
          style: {
            color: theme.palette.grey["A200"],
          },
        },
        {
          props: { variant: "contained", color: "warning" },
          style: {
            path: {
              fill: theme.palette.warning.contrastText,
            },
            "&:hover": {
              backgroundColor: theme.palette.warning.light,
            },
            "&:active,&:focus": {
              backgroundColor: theme.palette.warning.light,
            },
          },
        },
        {
          props: { variant: "contained", color: "success" },
          style: {
            "&:hover": {
              boxShadow: theme.customShadows.successButton,
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
              backgroundColor: theme.palette.primary.dark,
            },
            "&:active,&:focus": {
              backgroundColor: theme.palette.primary.light,
            },
            "& svg path": {
              fill: theme.palette.common.white,
            },
            "&.Mui-disabled": {
              backgroundColor: theme.palette.primary.lighter,
              color: theme.palette.common.white,
              border: 'none',
              "& svg": {
                color: theme.palette.common.white,
                path: {
                  fill: theme.palette.common.white
                }
              }
            }
          },
        },
        {
          props: { variant: "outlined", color: "info" },
          style: {
            backgroundColor: theme.palette.info.main,
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.divider}`,
            "&:hover": {
              backgroundColor: theme.palette.info.main,
              color: theme.palette.text.primary,
              border: `1px solid ${theme.palette.divider}`,
            },
          },
        },
        {
          props: { variant: "filter" },
          style: {
            backgroundColor: theme.palette.common.white,
            color: theme.palette.text.primary,
            boxShadow: theme.customShadows.filterButton,
            "&:hover": {
              backgroundColor: theme.palette.info.main,
              color: theme.palette.text.primary,
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
              boxShadow: theme.shadows[0],
              backgroundColor: theme.palette.common.white,
            },
            "&:active,&:focus": {
              backgroundColor: "transparent",
            },
          },
        },
        {
          props: { variant: "text-transparent" },
          style: {
            color: theme.palette.common.black,
            backgroundColor: "transparent",
            "& svg": {
              "& path": {
                fill: theme.palette.common.black,
              },
            },
            "&:hover": {
              boxShadow: "none",
              backgroundColor: "transparent",
            },
            "&:active,&:focus": {
              backgroundColor: "transparent",
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
              backgroundColor: "#4E6297",
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
        {
          props: { variant: "modifire" },
          style: {
            color: theme.palette.primary.main,
            backgroundColor: "none",
            "&:hover": {
              backgroundColor: theme.palette.common.white,
              boxShadow: theme.customShadows.modifireButton,
              "& svg": {
                "& path": {
                  fill: theme.palette.primary.main,
                },
              },
            },
            "&:active,&:focus": {
              backgroundColor: theme.palette.primary.main,
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
          props: { variant: "consultationIP" },
          style: {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.info.main,
            width: "100%",
            justifyContent: "flex-start",
            fontSize: theme.typography.fontSize,
            paddingTop: theme.spacing(1.455),
            paddingBottom: theme.spacing(1.455),
            "& svg": {
              "& path": {
                fill: theme.palette.primary.main,
              },
            },
          },
        },
        {
          props: { variant: "white" },
          style: {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.common.white,
            "& svg": {
              "& path": {
                fill: theme.palette.text.primary,
              },
            },
          },
        },
        {
          props: { variant: "listing-dropdown" },
          style: {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.common.white,
            border: `1px solid ${theme.palette.divider}`,
          },
        },
      ],
    },
  };
}
