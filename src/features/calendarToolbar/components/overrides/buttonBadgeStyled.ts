import { styled } from '@mui/material/styles';
import { Button, ButtonProps} from "@mui/material";

const ButtonBadgeStyled = styled(Button)<ButtonProps>(({ theme }) => ({
    padding: ".5rem .5rem",
    minWidth: "46px",
    '& .MuiBadge-badge': {
        backgroundColor: "transparent"
    }
}));

export default ButtonBadgeStyled;
