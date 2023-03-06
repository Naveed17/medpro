import { Paper, styled, alpha } from "@mui/material";
const AppointHistoryContainerStyled = styled(Paper)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.warning.main, 0.2),
  border: `2px solid ${theme.palette.warning.main}`,
  borderRadius: 0,
  ".MuiToolbar-root": {
    backgroundColor: theme.palette.warning.main,
    minHeight: theme.spacing(4),
    padding: 4,
    paddingLeft: theme.spacing(1.3),
    paddingRight: theme.spacing(1.3),
    ".btn-action": {
      backgroundColor: theme.palette.warning.lighter,
      color: theme.palette.text.primary,
      boxShadow: "0px 0px 16px rgba(0, 0, 0, 0.2);",
      fontSize: 14,
      svg: {
        path: {
          fill: theme.palette.text.primary,
        },
      },
    },
  },
  ".MuiContainer-root": {
    padding: theme.spacing(2),
  },
}));
export default AppointHistoryContainerStyled;
