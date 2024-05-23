import { FormControl, styled } from "@mui/material";
const InputActionStyled = styled(FormControl)(({theme}) =>({
       ".MuiInputAdornment-root":{
        height:'100%',
        maxHeight:'100%',
        ".end-adornment":{
            borderTopRightRadius:theme.shape.borderRadius,
            borderBottomRightRadius:theme.shape.borderRadius,
            borderLeft: `1px solid ${theme.palette.grey[100]}`,
            backgroundColor:theme.palette.back.main,
            marginRight:-14
        },
        ".start-adornment":{
            borderTopLeftRadius:theme.shape.borderRadius,
            borderBottomLeftRadius:theme.shape.borderRadius,
            borderRight: `1px solid ${theme.palette.grey[100]}`,
            backgroundColor:theme.palette.back.main,
            marginLeft:-14
        }
       }
}));
export default InputActionStyled;