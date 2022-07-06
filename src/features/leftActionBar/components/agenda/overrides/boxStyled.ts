import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

const BoxStyled = styled(Box)(({ theme }) => ({
    marginLeft: "-20px",
    "& .MuiPickerStaticWrapper-root": {
        marginTop: "-.8rem",
        marginLeft: "-.8rem",
        '& > [class^=css-]': {
            marginLeft: "-.6rem"
        }, '& > [class^=muirtl-]': {
        },
    },
    '& .MuiCalendarPicker-root': {
        maxHeight: "-webkit-fill-available",
        padding: "5px 0",
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
