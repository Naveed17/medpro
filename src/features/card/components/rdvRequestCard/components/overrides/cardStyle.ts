import {styled,Card} from '@mui/material';
const CardStyled = styled(Card)(({theme})=>({
    ".MuiCardContent-root":{
        padding:theme.spacing(1),
        "&.MuiCardContent-root":{
        "&:last-child":{
             paddingBottom:theme.spacing(1),
        }
    },
    ".card-actions":{
        button:{
            borderRadius:10,
            padding:theme.spacing(.795),
        '&.btn-close':{
            backgroundColor:"transparent",
            border:`1px solid ${theme.palette.divider}`,
            svg:{
                path:{
                    fill:theme.palette.text.primary,
                }
            }

        }
    }
    }
    }
}));
export default CardStyled;