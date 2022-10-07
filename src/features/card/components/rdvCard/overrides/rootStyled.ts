import { styled } from "@mui/material/styles";
import { TableRow } from "@mui/material";
const RootStyled = styled(TableRow)(({ theme }) => ({
  '.date-time': {
    svg: {
      width: theme.spacing(1.5),
      path: {
        fill: theme.palette.text.primary
      }
    }
  }
}));
export default RootStyled;
