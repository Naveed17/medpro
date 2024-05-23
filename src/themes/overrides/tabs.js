export default function Tabs(theme) {
  return {
    MuiTabs: {
      styleOverrides: {
        root: {
          "& .MuiTab-root": {
            color: theme.palette.grey[600],
            "&:hover": {
              color: theme.palette.primary.main,
            }
          },
          "& .Mui-disabled": {
            color: theme.palette.action.disabled,
          },
          button: {
            "&.Mui-selected": {
              color: theme.palette.primary.main,
            },
            ".MuiTab-iconWrapper": {
              ".MuiBadge-badge": {
                position: 'static',
                transform: 'none'
              }
            }
          },
          "&.tabs-bg-white": {
            position: "sticky",
            top: 54,
            borderTop: "none",
            zIndex: 112,
            backgroundColor: theme.palette.background.paper,
            [theme.breakpoints.down("md")]: {
              borderTop: `1px solid ${theme.palette.divider}`,
            },
          },
          "&.custom-tabs": {
            minHeight: 40,
            ".MuiTabs-flexContainer": {
              gap: theme.spacing(.5),
              "& .MuiTab-root": {
                minHeight: 40,
                color: theme.palette.grey[700],
                padding: theme.spacing(1, 1.5),
                "&.Mui-selected": {
                  backgroundColor: theme.palette.primary.lighter,
                  color: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.lighter,
                    color: theme.palette.primary.main,
                  },
                },
                "&:hover": {
                  backgroundColor: theme.palette.grey[50],
                  color: theme.palette.grey[700],
                },
                "&.Mui-disabled": {
                  backgroundColor: 'transparent',
                  color: theme.palette.grey[200],
                  cursor: 'not-allowed',

                },
              },

            },
            '& .MuiTabs-indicator': { display: 'none' }

          }
        },
      },
    },
  };
}
