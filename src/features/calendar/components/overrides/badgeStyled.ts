import {styled} from "@mui/material/styles";
import {Badge} from "@mui/material";
import {highlightedDays} from "@lib/hooks";

const BadgeStyled = styled(Badge)(({theme, ...props}: any) => ({
    "& .MuiBadge-badge": {
        color: theme.palette.grey[0],
        left: "2rem",
        top: 12,
        background: highlightedDays(props['data-events'], theme),
        padding: '0 4px',
        marginLeft: "2rem"

    }
}))

export default BadgeStyled;
