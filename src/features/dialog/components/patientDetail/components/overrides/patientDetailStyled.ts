import {styled} from "@mui/material/styles";
import {Stack} from "@mui/material";

const PatientDetailStyled = styled(Stack)(({theme}) => ({
    backgroundColor: theme.palette.background.default,
    ".container": {
        backgroundColor: theme.palette.background.default,
        "& div[role='tabpanel']": {
            height: {md: "calc(100vh - 284px)", xs: "auto"},
            overflowY: "auto",
            "& .container": {
                marginBottom: "6rem"
            }
        }
    }
}));
export default PatientDetailStyled;
