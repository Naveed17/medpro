import {Card} from '@mui/material'
import {styled} from '@mui/material/styles'

const CipCardStyled = styled(Card)(({theme}) => ({
    width: "100%",
    backgroundColor: theme.palette.text.primary,
    border: "none",
    borderRadius: 12,
    cursor: 'pointer',
    marginRight: "1rem",
    "& .MuiButtonBase-root": {
        padding: "6px 0",
    },
    "& .MuiTypography-root": {
        fontWeight: 100
    },
    ".MuiIconButton-root": {
        color: theme.palette.grey[0]
    },
    '.label': {
        [theme.breakpoints.down("md")]: {
            display: 'none'
        }
    },
    "& .timer-card": {
        width: "66px"
    },
    "& .timer-text": {
        width: " 100px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginLeft: "4px"
    },
    "& .tick-flip-panel": {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.paper
    }
}));
export default CipCardStyled
