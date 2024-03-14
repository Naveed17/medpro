import {styled,Card}from '@mui/material';
export const StyledCard = styled(Card)(({theme})=>({
    width:'100%',
    ".MuiCardContent-root":{
        padding:theme.spacing(1),
        "&:last-child":{
            paddingBottom:theme.spacing(1)
        }
    }
}));
