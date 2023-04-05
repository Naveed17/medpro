import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
const LifeStyleDialogStyled = styled(Stack)(({ theme }) => ({
    width: '100%',
    ".MuiFormGroup-root": {
        marginBottom: theme.spacing(1),
    },
    ".selected-ant":{
        border: "1px solid #bfbfc1",
        borderRadius: 8,
        padding: "15px 15px 0"
    }
}));
export default LifeStyleDialogStyled;