import {Stack} from "@mui/material";
import {styled} from "@mui/material/styles";

const QuickAddAppointmentStyled = styled(Stack)(({theme}) => ({
    height: '100vh',
    minWidth: "45vw",
    overflowY: 'scroll',
    padding: theme.spacing(3),
    background: theme.palette.common.white,
    '& .MuiAvatar-root': {
        //width: 40,
        //height: 40,
        // marginLeft: ".5rem"
    },
    ".MuiCardHeader-root":{
        padding:0,
        paddingBottom:theme.spacing(2),
        ".MuiCardHeader-action":{
            alignSelf:'center'
        }
    },
    "@media (max-width: 1024px)": {
        minWidth: 0,
    }
}));
export default QuickAddAppointmentStyled;
