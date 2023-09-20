import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';
const CIPPatientHistoryCardStyled = styled(Card)(({ theme }) => ({
    borderRadius:8,
    '& .card-header': {
        backgroundColor: theme.palette.text.secondary,
        padding: "5px 15px",
        '.MuiTypography-root': {
            color: theme.palette.common.white,
            svg: {
                path: {
                    fill: theme.palette.common.white
                }
            },
        },
        '& .react-svg': {
            marginRight: theme.spacing(1),
        }
    },
    '.MuiCardContent-root': {
        paddingBottom: theme.spacing(1)
    }
}));
export default CIPPatientHistoryCardStyled;
