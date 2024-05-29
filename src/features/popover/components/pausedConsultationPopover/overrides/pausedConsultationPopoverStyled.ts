import {styled} from "@mui/material/styles";
import {Box} from "@mui/material";

const PausedConsultationPopoverStyled = styled(Box)(({theme}) => ({
    height: "100%",
    pt: '.5rem',
    '& .MuiList-root': {
        marginTop: "-1rem",
        height: "100%",
        overflow: "auto"
    },
    '& .MuiListItem-root': {
        padding: "10px 0 0 10px"
    },
    '& .avatar-badge': {
        width: 16,
        height: 16,
        borderRadius: 20,
        border: `2px solid ${theme.palette.background.paper}`
    },
    "& .round-avatar": {
        width: 36,
        height: 36,
        borderRadius: 20,
        border: `2px solid ${theme.palette.background.paper}`
    },
    "& .tab-item": {
        fontSize: "18px",
        fontWeight: 600
    },
    '& .MuiTabs-indicator': {
        backgroundColor: theme.palette.text.primary,
    },
    "& .tab-item.Mui-selected": {
        color: theme.palette.text.primary
    },
    ".MuiToolbar-root": {
        minHeight: 48,
        paddingLeft: 0,
        paddingRight: theme.spacing(2)
    },
    ".btn-next-appointment": {
        justifyContent: 'flex-start',
        '.avatar-ic-next': {
            width: 16,
            height: 16
        },
        ".avatar-close": {
            margin: 0,
            marginLeft: 'auto'
        }
    },
    "& .user-name": {
        cursor: "pointer",
        fontSize: 12,
    },
    "& .avatar-button": {
        width: 36,
        height: 36,
        borderRadius: 20,
        mr: 3,
        cursor: "pointer",
        border: `2px solid ${theme.palette.background.paper}`,
        "& .MuiAvatar-img": {
            width: 20,
            height: 20
        }
    }
}))
export default PausedConsultationPopoverStyled;
