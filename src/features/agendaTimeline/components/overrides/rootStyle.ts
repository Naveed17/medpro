import {Stack,styled} from '@mui/material';
const RootStyled = styled(Stack)(({theme}) => ({
    ".MuiList-root":{
        position:'relative',
        "&::before":{
            content:"''",
            position:'absolute',
            top:theme.spacing(4),
            left:theme.spacing(2),
            borderLeft: `1px dashed ${theme.palette.divider}`,
            height:'calc(100% - 80px)',
        }
    }
}));
export default RootStyled;