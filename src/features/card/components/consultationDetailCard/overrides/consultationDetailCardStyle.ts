import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';
const ConsultationDetailCardStyled = styled(Card)(({ theme }) => ({
    '& .card-header': {
        '& .react-svg': {
            marginRight: theme.spacing(1),
            svg: {
                path: {
                    fill: theme.palette.text.primary,
                }
            }
        }
    },
    '.MuiCardContent-root': {
        padding: theme.spacing(1),
        '.MuiSelect-select': {
            backgroundColor: theme.palette.grey['A500'],
        }
    }
}));
export default ConsultationDetailCardStyled;