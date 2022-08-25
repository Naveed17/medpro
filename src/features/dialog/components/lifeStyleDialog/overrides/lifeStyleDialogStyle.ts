import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
const LifeStyleDialogStyled = styled(Stack)(({ theme }) => ({
    minWidth: 568,
    width: '100%',
    ".MuiFormGroup-root": {
        marginBottom: theme.spacing(1),
    },
    "@media (max-width: 768px)": {
        minWidth: 0,
    },
}));
export default LifeStyleDialogStyled;