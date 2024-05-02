import {Timeline} from '@mui/lab';
import {styled} from '@mui/material';
const CardStyled =  styled(Timeline)(({theme}) => ({
    ".MuiTimelineContent-root":{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        marginLeft:theme.spacing(1),
        padding:theme.spacing(2)
    },
   
}));
export default CardStyled;