import {styled} from '@mui/material/styles';
import {Card} from '@mui/material';

const CIPPatientHistoryCardStyled = styled(Card)(({theme}) => ({
    borderRadius: 8,
    '& .card-header': {
        backgroundColor: theme.palette.text.secondary,
        minHeight: 44,
        padding: "5px 12px",
        '.MuiTypography-root': {
            color: theme.palette.common.white,
            svg: {
                path: {
                    fill: theme.palette.common.white
                }
            },
        },
    },
    '.MuiCardContent-root': {
        paddingBottom: theme.spacing(1)
    }
}));
export default CIPPatientHistoryCardStyled;
