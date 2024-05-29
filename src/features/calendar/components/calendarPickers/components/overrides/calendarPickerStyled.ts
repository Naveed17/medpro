import {styled} from "@mui/material/styles";
import {Box} from "@mui/material";

const CalendarPickerStyled = styled(Box)(({theme}) => ({
    "& .MuiCalendarPicker-root": {
        overflow: "hidden"
    },
    "& .MuiTypography-caption": {
        color: theme.palette.primary.main,
    },
    "& .MuiPickersCalendarHeader-label": {
        textTransform: "capitalize"
    },
    "& .MuiPickersLayout-root": {
        minWidth: "auto"
    },
    "& .MuiDateCalendar-root, .MuiYearCalendar-root": {
        width: "auto",
        maxHeight: 350,
        height: "auto"
    },
    "& .MuiDayCalendar-root, .MuiPickersLayout-root": {
        height: 350
    }, "& .MuiDayCalendar-slideTransition": {
        height: 'inherit'
    },
    "& .MuiPickersYear-root": {
        flexBasis: "33%"
    },
    "& .MuiPickerStaticWrapper-root, .MuiPickersLayout-contentWrapper": {
        backgroundColor: "transparent",
        minWidth: "auto",
        "& > div > div": {
            backgroundColor: theme.palette.background.paper,
        },
    },
    "& .MuiPickersDay-root": {
        margin: 2.5,
        borderRadius: "8px",
        "&.MuiPickersDay-today": {
            border: `1px solid ${theme.palette.warning.main}`,
        },
        "&.Mui-selected": {
            border: `1px solid ${theme.palette.warning.main}`,
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.warning.main,
            borderRadius: "8px",
            "&:hover, &:focus": {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.warning.main,
            },
            "&.Mui-disabled": {
                color: theme.palette.text.primary,
            },
        },
        "&:hover, &:focus": {
            backgroundColor: theme.palette.grey["A700"],
        },
        "&.Mui-disabled": {
            color: theme.palette.divider,
        },
    },
    "& .MuiCalendarPicker-root > div:first-of-type": {
        position: "relative",
        boxShadow: theme.customShadows.calendarPicker,
        backgroundColor: theme.palette.grey["A800"],
        overflow: "hidden",
        minHeight: 62,
        marginBottom: 0,
        marginTop: 0,
        "& .MuiIconButton-edgeEnd": {
            position: "absolute",
            left: 10,
            top: 16,
            color: theme.palette.grey[300],
        },
        "& .MuiIconButton-edgeStart": {
            position: "absolute",
            right: 10,
            top: 16,
            color: theme.palette.grey[300],
        },
        "& > div:first-of-type": {
            fontSize: "1.25rem",
            margin: "0 auto",
            button: {
                display: "none",
            },
        },
        "& > div:last-child": {
            width: 0,
        },
    },
    "& .PrivatePickersSlideTransition-root": {
        minHeight: 250,
    },
}));

export default CalendarPickerStyled;
