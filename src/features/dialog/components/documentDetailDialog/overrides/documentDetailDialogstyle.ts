import {Stack} from "@mui/material";
import {styled} from "@mui/material/styles";

const DocumentDetailDialogStyled = styled(Stack)(({theme}) => ({
    maxWidth: 1231,
    backgroundColor: theme.palette.background.default,
    paddingTop: theme.spacing(2),
    width: "100%",
    "& .loading-card": {
        position: "absolute",
        zIndex: 3,
        left: 10,
        width: 240,
        "& .MuiCardContent-root": {
            padding: 12
        }
    },
    "& .textLayer :is(span, br)": {
        color: "black"
    },
    ".zoombar": {
        background: "white",
        marginBottom: 10
    },
    "&.MuiStack-root": {
        maxWidth: 1400
    },
    ".sidebar": {
        ".MuiList-root": {
            backgroundColor: theme.palette.background.paper,
            marginTop: theme.spacing(-2),
            position: 'sticky',
            top: 0,
            ".MuiListItem-root": {
                paddingTop: 0,
                paddingBottom: 0,
                '.MuiListItemButton-root': {
                    position: 'relative',
                    '.MuiListItemIcon-root': {
                        minWidth: 28,
                        svg: {
                            width: 18,
                            height: 18,
                            path: {fill: theme.palette.text.primary}
                        }
                    },
                    '&.btn-delete': {
                        color: theme.palette.error.main,
                        svg: {
                            path: {fill: theme.palette.error.main}
                        }
                    },
                    "& .MuiOutlinedInput-root": {
                        border: 'none',
                        fieldset: {
                            border: "1px solid transparent",
                            boxShadow: "none",
                        },
                        background: "transparent",
                        "&:hover": {
                            fieldset: {
                                border: "1px solid transparent",
                                boxShadow: "none",
                            },
                        },
                        "&.Mui-focused": {
                            background: "transparent",
                            fieldset: {
                                border: "1px solid transparent",
                                boxShadow: "none",
                                outline: "none",
                            },
                        },
                        input: {
                            paddingLeft: 0,
                            fontWeight: 700,
                        }
                    },
                },
                "&.secound-list": {
                    ".btn-modi": {
                        textTransform: 'uppercase',
                        position: 'absolute',
                        right: 0,
                        top: "50%",
                        transform: 'translateY(-50%)',
                        fontWeight: 700,
                    },
                    '.MuiListItemButton-root': {
                        backgroundColor: "transparent",
                        "&:hover": {
                            backgroundColor: "transparent"
                        },
                        "&:focus": {
                            backgroundColor: "transparent"
                        },
                    }
                },
                "&:not(:last-of-type)": {
                    '.MuiListItemButton-root': {
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    },
                }

            }
        }
    },
    "@media (max-width: 1230px)": {
        maxWidth: "100%"
    },
}));
export default DocumentDetailDialogStyled;
