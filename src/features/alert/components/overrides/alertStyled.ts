
import { styled } from '@mui/material/styles';
import { Alert } from '@mui/material';
const AlertStyled = styled(Alert)(({ theme }) => ({
    border: 'none',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(0.2, 1),
}));
export default AlertStyled;