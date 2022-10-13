import { Card } from "@mui/material";
import { styled } from "@mui/material/styles";
const PaymentMobileCardStyled = styled(Card)(({ theme }) => ({
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
    }
}));
export default PaymentMobileCardStyled