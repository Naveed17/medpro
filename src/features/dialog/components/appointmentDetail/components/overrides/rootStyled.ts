import {alpha, styled} from "@mui/material/styles";
import {Paper} from "@mui/material";

const RootStyled = styled(Paper)(({theme}) => ({
    height: "100%",
    minWidth: "29vw",
    maxWidth: "30rem",
    backgroundColor: theme.palette.background.default,
    boxShadow: "-5px 14px 26px rgba(0, 150, 214, 0.37)",
    border: "none",
    borderRadius: "0px",
    "& .MuiInputAdornment-root .MuiSvgIcon-root": {
        color: theme.palette.primary.main,
        fontSize: 16,
    },
    "& .MuiAppBar-root": {
        border: "none",
        borderBottom: `1px solid ${theme.palette.divider}`,
        minHeight: "47px",
        "& .MuiToolbar-root": {
            minHeight: "47px",
            justifyContent: "space-between",
            "& .MuiIconButton-root": {
                "& .MuiSvgIcon-root": {
                    color: theme.palette.text.primary,
                    fontSize: 16,
                },
            },
        },
    },
    "& .MuiCard-root": {
        border: "none",
        "& .MuiCardContent-root": {
            padding: theme.spacing(1),
        },
    },
    "& .MuiInputBase-root": {
        alignItems: "flex-start",
        "& fieldset": {border: 0},
        "&:hover": {
            fieldset: {
                border: "none",
                boxShadow: "none",
            },
        },
        "&.Mui-focused": {
            fieldset: {
                border: "none",
                boxShadow: "none",
                outline: "none",
            },
        },
        "& .MuiInputAdornment-root": {
            marginRight: theme.spacing(-1.5),
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
        backgroundColor: alpha(theme.palette.error.main, 0.15),
        height: 22,
        "& svg": {
            width: 14,
            height: 14,
            mr: 1,
            path: {
                fill: theme.palette.error.main,
            },
        },
        "& span": {
            padding: "0 .2rem",
        },
    },
    "& .MuiListItem-root": {
        padding: theme.spacing(0.3),
        ".ic-tell": {
            svg: {
                width: 20,
                height: 20,
            },
        },
    },
    ".ic-tel": {
        svg: {
            width: 16,
            height: 16,
            path: {
                fill: theme.palette.common.white,
            },
        },
    },
    ".add-photo": {
        position: "absolute",
        bottom: 3,
        right: 3,
        padding: 0,
        minWidth: "auto !important",
        minHeight: "auto !important",
        backgroundColor: "transparent !important",
    },
    "& .appointment-text .MuiTypography-root": {
        fontWeight: "bold"
    },
    "& .MuiChip-label": {
        fontSize: 12
    }
}));

export default RootStyled;
