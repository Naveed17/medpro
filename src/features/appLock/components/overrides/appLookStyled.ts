import {styled} from '@mui/material/styles';
import {alpha, Paper} from "@mui/material";

const AppLookStyled = styled(Paper)(({theme}) => ({
    backgroundColor: alpha(theme.palette.common.white, 0.67),
    backdropFilter: "blur(14px)",
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 99,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& p': {
        marginBottom: `${theme.spacing(5)} !important`,
    },
    '& .MuiOutlinedInput-input': {
        textAlign: 'center',
        backgroundColor: '#fff',
        fontSize: '1.35rem',
        '&::placeholder': {
            fontSize: 12,
        }
    }
}));

export default AppLookStyled;
