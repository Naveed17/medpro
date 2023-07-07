import {styled} from "@mui/material/styles";
import {InputBase} from "@mui/material";
import {pxToRem} from "@themes/formatFontSize";

const InputBaseStyled = styled(InputBase)(({theme}) => ({
    border: "1px solid",
    height: 25,
    borderRadius: 5,
    backgroundColor:theme.palette.common.white,
    marginLeft: 5,
    marginRight: 5,
    maxWidth: 64,
    textAlign: "center",
    borderColor: theme.palette.grey["A600"],

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
