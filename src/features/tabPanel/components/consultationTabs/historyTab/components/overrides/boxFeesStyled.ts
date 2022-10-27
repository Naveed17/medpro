import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';

const BoxFees = styled(Box)(({theme}) => ({
    "& .header": {
        fontSize: 13,
        fontWeight: "bold"

    },
    "& .feesContent": {
        fontSize: 11,
        color: theme.palette.back.dark
    }
}));

export default BoxFees