import {styled, alpha} from "@mui/material/styles";
import {Stack} from "@mui/material";

const RootStyled = styled(Stack)(({theme}) => ({
    padding: "10px",
    display: "flex",
    alignItems: "center",
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(9),
    flexDirection: "row",
    [theme.breakpoints.down("md")]: {
        flexDirection: "column",
    },
    borderBottom: `1px solid ${theme.palette.divider}`,
    "& .BaseBadge-badge": {
        bottom: 5,
        right: 2,
        height: 14,
        width: 14,
        borderRadius: "50%",
    },
    "& .react-svg": {
        marginRight: "5px",
    },
    "& .date-birth": {
        display: "flex",
        alignItems: "center",
        marginTop: -4,
        [theme.breakpoints.down("md")]: {
            marginBottom: theme.spacing(1),
        },
    },
    "& .alert": {
        fontSize: "12px",
        padding: theme.spacing(0.8, 0.4),
        marginTop: theme.spacing(0.2),
        borderRadius: "6px",
        marginBottom: theme.spacing(0.9),
        textAlign: "left",
        justifyContent: "flex-start",
        color: theme.palette.text.secondary,
        display: "flex",
        alignItems: "center",
        backgroundColor: alpha(theme.palette.warning.main, 0.15),
        height: 22,
        "& svg": {
            width: 14,
            height: 14,
            path: {
                fill: theme.palette.warning.main,
            },
        },
    },
    "& .email-link": {
        alignItems: "center",
        display: "flex",
        marginTop: 1,
        marginLeft: -1,
        svg: {height: 16, width: 16},
    },
    "& .import-avatar": {
        "& .react-svg": {
            margin: 0
        },
        "& svg": {
            width: 28,
            height: 26
        },
        position: "absolute",
        borderRadius: 8,
        bottom: 8,
        right: 8,
        zIndex: 1,
        padding: 0,
        background: theme.palette.background.paper
    },
    "& .input-base-custom": {
        "input::placeholder": {

        }
    }
}));
export default RootStyled;
