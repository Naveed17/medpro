import { styled, Card } from "@mui/material";
const CardStyled = styled(Card)(({ theme }) => ({
  overflow:'visible',
  width: "100%",
  "&.row-collapse": {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
}));
export default CardStyled;