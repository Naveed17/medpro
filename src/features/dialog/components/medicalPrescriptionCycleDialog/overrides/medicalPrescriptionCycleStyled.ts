import {Stack, styled} from "@mui/material";

const MedicalPrescriptionCycleStyled = styled(Stack)(({theme}) => ({
    "& .MuiContainer-root": {
        padding: 0,
        maxWidth: "1400px",
    },
    "& .MuiCardContent-root": {
        paddingBottom: 10,
    },
    "& .MuiOutlinedInput-root.Mui-focused": {
        background: theme.palette.background.default,
    },
    "& .grid-action": {
        paddingLeft: 8,
    },
    "& .MuiGrid-root .drug-input": {
        paddingLeft: 8
    },
    ".btn-del-drug": {
        borderRadius: 4,
        padding: 6,
        border: "1px solid transparent",
        svg: {
            width: 20,
            height: 20,
            path: {
                fill: theme.palette.grey["A50"],
            },
        },
        "&:hover": {
            backgroundColor: theme.palette.common.white,
            borderColor: theme.palette.grey[300],
            svg: {
                path: {
                    fill: theme.palette.error.main,
                },
            },
        },
        [theme.breakpoints.down("sm")]: {
            marginLeft: theme.spacing(-1)

        },
    },
    ".custom-paper": {
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3, 1),
        ".name-of-drug": {
            ".MuiButtonBase-root": {
                opacity: 0,
                visibility: "hidden",
            },
        },
        ".cycle-card": {
            marginTop: theme.spacing(2),
            backgroundColor: "transparent",
            marginBottom: theme.spacing(2),
            position: "relative",
            borderStyle: "dashed",
            borderColor: theme.palette.grey[300],
            ".MuiButton-white": {
                border: `1px solid ${theme.palette.grey[300]}`,
                cursor: "default",
                padding: theme.spacing(0.5, 1),
                minWidth: 56,
                [theme.breakpoints.up("sm")]: {
                    minWidth: 100
                },
                [theme.breakpoints.down("sm")]: {
                    width: '100%'
                },
                [theme.breakpoints.up("md")]: {
                    minWidth: 56
                },
                ".MuiIconButton-root": {
                    ".MuiSvgIcon-root": {
                        fontSize: "1rem",
                        path: {
                            fill: theme.palette.primary.main,
                        },
                    },
                    "&.Mui-disabled": {
                        ".MuiSvgIcon-root": {
                            path: {
                                fill: theme.palette.divider,
                            },
                        },
                    },
                },
                "&:hover": {
                    backgroundColor: theme.palette.common.white,
                },
                ".MuiButtonBase-root": {
                    width: 25,
                    height: 25,
                    svg: {
                        path: {
                            fill: theme.palette.divider,
                        },
                    },
                    ".react-svg": {
                        svg: {
                            path: {
                                fill: theme.palette.common.white,
                            },
                        },
                    },
                },
            },
            ".btn-del": {
                position: "absolute",
                top: 5,
                right: 5,
                borderRadius: 4,
                padding: 6,
                border: "1px solid transparent",
                svg: {
                    width: 16,
                    height: 16,
                    path: {
                        fill: theme.palette.grey["A50"],
                    },
                },
                "&:hover": {
                    backgroundColor: theme.palette.common.white,
                    borderColor: theme.palette.grey[300],
                    svg: {
                        path: {
                            fill: theme.palette.error.main,
                        },
                    },
                },
            },
            [theme.breakpoints.down("md")]: {
                paddingTop: theme.spacing(3),
            },
        },
    },
    ".model-collapse": {
        ".MuiListItem-root": {
            ".btn-del": {
                marginLeft: "auto",
                display: "none",
                padding: 0,
                ".react-svg div": {
                    lineHeight: 0,
                },
            },
            "&:hover": {
                backgroundColor: theme.palette.primary.light,
                ".btn-del": {
                    display: "block",
                },
            },
        },
    },
    "& .prescription-preview": {
        width: "100%",
        "& .MuiListItemButton-root": {
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: theme.spacing(1),
            "&:last-child": {
                marginBottom: 0,
            },
            ".MuiListItemText-root": {
                margin: 0,
            },
            button: {
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 8,
                padding: 5,
                width: 32,
                height: 32,
                svg: {
                    width: 16,
                    height: 16,
                    path: {
                        fill: theme.palette.text.secondary,
                    }
                },
                "&.btn-del": {
                    marginLeft: theme.spacing(1),
                    svg: {
                        path: {
                            fill: theme.palette.text.primary
                        }
                    }
                },
            }
        },
        "& .MuiListItemText-primary": {
            fontWeight: 500,

        },
    },
    "& .custom-button": {
        px: {xs: 0.5, md: 1},
        fontSize: {xs: 12, md: 14},
        alignSelf: "flex-start",
    },
    '.btn-list-action': {
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 8,
        padding: 5,
    }
}));
export default MedicalPrescriptionCycleStyled;
