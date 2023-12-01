import {styled} from "@mui/material/styles";
import {Badge} from "@mui/material";
import {highlightedDays} from "@lib/hooks";

const BadgeStyled = styled(Badge)(({theme, ...props}: any) => ({
    "& .MuiBadge-badge": {
        color: theme.palette.grey[0],
        left: "2rem",
        top: 12,
        background: highlightedDays(props['data-events'], theme),
        padding: 14,
        marginLeft: "2rem",
        borderRadius: 20
    }
}))

export default BadgeStyled;
