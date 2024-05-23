import { styled } from "@mui/material/styles";

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
      padding: "14px 8px",
    },
  },
  ".table-wrapper":{
    background: theme.palette.background.paper,
    borderRadius: "6px",
    padding: theme.spacing(2),
      ".MuiTable-stickyHeader":{
        paddingRight:0,
      },
  },
  ".MuiButtonGroup-root.rdv-type-group":{
    boxShadow:'none',
    button:{
       '&.btn-absent':{
      backgroundColor: theme.palette.error.light,
      borderColor: theme.palette.error.light,
    },
     '&.btn-confirm':{
      backgroundColor: theme.palette.success.light,
      borderColor: theme.palette.success.light,
    },
     '&.btn-waiting':{
      backgroundColor: theme.palette.warning.light,
      borderColor: theme.palette.warning.light,
    },
    '&.btn-complete':{
      backgroundColor: theme.palette.primary.light,
      borderColor: theme.palette.primary.light,
    },
      padding:theme.spacing(1),
      maxHeight:27,
      minHeight:20,
      span:{
      color: theme.palette.primary.dark,
      fontWeight: 500,
      }
    }
  }
}));
