// ----------------------------------------------------------------------

export default function Table(theme) {
  return {
    MuiTableContainer: {},
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: "separate",
          borderSpacing: "0px",
          background: "transparent",
          "& .MuiTableBody-root": {
            "& .action span": {
              float: "right",
            },
            "& .cip-medical-proce-row": {
              "& .MuiTableCell-root": {
                paddingTop: 0,
                paddingBottom: 0,
              },
            },
          },
        },
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root:not(.MuiTableCell-head)": {
            borderRadius: 0,
            borderTop: "1px solid transparent",
            borderBottom: `1px solid ${theme.palette.divider}`,
            "&:first-of-type": {
              borderLeft: "1px solid transparent",
            },
            "&:last-of-type": {
              borderRight: "1px solid transparent",
            },
          },
          "& .text-row": {
            backgroundColor: "transparent",
            padding: 0,
          },
          "&.MuiTableRow-root[role='checkbox']": {
            ".MuiTableCell-root": {
              "&:first-of-type": {
                borderLeft: `4px solid transparent`,
              }
            }
          },
          "&.MuiTableRow-root.Mui-selected": {
            ".MuiTableCell-root": {
              backgroundColor: theme.palette.primary.lighter,
              "&:first-of-type": {
                borderLeft: `4px solid ${theme.palette.primary.main}`,
              }
            },
            "&:hover": {
              ".MuiTableCell-root": {
                backgroundColor: theme.palette.primary.lighter,
              }
            }
          },
          "&:hover": {
            "& > .MuiTableCell-root:not(.MuiTableCell-head)": {
              backgroundColor: theme.palette.grey[50],
              borderBottom: `1px solid ${theme.palette.divider}`,
              "&.text-row": {
                backgroundColor: "transparent",
                borderColor: "transparent",
                "&:first-of-type": {
                  borderColor: "transparent",
                },
                "&:last-of-type": {
                  borderColor: "transparent",
                },
              },
            },

          },
          "&:first-of-type": {
            "&:hover": {
              ".MuiTableCell-root:not(.MuiTableCell-head)": {
                background: `linear-gradient(180deg, ${theme.palette.common.white} 2px, ${theme.palette.grey[50]} 0%);`
              }
            },
            ".MuiTableCell-root": {
              paddingTop: 10,
            },
            "&.Mui-selected": {
              ".MuiTableCell-root": {
                background: `linear-gradient(180deg, ${theme.palette.common.white} 2px, ${theme.palette.primary.lighter} 0%);`
              },
              "&:hover": {
                ".MuiTableCell-root": {
                  background: `linear-gradient(180deg, ${theme.palette.common.white} 2px, ${theme.palette.primary.lighter} 0%);`
                }
              }
            },

          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "none",
        },
        head: {
          color: theme.palette.text.secondary,
          paddingTop: theme.spacing(1),
          paddingBottom: theme.spacing(1),
          "&.MuiTableCell-head": {
            "&:first-of-type": {
              borderTopLeftRadius: theme.shape.borderRadius,
              borderBottomLeftRadius: theme.shape.borderRadius,
              "& span": {
                flexDirection: "row !important",
                justifyContent: "flex-start !important",
              },
            },
            "&:last-of-type": {
              borderTopRightRadius: theme.shape.borderRadius,
              borderBottomRightRadius: theme.shape.borderRadius,
            },
            "&.MuiTableCell-root": {
              padding: theme.spacing(1, 2),
              overflow: "hidden",
              borderColor: "transparent",
              color: theme.palette.text.secondary,
              textTransform: "none",
              fontWeight: 500,
              fontSize: 14,
              fontFamily: "Poppins",
              letterSpacing: "1px",
              cursor: "pointer",
              span: {
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              },
              div: {
                float: "right",
              },
            },
          },
        },
        stickyHeader: {
          backgroundColor: theme.palette.grey[50],
        },
        body: {
          backgroundColor: theme.palette.background.paper,
          "&.MuiTableCell-root": {
            padding: "8px 12px",
          },
          borderColor: theme.palette.grey["A400"],
          fontFamily: "Poppins",
          color: theme.palette.text.secondary,
          fontSize: "14px",
          "&:first-of-type": {
            borderTopLeftRadius: theme.shape.borderRadius,
            borderBottomLeftRadius: theme.shape.borderRadius,
          },
          "&:last-of-type": {
            borderTopRightRadius: theme.shape.borderRadius,
            borderBottomRightRadius: theme.shape.borderRadius,
          },
          div: {
            color: theme.palette.text.secondary,
            fontSize: "12px",
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          borderTop: `solid 1px ${theme.palette.divider}`,
        },
        toolbar: {
          height: 64,
        },
        select: {
          "&:focus": {
            borderRadius: theme.shape.borderRadius,
          },
        },
        selectIcon: {
          width: 20,
          height: 20,
          marginTop: 2,
        },
      },
    },
  };
}
