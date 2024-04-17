import {Stack, styled} from "@mui/material";

const DialogStyled = styled(Stack)(({theme}) => ({
    ".dialog-action": {
        justifyContent: "space-between",
        borderTop: `1px solid ${theme.palette.primary.main}`
    },
    ".role-label": {
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 6,
        padding: theme.spacing(1, 2),
        margin: 0,
        ".MuiTypography-root": {
            fontSize: 15,
            fontWeight: 700,
        },
        ".MuiButtonBase-root": {
            padding: 0,
            width: 0,
            height: 0,
            marginRight: theme.spacing(2)
        },
    },
    ".add-role": {
        alignSelf: 'flex-start',
        backgroundColor: theme.palette.grey["A500"],
        "&:hover": {
            backgroundColor: theme.palette.grey["A500"],
        }
    },
    '.motif-list': {
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderBottom: `1px solid ${theme.palette.divider}`,
        paddingTop: theme.spacing(1.5),
        "&:not(:last-of-type)": {
            marginBottom: theme.spacing(.5),
        },
        cursor: 'pointer',
        "&.selected": {
            backgroundColor: theme.palette.info.main,
            border: 'none',
            borderRadius: (theme.shape.borderRadius * 2),
            transition: 'all .2s ease-in-out',
        },
        ".MuiCollapse-root": {
            cursor: 'default',
            width: '100%',
            ".collapse-wrapper": {
                paddingTop: 0,
                width: 'calc(100% + 64px)',
                borderTop: `1px solid ${theme.palette.common.white}`,
                marginLeft: theme.spacing(-2),
                marginRight: theme.spacing(-2),
                marginTop: theme.spacing(2),
            },
            ".permissions-wrapper": {
                ".MuiCard-root": {
                    maxHeight: 350,
                    overflowY: "auto",
                },
                ".main-list": {
                    //borderTop: "1px dashed #DBE1E4",
                },
                ".bold-label": {
                    ".MuiFormControlLabel-label": {
                        fontWeight: 700,
                        fontSize: 14,

                    },
                },
                ".MuiFormControlLabel-label": {
                    fontSize: 14
                },
                ".inside-list": {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: theme.spacing(1),
                    [theme.breakpoints.down("md")]: {
                        gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
                    }
                },
                ".collapse-icon": {
                    marginLeft: "auto",
                    ".react-svg div": {
                        lineHeight: 0,
                    },
                },
                ".MuiCollapse-root": {
                    marginLeft: theme.spacing(5),
                },
                ".inner-collapse": {
                    marginBottom: 4,
                    width: "-webkit-fill-available"
                },
            },

            ".MuiFormControlLabel-root": {
                margin: 0,
            }
        },
        ".MuiListItemSecondaryAction-root": {
            transform: "none",
            top: 10,

        }
    },
    ".role-input-group": {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: theme.spacing(2),
    },
    "& .role-input-container": {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: theme.spacing(1.2),
    },
    "& .role-input-group": {
        width: "100%"
    }
}));
export default DialogStyled;
