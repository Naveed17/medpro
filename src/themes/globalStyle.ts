import {styled} from "@mui/material/styles";

export const GlobleStyles = styled("div")(({ theme }) => ({
  "& svg[class*='muirtl-']": {
    // transform: "scaleX(-1)",
  },
  ".sidenav-main": {
    "& .MuiListItem-root": {
      padding: 0,
      alignItems: "center",
      "& .MuiListItemIcon-root": {
        minWidth: 0,
      },
    },
  },
  ".patient-config-list": {
    "& .MuiListItem-root": {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: "0px 10px 10px 0px",
      borderLeft: `4px solid ${theme.palette.warning.main}`,
      padding: "8px",
      paddingLeft: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    "& .MuiIconButton-root": {
      width: "25px",
      height: "25px",
      "& svg": {
        width: "11px",
        height: "11px",
      },
    },
  },
  ".container": {
    padding: theme.spacing(2),
    [theme.breakpoints.down("md")]: {
      padding: "30px 8px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "40px 8px",
    },
  },
}));
