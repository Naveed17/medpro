import { styled } from "@mui/material/styles";
import {Box} from "@mui/material";

const PatientDetailStyled = styled(Box)(({ theme }) => ({
    ".container":{
        bgcolor: "background.default",
        "& div[role='tabpanel']": {
            height: {md: "calc(100vh - 284px)", xs: "auto"},
            overflowY: "auto",
        },
    }
}));
export default PatientDetailStyled;
