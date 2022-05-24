import { styled } from '@mui/material/styles';
import {Badge, BadgeProps} from "@mui/material";

const BadgeStyled = styled(Badge)<BadgeProps>(({ theme }) => ({
    padding: "0 10px",
    '& .MuiBadge-badge': {
        right: -3,
        top: 13,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '5px 4px',
    },
}));

export default BadgeStyled;
