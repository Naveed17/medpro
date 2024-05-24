import {styled} from "@mui/material/styles";
import {MobileContainer} from "@lib/constants";

const RootStyled = styled("div")(({theme}) => ({
    "& .fc-theme-standard .fc-scrollgrid": {
        border: "none",
    },
    "& .fc-event-main": {
        padding: "0",
    },
    "& .fc-event": {
        borderRadius: 0,
        border: "1px solid #F8F8F8!important",
        boxShadow: "none",
    },
    '& .fc .fc-timegrid-now-indicator-line': {
        borderStyle: "solid",
        borderWidth: 1.5,
        borderColor: theme.palette.primary.main,
        '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: -4.8,
            left: -2,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: theme.palette.primary.main,
        },
        '&:after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: -4.8,
            right: -2,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: theme.palette.primary.main,
        }
    },
    "& .fc .fc-daygrid-day.fc-day-today": {
        background: "#fff"
    },
    "& .fc-day-today .fc-timegrid-col-frame": {
        background: "rgba(255, 249, 217, 0.1)",
        border: `solid ${theme.palette.warning.main}`,
    },
    "& .fc-day-today .fc-daygrid-day-frame": {
        background: "rgba(255, 249, 217, 0.1)",
        border: `solid ${theme.palette.warning.main}`,
    },
    "& .fc-col-header-cell-cushion ": {
        padding: "5px 0!important",
        width: "100%",
    },
    "& .fc-timegrid-slot": {
        minHeight: 28,
        height: 28
    },
    ".fc .fc-timegrid-col.fc-day-today": {
        backgroundColor: '#fff'
    },
    "& .fc-timegrid-slot-label.fc-scrollgrid-shrink": {
        verticalAlign: "top",
        border: "0px solid #F0FAFF",
    },
    "& .fc-timegrid-event": {
        "& .MuiBox-root": {
            // flexDirection: "column",
            // alignItems: "baseline",
            justifyContent: "flex-start",
            padding: theme.spacing(0.5, 0.5, 0.5, 0),

            "& .ic-cabinet, & .ic-video": {
                // marginLeft: theme.spacing(0.5),
            },
        },
    },
    "& .fc-timegrid-event-harness > .fc-timegrid-event": {
        width: "101%",
        //overflowX: "auto",
        borderBottomRightRadius: "6px",
        borderTopRightRadius: "6px"
    },
    "& .fc-event-main-box": {
        overflowX: "inherit",
        color: theme.palette.primary.main,
        alignItems: "center",
        display: "flex",
        height: "100%",
        fontSize: 9,
        padding: theme.spacing(0.5, 0),
        position: "relative",
        zIndex: 8,
        "& .ic-time": {
            marginLeft: theme.spacing(1),
            width: 11,
            height: 11
        },
        "& .ic-video": {
            path: {
                fill: theme.palette.error.main,
            },
        },
        "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 1,
            width: 4,
            height: "100%",
            zIndex: 100,
            borderBottomLeftRadius: 4,
            borderTopLeftRadius: 4,
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
        [`@media (max-width: ${MobileContainer}px)`]: {
            minHeight: 26,
            display: "block",
            "& .MuiTypography-root": {
                fontSize: 14,
                margin: "auto",
                "& *:nth-of-type(1)": {
                    fontSize: 12
                }
            }
        }
    },
    "& .action-header-main": {
        display: "inlineBlock",
        position: "absolute",
        top: 14,
        zIndex: 98,
        "& .MuiButtonBase-root": {
            padding: 4
        }
    },
    "& .fc .fc-timegrid-slot-minor": {
        borderTopStyle: "none",
    },
    "& .fc-non-business": {
        /* avec plusieurs longueurs pour les points d'arrêt */
        backgroundImage: "repeating-linear-gradient(-45deg, transparent 0 20px, rgba(132, 132, 142, 0.1) 20px 40px)"
    },
    "& .filtered": {
        opacity: .4
    },
    '.fc-timegrid-slots': {
        'colgroup': {
            background: theme.palette.primary.lighter
        }
    },
    ".fc-timegrid-divider": {
        backgroundColor: '#fff',

    }
}));

export default RootStyled;
