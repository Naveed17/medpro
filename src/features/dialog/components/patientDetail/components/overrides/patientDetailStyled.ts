import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

const PatientDetailStyled = styled(Box)(({ theme }) => ({
    ".container": {
        backgroundColor: theme.palette.background.default,
        "& div[role='tabpanel']": {
            height: { md: "calc(100vh - 284px)", xs: "auto" },
            overflowY: "auto",
            "& .container": {
                marginBottom: "6rem"
            }
        },
    }
}));
export default PatientDetailStyled;
