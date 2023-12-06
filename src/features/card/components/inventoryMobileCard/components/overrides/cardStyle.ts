import { Card, styled } from "@mui/material";
const CardStyled = styled(Card)(({ theme }) => ({
  ".MuiCardContent-root": {
    "&:last-child": {
      paddingBottom: theme.spacing(2),
    },
  },
}));
export default CardStyled;
