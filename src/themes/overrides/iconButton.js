import {alpha} from "@mui/material/styles";
// ----------------------------------------------------------------------
export default function IconButton(theme) {
    return {
        MuiIconButton: {
            styleOverrides: {
                root: {
                    "&.MuiIconButton-colorPrimary": {
                        background: "transparent",
                        boxSizing: "border-box",
                        borderRadius: "10px",
                        "&.MuiIconButton-sizeMedium": {
                            minHeight: "40px",
                            minWidth: "40px",
                        },
                        "&.MuiIconButton-sizeLarge": {
                            minHeight: "48px",
                            minWidth: "48px",
                        },
                        "&.MuiIconButton-sizeSmall": {
                            minHeight: "27px",
                            minWidth: "27px",
                        },
                        border: "1px solid transparent",
                        "&:hover": {
                            border: `1px solid ${theme.palette.grey["A100"]}`,
                            boxShadow: 'none', //theme.shadows[4],
                            background: theme.palette.info.main,
                        },

                    },
                    "&.success-light": {
                        backgroundColor: alpha(theme.palette.success.main, 0.3),
                        borderRadius: "6px",
                        "&:hover": {
                            backgroundColor: alpha(theme.palette.success.main, 0.6),
                            boxShadow: 'none',
                        },
                        "& svg": {
                            "& path": {
                                fill: theme.palette.text.primary,
                            },
                        },
                        "&.Mui-disabled": {
                            backgroundColor: theme.palette.grey[100]
                        }
                    },
                    "&.error-light": {
                        border: `1px solid ${theme.palette.error.lighter}`,
                        backgroundColor: theme.palette.error.lighter,
                        borderRadius: "10px",
                        "&:hover": {
                            backgroundColor: theme.palette.error.lighter,
                            boxShadow: 'none'
                        },
                        "& svg": {
                            "& path": {
                                fill: theme.palette.error.main,
                            },
                        },
                        "&.Mui-disabled": {
                            backgroundColor: theme.palette.grey[100]
                        }
                    },
                    "&.custom-icon-button": {
                        "&.MuiIconButton-sizeMedium": {
                            minHeight: "40px",
                            minWidth: "40px",
                        },
                    }
                },
            },
            variants: [
                {
                    props: {variant: "custom"},
                    style: {
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: "10px",
                        "& svg": {
                            "& path": {
                                fill: theme.palette.grey["A50"],
                            },
                        },
                        "&:hover": {
                            backgroundColor: "transparent",
                            boxShadow: 'none'
                        },
                    },
                },
                {
                    props: {variant: "custom", color: "success"},
                    style: {
                        border: `1px solid ${theme.palette.success.main}`,
                        backgroundColor: theme.palette.success.main,
                        "& svg": {
                            "& path": {
                                fill: theme.palette.common.white,
                            },
                        },
                        "&:hover": {
                            backgroundColor: theme.palette.success.main,
                            boxShadow: 'none'
                        },
                    },
                },
                {
                    props: {variant: "warning-light"},
                    style: {
                        border: `1px solid ${theme.palette.warning.lighter}`,
                        backgroundColor: theme.palette.warning.lighter,
                        borderRadius: "10px",
                        "&:hover": {
                            backgroundColor: theme.palette.warning.lighter,
                            boxShadow: 'none'
                        },
                        "& svg": {
                            "& path": {
                                fill: theme.palette.warning.dark,
                            },
                        },
                    },
                },
                {
                    props: {variant: "primary-light"},
                    style: {
                        border: `1px solid ${theme.palette.primary.lighter}`,
                        backgroundColor: theme.palette.primary.lighter,
                        borderRadius: "10px",
                        "&:hover": {
                            backgroundColor: theme.palette.primary.lighter,
                            boxShadow: 'none'
                        },
                        "& svg": {
                            "& path": {
                                fill: theme.palette.primary.main,
                            },
                        },
                    },
                },
            ],
        },
    };
}
