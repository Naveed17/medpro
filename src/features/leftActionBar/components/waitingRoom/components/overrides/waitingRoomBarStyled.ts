import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
const RootStyled = styled(Box)(({ theme }) => ({
    margin: '-10px 0px -10px -20px',
    '& .MuiListItem-root': {
        '& .MuiListItemText-root': {
            '& .MuiTypography-root': {
                fontSize: theme.typography.body2.fontSize,
            }
        }
    }

}));
export default RootStyled;