import {Box} from "@mui/material";
import {styled} from "@mui/material/styles";

const PaymentFeesPopoverStyled = styled(Box)(({theme}) => ({
    width: '100%',
    minWidth: 400,
    padding: "0 1rem",
    backgroundColor: theme.palette.background.paper
}));

export default PaymentFeesPopoverStyled;
