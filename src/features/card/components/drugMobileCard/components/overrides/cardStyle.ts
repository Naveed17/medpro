import {styled,Card} from '@mui/material'
const CardStyled = styled(Card)(({theme}) => ({
    ".row":{
        display:'grid',
        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
        gap:theme.spacing(1)
    }
}));
export default CardStyled;