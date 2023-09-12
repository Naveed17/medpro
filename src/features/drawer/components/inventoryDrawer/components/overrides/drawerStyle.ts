import { Stack, styled } from "@mui/material";
const DrawerStyled = styled(Stack)(({ theme }) => ({
  ".drawer-header": {
    display: "flex",
    alignItems: "center",

    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "space-between",
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.common.white,
  },
}));
export default DrawerStyled;
