import { styled } from '@mui/material/styles';
import {Badge, BadgeProps} from "@mui/material";

const BadgeStyled = styled(Badge)<BadgeProps>(({ theme }) => ({
    paddingRight: "14px",
    '& .MuiBadge-badge': {
        top: 13,
        background: `${theme.palette.background.paper}`,
        color: `${theme.palette.text.primary}`
    },
}));

export default BadgeStyled;
