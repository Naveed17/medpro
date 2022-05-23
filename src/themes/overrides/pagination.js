import { alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function Pagination(theme) {
  return {
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: theme.palette.common.white,
          boxShadow: theme.shadows[7],
          "&.Mui-selected": {
            fontWeight: theme.typography.fontWeightBold,
          },
        },
        textPrimary: {
          height: 41,
          width: 41,
          "&.Mui-selected": {
            color: theme.palette.common.white,
            boxShadow: "none",
            "&:hover, &.Mui-focusVisible": {
              backgroundColor: `${alpha(
                theme.palette.primary.main,
                0.24
              )} !important`,
            },
          },
          "&.Mui-disabled.MuiPaginationItem-previousNext": {
            display: "none",
          },
          "&.MuiPaginationItem-ellipsis": {
            backgroundColor: "transparent",
            boxShadow: "none",
            fontSize: "1.688rem",
            color: theme.palette.primary.main,
          },
        },
        outlined: {
          border: `1px solid ${theme.palette.grey[500_32]}`,
        },
        outlinedPrimary: {
          "&.Mui-selected": {
            border: `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
          },
        },
      },
    },
  };
}
