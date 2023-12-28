import {styled} from "@mui/material/styles";
import {Stack} from "@mui/material";

const SwitchConsultationDialogStyled = styled(Stack)(({theme}) => ({
    '.counter-btn': {
        padding: theme.spacing(1),
        alignSelf: 'flex-start',
        backgroundColor: theme.palette.grey["A10"],
        color: "black",
        minHeight: 50,
        border: 0,
        width: "100%",
        justifyContent: "flex-start",
        '.MuiCheckbox-root': {
            width: 20,
            height: 20,
            marginRight: theme.spacing(1)
        },
        '.MuiInputBase-root': {
            width: 100,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.common.white,
            borderRadius: 4,
            paddingLeft: theme.spacing(.7),
            paddingRight: theme.spacing(.7),
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            ".MuiInputBase-input": {
                textAlign: 'center'
            }
        },
        '.MuiIconButton-root': {
            borderRadius: 4,
            padding: 2,
            backgroundColor: theme.palette.grey["A600"],
            svg: {
                width: 14,
                height: 14
            }
        },
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            flexDirection: 'column'
        }
    }
}));
export default SwitchConsultationDialogStyled;
