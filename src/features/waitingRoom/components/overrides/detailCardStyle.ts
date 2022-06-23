import { styled } from "@mui/material/styles";
import { Card } from "@mui/material";
const DetailCardStyled = styled(Card)(({ theme }) => ({
    border: "1px solid #eee",
    margin: 0,
    overflow: "visible",
    padding: theme.spacing(1, 1.5),
    '&:not(style)+:not(style)': {
        marginLeft: '0 !important',
    }
}));
export default DetailCardStyled;
