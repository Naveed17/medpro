import {styled} from "@mui/material/styles";
import {Box} from "@mui/material";

const PausedConsultationPopoverStyled = styled(Box)(({theme}) => ({
    height: "100%",
    pt: '.5rem',
    '& .MuiList-root': {
        height: 125,
        overflow: "auto"
    },
    '& .avatar-badge': {
        width: 20,
        height: 20,
        borderRadius: 20,
        border: `2px solid ${theme.palette.background.paper}`
    },
    "& .round-avatar": {
        width: 40,
        height: 40,
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
    }
}))
export default PausedConsultationPopoverStyled;
