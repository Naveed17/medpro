import { Card } from "@mui/material";
import { styled } from "@mui/material/styles";
const PaymentMobileCardStyled = styled(Card)(({ theme }) => ({
    position:'relative',
    a: {
        cursor: 'pointer',
        fontFamily: 'Poppins-Medium',
        display: 'block'
    },
    '.date-time': {
        '.react-svg svg': {
            width: theme.spacing(1.5),
            path: {
                fill: theme.palette.text.primary
            }
        }
    },
    '.insurrence': {
        '.react-svg svg': {
            width: theme.spacing(1.5),
            path: {
                fill: theme.palette.text.primary
            }
        }
    },
    '.ic-card': {
        svg: {
            path: {
                fill: theme.palette.text.primary
            }
        }
    },
    ".MuiCardContent-root:last-child":{
        paddingBottom: theme.spacing(2),
    ".MuiButtonBase-root":{
        position:'absolute',
        right:0,
        top:'50%',
        transform:'translateY(-50%)',
        marginTop:0
    }

    }
}));
export default PaymentMobileCardStyled