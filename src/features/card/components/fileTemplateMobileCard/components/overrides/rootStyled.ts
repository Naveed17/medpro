import { Card } from "@mui/material";
import { styled } from "@mui/material/styles";

const RootStyled = styled(Card)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  borderLeftWidth: 0,
  position: "relative",
  borderRadius: 6,
  "&:before": {
    content: '""',
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
  },
}));

export default RootStyled;
