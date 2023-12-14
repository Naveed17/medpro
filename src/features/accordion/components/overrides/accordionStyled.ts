import {styled} from "@mui/material/styles";
import MuiAccordion from "@mui/material/Accordion";

const RootStyled = styled(MuiAccordion)(({theme}) => ({
    "& .MuiAccordionSummary-content": {
        p: {
            color: theme.palette.text.primary,
            fontWeight: 600,
            fontSize: 14,
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
        paddingRight: theme.spacing(1.5),
    },
}));
export default RootStyled;
