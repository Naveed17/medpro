import { styled } from '@mui/material/styles';
import {Box} from "@mui/material";

const CalendarPickerStyled = styled(Box)(({ theme }) => ({
    "& .MuiTypography-caption": {
        color: theme.palette.primary.main,
    },
    "& .MuiPickerStaticWrapper-root": {
        backgroundColor: "transparent",
        "& > div > div": {
            backgroundColor: "#fff",
        },
    },
    "& .MuiPickersDay-root": {
        borderRadius: "8px",
        "&.MuiPickersDay-today": {
            border: "1px solid transparent",
        },
        "&.Mui-selected": {
            backgroundColor: "#FFD400",
            color: theme.palette.text.primary,
            // border: "1px solid #FFD400",
            borderRadius: "8px",
            "&:hover, &:focus": {
                color: theme.palette.text.primary,
                backgroundColor: "#FFD400",
                // border: "1px solid #FFD400"
            },
        },
        "&:hover, &:focus": {
            backgroundColor: "#E7F5FB",
        },
        "&.Mui-disabled": {
            color: "#DDDDDD",
        },
    },
    "& .MuiCalendarPicker-root > div:first-of-type": {
        position: "relative",
        boxShadow: "0px 0.5px 0px rgba(0, 0, 0, 0.12)",
        backgroundColor: "#FCFCFC",
        minHeight: 46,
        marginBottom: 0,
        marginTop: 0,
        "& .MuiIconButton-edgeEnd": {
            position: "absolute",
            left: 10,
            top: 6,
            color: "#C9C8C8",
        },
        "& .MuiIconButton-edgeStart": {
            position: "absolute",
            right: 10,
            top: 6,
            color: "#C9C8C8",
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

