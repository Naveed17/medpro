import {styled} from "@mui/material/styles";
import {Badge} from "@mui/material";
import {highlightedDays} from "@lib/hooks";

const BadgeStyled = styled(Badge)(({theme, ...props}: any) => ({
    "& .MuiBadge-badge": {
        color: theme.palette.grey[0],
        left: "2rem",
        top: 12,
        background: highlightedDays(props['data-events'], theme),
        padding: 10,
        marginLeft: "2rem",
        borderRadius: 20,
         "@media (max-width: 1100px)": {
        display:'none'
    },
    },
    
}))

export default BadgeStyled;
