import { styled, Stack } from "@mui/material";
const AccessMenageStyled = styled(Stack)(({ theme }) => ({
  ".MuiToolbar-root": {
    backgroundColor: theme.palette.common.white,
  },
  ".MuiList-root": {
    padding: theme.spacing(0, 1),
    ".MuiListItem-root": {
      backgroundColor: theme.palette.common.white,
      borderRadius: theme.shape.borderRadius,
      "&:not(last-of-type)": {
        marginBottom: theme.spacing(1),
      },
    },
  },
}));
export default AccessMenageStyled;
