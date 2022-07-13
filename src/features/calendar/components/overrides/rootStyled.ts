import {styled} from "@mui/material/styles";

const RootStyled = styled("div")(({theme}) => ({
    "& .fc-event-main": {
        padding: "0",
    },
    "& .fc-event": {
        borderRadius: 0,
        border: "1px solid #F8F8F8!important",
        boxShadow: "none",
    },
    "& .fc .fc-daygrid-day.fc-day-today": {
        background: "transparent",
    },
    "& .fc-day-today .fc-timegrid-col-frame": {
        background: "#F0FAFF",
        border: `4px solid ${theme.palette.warning.main}`,
    },

    "& .fc-col-header-cell-cushion ": {
        padding: "5px 0!important",
        width: "100%",
    },
    "& .fc-timegrid-slot": {
        minHeight: 58,
        height: 58,
    },
    "& .fc-timegrid-slot-label.fc-scrollgrid-shrink": {
        verticalAlign: "top",
        border: "0px solid #F0FAFF",
    },
    "& .fc-timegrid-event": {
        "& .MuiBox-root": {
            flexDirection: "column",
            alignItems: "baseline",
            justifyContent: "space-around",
            "& .ic-cabinet, & .ic-video": {
                marginLeft: theme.spacing(0.5),
            },
        },
    },
    "& .fc-timegrid-event-harness > .fc-timegrid-event": {
        width: "102.6%",
    },
    "& .fc-event-main-box": {
        overflow: "hidden",
        color: theme.palette.primary.main,
        alignItems: "center",
        display: "flex",
        height: "100%",
        fontSize: 9,
        padding: theme.spacing(0.5, 0),
        position: "relative",
        "& .ic-time": {
            marginLeft: theme.spacing(0.5),
        },
        "& .ic-video": {
            path: {
                fill: theme.palette.error.main,
            },
        },
        svg: {
            width: 8,
            height: 8,
            margin: theme.spacing(0, 0.5),
        },
        "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: -1,
            width: "4px",
            height: "100%",
            zIndex: 100,
        },
        "& .MuiTypography-root": {
            alignItems: "center",
            display: "flex",
            lineHeight: 1,
        },
    },
    "& .header-day-main-box": {
        alignItems: "center",
        position: "relative",
        minHeight: 46,
        "& .day": {
            fontSize: 22,
            fontWeight: 400,
        },
    },
    "& .action-header-main": {
        display: "inlineBlock",
        position: "absolute",
        top: 14,
        zIndex: 1000,
        "& .MuiButtonBase-root": {
            padding: 2
        }
    },
    "& .fc .fc-timegrid-slot-minor": {
        borderTopStyle: "none",
    },
}));

export default RootStyled;
