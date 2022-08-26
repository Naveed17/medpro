import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
const SurgicalHistoryDialogStyled = styled(Stack)(({ theme }) => ({
    padding: theme.spacing(3, 0),
    minWidth: 568,
    width: '100%',
    ".MuiFormGroup-root": {
        marginBottom: theme.spacing(1),
    },
    "@media (max-width: 768px)": {
        minWidth: 0,
    },
}));
export default SurgicalHistoryDialogStyled;