import {styled} from "@mui/material/styles";

const ChatStyled = styled("div")(({theme}) => ({
    flex: 1,
    backgroundColor: theme.palette.grey["A400"],
    "& > div": {
        height: "100%",
    },
    ".user-wrapper": {
        flex: 1,
        height: '100vh',
        overflow: 'auto',
        border: 0,
        borderRadius: "6px 0 0 6px",
        borderRight: `1px solid ${theme.palette.divider}`,
        backgroundColor: "transparent",
        padding: theme.spacing(2),
        ".user-item": {
            padding: theme.spacing(1),
            borderRadius: theme.shape.borderRadius,
            "&.selected": {
                backgroundColor: theme.palette.common.white,
            }
        },
        [theme.breakpoints.down("md")]: {
            border: 0,
        },
    },
    '.chat-wrapper': {
        border: 0,
        borderRadius: 0,
        backgroundColor: "transparent",
        padding: theme.spacing(2),
        height: "100%",
        ".prev-msgs": {
            backgroundColor: theme.palette.common.white,
            boxShadow: "0 1px 1px rgba(0,0,0,.05)",
            fontSize: 11,
            color: theme.palette.text.secondary,
            fontWeight: 'normal',
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),

        },
        ".chat-list": {
            margin: theme.spacing(3, 0, 0, 0),
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 215px)',
            overflow: 'auto',
            ".MuiListItem-root": {
                ".time": {
                    display: 'inline-block',
                    marginLeft: theme.spacing(2),
                    position: 'relative',
                    "&::before": {
                        content: "''",
                        display: 'inline-block',
                        width: 2,
                        height: 2,
                        backgroundColor: theme.palette.text.secondary,
                        borderRadius: 5,
                        position: 'absolute',
                        top: 5,
                        left: -8,
                    }
                },
                ".MuiListItemAvatar-root": {
                    minWidth: 45,
                    ".MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        fontSize: 14,
                    }
                },
                "&.left": {
                    alignSelf: 'flex-start',
                },
                "&.right": {
                    textAlign: 'right',
                    alignSelf: 'flex-end',
                    flexDirection: 'row-reverse',
                    ".MuiListItemAvatar-root": {
                        display: 'flex',
                        justifyContent: 'flex-end',
                    },
                    ".thumb": {
                        backgroundColor: theme.palette.common.white,
                        boxShadow: "0 1px 1px rgba(0,0,0,.05)",
                        fontSize: 11,
                        paddingLeft: theme.spacing(1.5),
                        paddingRight: theme.spacing(1.5),
                        alignSelf: 'flex-end',
                    },
                },
                [theme.breakpoints.up("md")]: {
                    maxWidth: '90%',
                }

            },
              [theme.breakpoints.down("md")]: {
                    height: 'calc(100vh - 230px)',
                }
        }
    },
    '.no-chat': {
        alignItems: "center",
        display: "flex",
        height: "100%",
        justifyContent: "center"
    },
    ".MuiInputBase-root": {
        paddingBottom: 32,
        ".MuiInputAdornment-positionStart": {
            position: 'absolute',
            bottom: 20
        },
        ".MuiInputAdornment-positionEnd": {
            position: 'absolute',
            bottom: 20,
            right: 16
        },
    },

    ".send-msg": {
        backgroundColor: theme.palette.text.primary,
        boxShadow: "0 1px 1px rgba(0,0,0,.05)",
        fontSize: 11,
        color: theme.palette.common.white,
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
        span: {
            marginLeft: 4,
            marginTop: 1.4,
        },
        "&:hover": {
            backgroundColor: theme.palette.text.primary,
        }
    },
    ".tag:hover": {
        textDecoration: "underline"
    },
    ".btn1": {
        fontSize: 12,
        padding: 3,
        height: 32,
        backgroundColor: theme.palette.primary.main,
        borderRadius: 8,
        border: 0,
        color: "white"
    },
    ".btn2": {
        fontSize: 12,
        padding: 3,
        height: 32,
        backgroundColor: "#C5E5F9",
        borderRadius: 8,
        border: 0,
        color: theme.palette.primary.main,
        fontWeight: "bold"
    },
    ".btnDiv": {
        gap: 5,
        display: "flex",
        justifyContent: "flex-end",
        marginTop: 8
    },
    ".tox .tox-edit-area::before": {
        border: "none"
    }
}));

export default ChatStyled;
