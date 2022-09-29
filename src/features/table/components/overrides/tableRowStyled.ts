import { styled } from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";

const TableRowStyled = styled(TableRow)<any>(({ theme, styleprops }) => ({
  "& .MuiTableCell-root": {
    div: {
      color: "black",
    },
    "& .MuiSelect-select": {
      background: "white",
    },
    position: "relative",
    "& .name": {
      marginLeft: "24px",
      height: "100%",
      "&::after": {
        content: '" "',
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        left: 24,
        width: "4px",
        height: "calc(100% - 16px)",
        background: styleprops ? theme.palette[styleprops].main : "",
      },
      "&::before": {
        content: '" "',
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        left: 8,
        width: "13px",
        height: "13px",
        borderRadius: "50%",
        background: styleprops ? theme.palette[styleprops].main : "",
      },
    },
    "& .lg-down": {
      [theme.breakpoints.down("xl")]: {
        display: "none",
      },
    },
    "& .lg-up": {
      "& .edit-icon-button": {
        path: {
          fill: theme.palette.text.primary,
        },
      },
      [theme.breakpoints.up("xl")]: {
        display: "none",
      },
    },
  },
  "& .text-time": {
    display: "flex",
    alignItems: "center",
    svg: { marginRight: theme.spacing(0.5) },
  },
  "& .next-appointment": {
    display: "flex",
    alignItems: "center",
    svg: {
      width: 11,
      marginRight: theme.spacing(0.6),
      "& path": { fill: theme.palette.text.primary },
    },
  },
  "&.document-row": {
    "& .MuiAvatar-root": {
      width: 20,
      height: 20,
      borderRadius: 4,
      color: theme.palette.common.white,
      backgroundColor: theme.palette.grey[400],
      fontFamily: theme.typography.fontFamily,
      "& span": {
        fontSize: 9,
      },
    },
    "& .MuiCheckbox-root": {
      padding: 2,
      width: 22,
      height: 22,
      "& .react-svg": {
        " & svg": {
          width: 14,
          height: 14,
        },
      },
    },
    "& .MuiButton-root": {
      padding: theme.spacing(0, 1),
      fontSize: 14,
      minWidth: 0,
      color: theme.palette.text.primary,
      "& .react-svg svg path": {
        fill: theme.palette.text.primary,
      },
      "&:hover": {
        backgroundColor: "transparent",
        boxShadow: "none",
      },
      "&:focus, &:active": {
        backgroundColor: "transparent",
        color: theme.palette.text.primary,
        "& .react-svg svg path": {
          fill: theme.palette.text.primary,
        },
      },
    },
    "& .more-icon-btn": {
      color: theme.palette.text.primary,
    },
    "& .MuiTableCell-root": {
      backgroundColor: "transparent !important",
      borderTop: `1px solid ${theme.palette.divider} !important`,
      borderBottom: `1px solid ${theme.palette.divider} !important`,
      "&:first-of-type": {
        borderLeft: `1px solid ${theme.palette.divider} !important`,
      },
      "&:last-of-type": {
        borderRight: `1px solid ${theme.palette.divider} !important`,
      },
    },
  },
  '&.payment-row': {
    '.MuiTableCell-root': {
      backgroundColor: 'transparent',
      '.label': {
        color: theme.palette.text.primary,
        fontWeight: 700,
      }
    }
  },
  '&.payment-dialog-row': {
    svg: {
      width: 10,
      height: 10,
      path: {
        fill: theme.palette.text.primary
      }
    },
    '.ic-card': {
      svg: {
        width: 14,
        height: 14,

      },
    }
  }
}));
export default TableRowStyled;
