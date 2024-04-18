// ----------------------------------------------------------------------

import { alpha } from "@mui/material/styles";

export default function Dialog(theme) {
    return {
        MuiDialog: {
            styleOverrides: {
                root: {
                    "& .MuiBackdrop-root": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    },
                    "& .MuiDialogTitle-root": {
                        fontSize: "1.125rem",
                    },
                    ".MuiDialogContent-root": {
                        borderTop: "none",
                    },
                    ".MuiDialog-paper": {
                        boxShadow: theme.customShadows.dialog,
                        border: 'none',
                        "& .modal-actions": {
                            position: "relative",
                            [theme.breakpoints.down("sm")]: {
                                "& .btn-right": {
                                    "& .MuiButton-startIcon": {
                                        marginRight: "0px",
                                        marginLeft: "0px",
                                    },
                                    button: {
                                        width: 32,
                                        minWidth: 32,
                                    },
                                },
                                "& .sm-none": {
                                    display: "none",
                                },
                            },
                        },
                        ".MuiCard-root": {
                            boxShadow: 'none'
                        }
                    },
                },
            },
        },
    };
}
