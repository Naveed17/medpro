import { styled } from '@mui/material/styles';
import { Box } from "@mui/material";

const CalendarPickerStyled = styled(Box)(({ theme }) => ({
    "& .MuiTypography-caption": {
        color: theme.palette.primary.main,
    },
    "& .MuiPickerStaticWrapper-root": {
        backgroundColor: "transparent",
        "& > div > div": {
            backgroundColor: theme.palette.background.paper,
        },
    },
    "& .MuiPickersDay-root": {
        borderRadius: "8px",
        "&.MuiPickersDay-today": {
            border: "1px solid transparent",
        },
        "&.Mui-selected": {
            border: `1px solid ${theme.palette.warning.main}`,
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
            borderRadius: "8px",
            "&:hover, &:focus": {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.warning.main,
                // border: "1px solid #FFD400"
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
        minHeight: 46,
        marginBottom: 0,
        marginTop: 0,
        "& .MuiIconButton-edgeEnd": {
            position: "absolute",
            left: 10,
            top: 6,
            color: theme.palette.grey[300],
        },
        "& .MuiIconButton-edgeStart": {
            position: "absolute",
            right: 10,
            top: 6,
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

