import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
const LifeStyleDialogStyled = styled(Stack)(({ theme }) => ({
    width: '100%',
    ".MuiFormGroup-root": {
        marginBottom: theme.spacing(1),
    },
}));
export default LifeStyleDialogStyled;