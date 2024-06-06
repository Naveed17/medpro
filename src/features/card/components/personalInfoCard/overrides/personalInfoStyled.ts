import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';

const PersonalInfoStyled = styled(Box)(({theme}) => ({
    
    "& .MuiPaper-root": {
        paddingTop: 0
    },
    '.required':{
        color: theme.palette.error.main
    }
}));

export default PersonalInfoStyled
