import {styled} from '@mui/material/styles'
import {Card} from "@mui/material";

const CipCardStyled = styled(Card)(({theme}) => ({
    scale: "0.9",
    marginRight: 0,
    padding: "6px 12px",
    borderRadius: 10,
    backgroundColor: theme.palette.text.primary,
    '&:hover': {
        backgroundColor: theme.palette.text.primary,
        boxShadow: "none"
    },
    cursor: 'pointer',
    '.label': {
        [theme.breakpoints.down("md")]: {
            display: 'none'
        }
    },
    "& .timer-card": {
        width: "66px"
    },
    "& .timer-text": {
        textAlign: "left",
        maxWidth: "200px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginLeft: "4px"
    },
    "& .round-avatar": {
        borderRadius: 20,
        border: `2px solid ${theme.palette.background.paper}`
    },
    "& .cip-avatar-mobile": {
        marginLeft: 0
    }
}));
export default CipCardStyled
