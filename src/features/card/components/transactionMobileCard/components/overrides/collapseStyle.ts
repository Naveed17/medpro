import { styled, Collapse } from "@mui/material";
const CollapseStyled = styled(Collapse)(({ theme }) => ({
  ".collapse-wrapper": {
    position: "relative",
    "&:before": {
      content: '""',
      position: "absolute",
      height: "calc(100% + 8px)",
      border: `1px dashed ${theme.palette.divider}`,
      left: -27,
      top: -70,
    },
    ".means-wrapper": {
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderTop: "none",
    },
    ".consultation-card": {
      position: "relative",
      overflow: "visible",
      "&:before": {
        content: '""',
        position: "absolute",
        width: 10,
        height: 10,
        borderRadius: "50%",
        backgroundColor: theme.palette.divider,
        left: -32,
        top: 20,
      },
      ".MuiCardContent-root": {
        "&:last-child": {
          padding: theme.spacing(2),
        },
      },
    },
  },
}));
export default CollapseStyled;
