import {styled} from "@mui/material/styles";
import {InputBase} from "@mui/material";
import {pxToRem} from "@themes/formatFontSize";

const InputBaseStyled = styled(InputBase)(({theme}) => ({
    border: "1px solid",
    height: pxToRem(30),
    borderRadius: 10,
    marginLeft: 5,
    marginRight: 5,
    maxWidth: 64,
    textAlign: "center",
    borderColor: theme.palette.divider,

    color: theme.palette.text.primary,
    "& .MuiOutlinedInput-root": {
        minHeight: "30px !important"
    },
    input: {
        textAlign: 'center',
        padding: theme.spacing(.3),
        "&::-webkit-outer-spin-button,&::-webkit-inner-spin-button": {
            margin: 0,
        }
    }
}));
export default InputBaseStyled;
