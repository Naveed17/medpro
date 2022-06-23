import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
const WaitingRoomStyled = styled(Box)(({ theme }) => ({
    margin: '-10px 0px -10px -20px',
    [theme.breakpoints.down('sm')]: {
        margin: '0px -16px 0px -16px'
    },
    '& .MuiListItem-root': {
        '& .MuiListItemText-root': {
            '& .MuiTypography-root': {
                fontSize: theme.typography.body2.fontSize,
            }
        }
    }

}));
export default WaitingRoomStyled;