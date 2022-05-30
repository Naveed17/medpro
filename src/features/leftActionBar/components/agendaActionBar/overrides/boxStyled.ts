import {styled} from "@mui/material/styles";
import {Box} from "@mui/material";

const BoxStyled = styled(Box)(({ theme }) => ({
    ml: -2.5,
    '& .MuiCalendarPicker-root': {
        maxHeight: 300,
        '& > [class^=css-]': {
            backgroundColor: '#FCFCFC',
            margin: 0,
            mt: -1.2,
            maxHeight: 60,
            minHeight: 54
        },
        '& .MuiCalendarPicker-viewTransitionContainer':
            {overflow: 'hidden'}
    }
}));

export default BoxStyled;
