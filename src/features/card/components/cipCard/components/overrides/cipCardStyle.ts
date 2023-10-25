import {styled} from '@mui/material/styles'
import {LoadingButton} from "@mui/lab";

const CipCardStyled = styled(LoadingButton)(({theme}) => ({
    scale: "0.9",
    marginRight: "1rem",
    padding: "6px 12px",
    backgroundColor: theme.palette.text.primary,
    '&:hover': {
        backgroundColor: theme.palette.text.primary,
        boxShadow: "none"
    },
    cursor: 'pointer',
    "& .MuiButtonBase-root": {
        // padding: "6px 0",
    },
    "& .MuiTypography-root": {
        //fontWeight: 100
    },
    ".MuiIconButton-root": {
        //color: theme.palette.grey[0]
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
        width: "120px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginLeft: "10px"
    },
    "& .round-avatar": {
        borderRadius: 20,
        border: `2px solid ${theme.palette.background.paper}`
    }
}));
export default CipCardStyled
