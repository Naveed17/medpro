import { Stack, styled } from "@mui/material";
const RootStyled = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(0, 7),
  paddingTop: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    padding: 0,
  },
  ".permissions-wrapper": {
    ".MuiCard-root": {
      maxHeight: 350,
      overflowY: "auto",
    },
    ".main-list": {
      borderTop: "1px dashed #DBE1E4",
    },
    ".bold-label": {
      ".MuiFormControlLabel-label": {
        fontWeight: 700,
        fontSize: 14,
      },
    },
    ".MuiFormControlLabel-label": {
      fontSize: 14,
    },
    ".inside-list": {
      padding: 0,
      ".MuiListItem-root": {
        padding: theme.spacing(0, 1.5),
        backgroundColor: "#F8F8F8",
        borderLeft: "4px solid #E4E6EF",
      },
    },
    ".collapse-icon": {
      marginLeft: "auto",
      ".react-svg div": {
        lineHeight: 0,
      },
    },
    ".MuiCollapse-root": {
      marginLeft: theme.spacing(5),
    },
    ".inner-collapse": {
      marginBottom: 4,
    },
  },
}));
export default RootStyled;
