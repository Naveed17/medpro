import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import {breakpoints} from "@mui/system";

const BoxStyled = styled(Box)(({ theme }) => ({
    [theme.breakpoints.up('sm')]: {
        marginLeft: "-20px",
        "& .MuiPickerStaticWrapper-root": {
            marginLeft: "-.8rem",
            '& > [class^=css-]': {
                marginLeft: "-.6rem"
            }
        },
    },
    "& .MuiPickerStaticWrapper-root": {
        marginTop: "-.8rem",
    },
    '& .MuiCalendarPicker-root': {
        maxHeight: "-webkit-fill-available",
        padding: "5px 0",
        '& [role="presentation"]':{
            fontWeight: 400
        },
        '& > [class^=css-]': {
            backgroundColor: theme.palette.grey["A800"],
            margin: "0 10px",
            maxHeight: 60,
            minHeight: 54
        }, '& > [class^=muirtl-]': {
            backgroundColor: theme.palette.grey["A800"],
            margin: "0 10px",
            maxHeight: 60,
            minHeight: 54
        },
        '& .MuiCalendarPicker-viewTransitionContainer': {
            overflow: 'hidden'
        },
        '& .PrivatePickersYear-root': {
            flexBasis: '33.33%'
        },
        '& .MuiIconButton-sizeSmall': {
            overflow: 'visible'
        }
    }
}));

export default BoxStyled;
