import {styled} from "@mui/material/styles";
import {Box} from "@mui/material";

const EventStyled = styled(Box)(({theme}) => ({
    cursor: "pointer",
    borderRadius: theme.shape.borderRadius,
    svg: {
        width: 12,
        height: 12,
        margin: theme.spacing(0, 0.5),
    },
    "& .MuiTypography-root > svg:nth-of-type(2)": {
        marginLeft: 0
    },
    '& .MuiBadge-badge': {
        zIndex: 9
    },
    "& .badge": {
        top: "-5px;",
        right: "-5px",
        backgroundColor: theme.palette.primary.main,
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        position: "absolute",
        animation: "blink 1s infinite"
    },
    "@keyframes blink": {
        "100%": {
            opacity: 1,
        },
        "30%": {
            opacity: .2
        },
        "60%": {
            opacity: .6
        },
        "0%": {
            opacity: 1
        }
    },
    "& .online-appointment": {
        right: 5,
        position: "absolute",
        borderRadius: 2,
        width: 14,
        height: 14
    },
    ".btn-rdv": {
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(0.5),
        //backgroundColor: theme.palette.warning.main,
        marginLeft: "auto",
        width: 18,
        height: 18
    }

}))

export default EventStyled;
