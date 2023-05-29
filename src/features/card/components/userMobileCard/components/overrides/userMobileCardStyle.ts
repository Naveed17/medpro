import { Card,styled } from "@mui/material";
const UserMobileCardStyled = styled(Card)(({theme}) => ({
    borderLeftStyle:'solid',    
    borderLeftWidth:'6px',
    borderRadius:'6px',
    '.MuiCardContent-root':{
        padding:theme.spacing(1),
        "&:last-child": {
            paddingBottom:theme.spacing(1),
        },
    },
    
}));

export default UserMobileCardStyled