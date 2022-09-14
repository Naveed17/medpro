import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
const WaitingRoomStyled = styled(Box)(({ theme }) => ({
    margin: '-10px 0px -10px -20px',
    [theme.breakpoints.down('md')]: {
        margin: '0px -16px 0px -16px'
    }
}));
export default WaitingRoomStyled;
