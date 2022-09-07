import {Card} from '@mui/material'
import {styled} from '@mui/material/styles'

const CipCardStyled = styled(Card)(({theme}) => ({
    backgroundColor: theme.palette.text.primary,
    cursor: 'pointer',
    marginRight: "1rem",
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
        textOverflow: "ellipsis"
    }
}));
export default CipCardStyled
