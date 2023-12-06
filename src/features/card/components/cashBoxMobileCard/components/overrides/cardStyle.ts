import { Card,styled } from '@mui/material';
const StyledCard = styled(Card)(({ theme }) => ({
".MuiCardContent-root":{
    padding:theme.spacing(1),
    "&:last-child":{
        paddingBottom:theme.spacing(1)
    }
}
}));

export default StyledCard;