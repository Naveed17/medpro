import {Stack} from "@mui/material";
import {styled} from "@mui/material/styles";

const QuickAddAppointmentStyled = styled(Stack)(({theme}) => ({
    height: '100vh',
    minWidth: "45vw",
    overflowY: 'scroll',
    background: theme.palette.common.white,
    '& .MuiAvatar-root': {
        //width: 40,
        //height: 40,
        // marginLeft: ".5rem"
    },
    ".MuiCardHeader-root":{
        ".MuiCardHeader-action":{
            alignSelf:'center'
        }
    },
    "@media (max-width: 1024px)": {
        minWidth: 0,
    }
}));
export default QuickAddAppointmentStyled;
