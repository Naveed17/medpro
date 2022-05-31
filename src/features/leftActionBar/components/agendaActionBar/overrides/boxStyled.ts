import {styled} from "@mui/material/styles";
import {Box} from "@mui/material";

const BoxStyled = styled(Box)(({ theme }) => ({
    marginLeft: "-2.2rem",
    "& .MuiPickerStaticWrapper-root": {
        marginTop: "-.8rem",
    },
    '& .MuiCalendarPicker-root': {
        maxHeight: "-webkit-fill-available",
        padding: "5px 0",
        '& > [class^=css-]': {
            backgroundColor: '#FCFCFC',
            margin: "0 10px",
            maxHeight: 60,
            minHeight: 54
        },
        '& .MuiCalendarPicker-viewTransitionContainer':{
            overflow: 'hidden'
        },
        '& .PrivatePickersYear-root':{
            flexBasis: '33.33%'
        },
        '& .MuiIconButton-sizeSmall':{
            overflow: 'visible'
        }
    }
}));

export default BoxStyled;
