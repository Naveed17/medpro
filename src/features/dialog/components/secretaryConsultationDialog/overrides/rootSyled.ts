import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
const RootStyled = styled(Stack)(({ theme }) => ({
    overflow: 'hidden',
    width: "100%",
    minWidth: 1028,
    paddingBottom: theme.spacing(2),
    '.counter-btn':{
        padding:theme.spacing(1),
        alignSelf:'flex-start',
        minHeight:50,
        '.MuiCheckbox-root':{
            width:20,
            height:20,
            marginRight:theme.spacing(1)
        },
        '.MuiInputBase-root':{
            width:100,
            border:`1px solid ${theme.palette.divider}`,
            backgroundColor:theme.palette.common.white,
            borderRadius:4,
            paddingLeft:theme.spacing(.7),
            paddingRight:theme.spacing(.7),
            marginLeft:theme.spacing(1),
            marginRight:theme.spacing(1),
            ".MuiInputBase-input":{
                textAlign:'center'
            }
        },
        '.MuiIconButton-root':{
            borderRadius:4,
            padding:2,
            backgroundColor:theme.palette.grey["A600"],
            svg:{
                width:14,
                height:14
            }
        }
    },
    '.MuiInputAdornment-root': {
        alignSelf: 'flex-end'
    },
    
    "@media (max-width: 1024px)": {
        minWidth: 0,
    },
}));
export default RootStyled;
