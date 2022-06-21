import { styled } from "@mui/material/styles";
import MuiAccordion from "@mui/material/Accordion";

const RootStyled = styled(MuiAccordion)(({ theme }) => ({
  "& .MuiAccordionSummary-content": {
    p: {
      color: theme.palette.text.secondary,
      fontSize: 16,
    },
    "& .react-svg": {
      svg: {
        width: 16,
        height: 16,
        marginTop: 1,
      },
    },
  },
  "& .MuiAccordionDetails-root": {
    paddingTop: theme.spacing(1),
  },
}));
export default RootStyled;
