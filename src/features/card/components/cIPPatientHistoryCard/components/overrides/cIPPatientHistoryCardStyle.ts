import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';
const CIPPatientHistoryCardStyled = styled(Card)(({ theme }) => ({
    '& .card-header': {
        '& .react-svg': {
            marginRight: theme.spacing(1),
        }
    },
}));
export default CIPPatientHistoryCardStyled;