import {styled} from '@mui/material/styles'
import {LoadingButton} from "@mui/lab";

const CipCard2ndStyled = styled(LoadingButton)(({theme}) => ({
    justifyContent:'flex-start',
    marginRight: 0,
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
        textAlign: "left",
        width: "120px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginLeft: "4px"
    },
    "& .round-avatar": {
        borderRadius: 20,
        border: `2px solid ${theme.palette.background.paper}`
    },
    ".ic-avatar":{
        width:16,
        height:16,
        svg:{
            width:16,
            height:16,
            position:'relative',
            
            path:{
                fill:theme.palette.text.primary
            }
        }
    },
    '.action-buttons':{
        '.MuiAvatar-root':{
            width:20,
            height:20,
            marginLeft:0,
            ".MuiAvatar-root":{
                margin:0
            },
            "&.avatar-top":{
                padding:14,
            }
        },
        '&.action-buttons':{
            marginLeft:'auto'
        },
    },
    ".patient-avatar":{
        marginLeft:0
    },
    '.MuiButton-startIcon':{
marginLeft:0,
    }
}));
export default CipCard2ndStyled
