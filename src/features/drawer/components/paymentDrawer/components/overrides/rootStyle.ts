import { Paper, styled, alpha } from "@mui/material";
const RootStyled = styled(Paper)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.warning.main, 0.2),
  height: "100%",
  border: "none",
  ".MuiCard-root": {
    border: "none",
    ".MuiCardContent-root": {
      padding: theme.spacing(1),
      "&:last-child": {
        paddingBottom: theme.spacing(1),
      },
    },
    ".MuiListItem-root": {
      justifyContent: "space-between",
      borderTop: `1.5px solid ${theme.palette.divider}`,
    },
  },
  ".btn-group": {
    button: {
      minWidth: theme.spacing(4),
      fontSize: 14,
    },
  },
}));
export default RootStyled;
