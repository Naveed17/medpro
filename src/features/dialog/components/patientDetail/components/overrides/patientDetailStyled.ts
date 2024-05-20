import {alpha, styled} from "@mui/material/styles";
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
    },
    "& .MuiBackdrop-root": {
        zIndex: 114,
        backgroundColor: alpha(theme.palette.common.white, 0.9)
    }
}));

export default PatientDetailStyled;
