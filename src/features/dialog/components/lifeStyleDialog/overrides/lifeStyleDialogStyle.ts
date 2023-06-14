import {Stack} from "@mui/material";
import {styled} from "@mui/material/styles";

const LifeStyleDialogStyled = styled(Stack)(({theme}) => ({
    width: '100%',
    "&. li, ul": {
        marginTop: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
    },
    ".MuiFormGroup-root": {
        marginBottom: theme.spacing(1),
    },
    ".selected-ant": {
        border: "1px solid #bfbfc1",
        borderRadius: 8,
        padding: 15
    }
}));
export default LifeStyleDialogStyled;
