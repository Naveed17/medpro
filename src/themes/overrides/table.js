// ----------------------------------------------------------------------

export default function Table(theme) {
  return {
    MuiTableContainer: {},
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: "separate",
          borderSpacing: "0px 8px",
          background: "transparent",
          "& .MuiTableBody-root .MuiTableRow-root": {
            "& .MuiTableCell-root": {
              borderTop: "1px solid transparent",
              borderBottom: "1px solid transparent",
              "&:first-of-type": {
                borderLeft: "1px solid transparent",
              },
              "&:last-of-type": {
                borderRight: "1px solid transparent",
              },
            },
            "&:hover": {
              "& .MuiTableCell-root": {
                backgroundColor: "#0696D61A",
                borderTop: `1px solid ${theme.palette.divider}`,
                borderBottom: `1px solid ${theme.palette.divider}`,
                "&:first-of-type": {
                  borderLeft: `1px solid ${theme.palette.divider}`,
                },
                "&:last-of-type": {
                  borderRight: `1px solid ${theme.palette.divider}`,
                },
              },
            },
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: theme.palette.action.selected,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
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
          backgroundColor: "rgba(6, 150, 214, 0.2)",
          paddingTop: theme.spacing(1),
          paddingBottom: theme.spacing(1),
          "&:first-of-type": {
            borderTopLeftRadius: theme.shape.borderRadius,
            borderBottomLeftRadius: theme.shape.borderRadius,
            '& span': {
              flexDirection: 'row !important',
              justifyContent: 'flex-start !important',
            }
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
            textTransform: "uppercase",
            fontFamily: "Poppins",
            letterSpacing: "1px",
            cursor: "pointer",
            span: {
              display: "flex",
              justifyContent: "flex-end",
              flexDirection: "row-reverse",
              alignItems: "center",
            },
            div: {
              float: "right",
            },
            '& .MuiTableSortLabel-root': {
              '& .MuiTableSortLabel-icon': {
                transform: 'rotate(90deg)',
              }
            }
          },
        },
        stickyHeader: {
          backgroundColor: theme.palette.background.paper,
          backgroundImage: `linear-gradient(to bottom, ${theme.palette.background.neutral} 0%, ${theme.palette.background.neutral} 100%)`,
        },
        body: {
          backgroundColor: theme.palette.background.paper,
          "&.MuiTableCell-root": {
            padding: "8px 12px",
          },
          borderColor: "#f1faff",
          fontFamily: "Poppins",
          color: theme.palette.text.secondary,
          fontSize: "12px",
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
