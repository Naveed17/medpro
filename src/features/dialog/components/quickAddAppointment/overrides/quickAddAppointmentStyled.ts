import {Stack} from "@mui/material";
import {styled} from "@mui/material/styles";

const QuickAddAppointmentStyled = styled(Stack)(({theme}) => ({
    height: 'calc(100% - 64px)',
    minWidth: "45vw",
    overflowY: 'scroll',
    padding: theme.spacing(3),
    background: theme.palette.common.white,
    '& .MuiAvatar-root': {
        width: 40,
        height: 40,
        marginRight: ".5rem"
    },
    "@media (max-width: 1024px)": {
        minWidth: 0,
    }
}));
export default QuickAddAppointmentStyled;
