import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';
import {pxToRem} from "@themes/formatFontSize";

const ListItemDetailsStyled = styled(Box)(({theme}) => ({
    "& .MuiOutlinedInput-root": {
        minHeight: "30px !important"
    },
    "& .boxHisto": {
        background: theme.palette.back.main,
        marginBottom: 5,
        borderRadius: pxToRem(4),
        padding: "4px 8px"
    },
    "& .treamtementDetail": {
        fontSize: 12,
        color: theme.palette.back.dark,
    },
    "& .empty": {
        fontSize: 12,
        color: theme.palette.back.dark,
        textAlign: "center"
    },
    "input": {
        textAlign: 'center',
        borderRadius: 10,
        fontSize: 12,
        width: 50,
        height: 10,
        padding: 0
    },
    ".docGrid": {
        background: theme.palette.back.main,
        marginBottom: 1,
        paddingRight: 20,
        paddingBottom: 20,
        borderRadius: 10,
    }

}));

export default ListItemDetailsStyled