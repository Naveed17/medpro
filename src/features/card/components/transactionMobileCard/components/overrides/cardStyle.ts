import { styled, Card } from "@mui/material";
const CardStyled = styled(Card)(({ theme }) => ({
  overflow: "visible",
  width: "100%",
  position: "relative",
  "&:before": {
    content: "url(/static/icons/bill-list.svg)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
    width: 40,
    height: 40,
    transform: "scale(.8)",
    borderRadius: "50%",
    backgroundColor: theme.palette.divider,
    position: "absolute",
    left: -47,
    border: `1px solid ${theme.palette.divider}`,
  },

  "&.row-collapse": {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    "&:before": {
      content: "url(/static/icons/bill-list-sec.svg)",
      backgroundColor: theme.palette.common.white,
    },
  },
}));
export default CardStyled;
