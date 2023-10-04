import {styled} from '@mui/material/styles';
import {Card} from '@mui/material';
const ConsultationDetailCardStyled = styled(Card)(({theme}) => ({
    position: "relative",
    minHeight: '40rem',
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
    },
    ".btn-collapse": {
        backgroundColor: theme.palette.common.white,
        width: 35,
        height: 35,
        border: "1px solid #DDDDDD",
        borderRadius: 6,
        svg: {
            width: 16,
            height: 16,
        },
    },
    ".contentPreview": {
        borderRadius: 6,
        background: "#F9F9FB",
        padding: "1px 15px",
        border: "1px solid #bfbfc1"
    },
    ".preview":{
        color:'grey',
        margin: '7px 0'
    }
}));
export default ConsultationDetailCardStyled;