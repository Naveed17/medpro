import {Card} from '@mui/material';
import {styled} from '@mui/material/styles';

const PanelStyled = styled(Card)(({theme}) => ({
    border:'none',
    ".btn-collapse":{
        border:`1px solid ${theme.palette.divider}`,
        borderRadius:10,
        padding:4,
    }
}));
export default PanelStyled
