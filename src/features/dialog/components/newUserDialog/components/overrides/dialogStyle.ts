import { Stack,styled } from "@mui/material";
const DialogStyled = styled(Stack)(({ theme }) => ({
    ".dialog-action":{
        justifyContent:"space-between",
        borderTop:`1px solid ${theme.palette.primary.main}`
    }
}));
export default DialogStyled;