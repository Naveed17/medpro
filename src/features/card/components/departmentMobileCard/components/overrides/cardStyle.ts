import {styled,Card} from '@mui/material'
const CardStyled = styled(Card)(({theme}) => ({
    ".btn-edit": {
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 8,
        padding: theme.spacing(1),
    },
    ".row":{
        display:'grid',
        gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))",
        gap:theme.spacing(2)
    }
}));
export default CardStyled;
