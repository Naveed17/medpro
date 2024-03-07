import {styled,Card} from '@mui/material'
const CardStyled = styled(Card)(({theme}) => ({
    ".row":{
        display:'grid',
        gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))",
        gap:theme.spacing(2)
    }
}));
export default CardStyled;