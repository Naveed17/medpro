import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';

const BoxFees = styled(Box)(({theme}) => ({
    paddingLeft:10,
    paddingRight:10,
    paddingTop: 5,
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