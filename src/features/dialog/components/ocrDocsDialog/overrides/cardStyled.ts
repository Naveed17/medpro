import {styled} from "@mui/material/styles";
import {Card} from "@mui/material";

const CardStyled = styled(Card)(({theme}) => ({
    borderRadius: "12px",
    border: "none",
    boxShadow: theme.shadows[5],
    "& .MuiCardContent-root": {
        minHeight: '65px',
        padding: "12px"
    },
    "& .MuiCardContent-root:last-child": {
        paddingBottom: "12px"
    },
    '& .btn-list-action': {
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "8px",
        padding: "6px"
    },
    '& .MuiIconButton-root': {
        marginLeft: 'auto'
    }
}))

export default CardStyled;
