import { styled, Card } from "@mui/material";
const ActFeesCardStyled = styled(Card)(({ theme }) => ({
  ".MuiCardContent-root": {
    padding: theme.spacing(2) + "!important",
    ".MuiOutlinedInput-root input": {
      paddingLeft: theme.spacing(1),
      paddingRight: 0,
    },
  },
}));
export default ActFeesCardStyled;
