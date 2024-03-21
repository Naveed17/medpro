import {styled} from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";

const TableRowStyled = styled(TableRow)<any>(
    ({theme, styleprops, ...rest}) => ({
        "& .btn-edit": {
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 8,
            padding: theme.spacing(.8),
        },
        "& .MuiTableCell-root": {
            cursor: "pointer",
            div: {
                color: "black",
            },
            "& .MuiSelect-select": {
                background: "white",
            },
            position: "relative",
            "& .name": {
                marginLeft: "24px",
                height: "100%",
                "&::after": {
                    content: '" "',
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    left: 24,
                    width: "4px",
                    height: "calc(100% - 16px)",
                    background: styleprops ? theme.palette[styleprops].main : "",
                },
                "&::before": {
                    content: '" "',
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    left: 8,
                    width: "13px",
                    height: "13px",
                    borderRadius: "50%",
                    background: styleprops ? theme.palette[styleprops].main : "",
                },
            },
            "& .lg-down": {
                [theme.breakpoints.down("xl")]: {
                    display: "none",
                },
            },
            "& .lg-up": {
                "& .edit-icon-button": {
                    path: {
                        fill: theme.palette.text.primary,
                    },
                },
                [theme.breakpoints.up("xl")]: {
                    display: "none",
                },
            },
        },
        "& .text-time": {
            display: "flex",
            alignItems: "center",
            svg: {marginRight: theme.spacing(0.5)},
        },
        "& .next-appointment": {
            display: "flex",
            alignItems: "center",
            svg: {
                marginRight: theme.spacing(0.6),
                "& path": {fill: theme.palette.text.primary},
            },
        },
        "&.document-row": {
            "& .MuiAvatar-root": {
                width: 20,
                height: 20,
                borderRadius: 4,
                color: theme.palette.common.white,
                backgroundColor: theme.palette.grey[400],
                fontFamily: theme.typography.fontFamily,
                "& span": {
                    fontSize: 9,
                },
            },
            "& .MuiCheckbox-root": {
                padding: 2,
                width: 22,
                height: 22,
                "& .react-svg": {
                    " & svg": {
                        width: 14,
                        height: 14,
                    },
                },
            },
            "& .MuiButton-root": {
                padding: theme.spacing(0, 1),
                fontSize: 14,
                minWidth: 0,
                color: theme.palette.text.primary,
                "& .react-svg svg path": {
                    fill: theme.palette.text.primary,
                },
                "&:hover": {
                    backgroundColor: "transparent",
                    boxShadow: "none",
                },
                "&:focus, &:active": {
                    backgroundColor: "transparent",
                    color: theme.palette.text.primary,
                    "& .react-svg svg path": {
                        fill: theme.palette.text.primary,
                    },
                },
            },
            "& .more-icon-btn": {
                color: theme.palette.text.primary,
            },
            "& .MuiTableCell-root": {
                backgroundColor: "transparent !important",
                borderTop: `1px solid ${theme.palette.divider} !important`,
                borderBottom: `1px solid ${theme.palette.divider} !important`,
                "&:first-of-type": {
                    borderLeft: `1px solid ${theme.palette.divider} !important`,
                },
                "&:last-of-type": {
                    borderRight: `1px solid ${theme.palette.divider} !important`,
                },
            },
        },
        "&.payment-row": {
            ".MuiTableCell-root": {
                backgroundColor: "transparent",
                ".label": {
                    color: theme.palette.text.primary,
                    fontWeight: 700,
                },
            },
            "&:hover": {
                backgroundColor: theme.palette.common.white + "!important",
                ".MuiTableCell-root": {
                    backgroundColor: theme.palette.common.white + "!important",
                },
            },
            "&.Mui-selected": {
                backgroundColor: theme.palette.common.white + "!important",
            },
        },
        "&.payment-dialog-row": {
            svg: {
                width: 10,
                height: 10,
                path: {
                    fill: theme.palette.text.primary,
                },
            },
            ".ic-card": {
                svg: {
                    width: 14,
                    height: 14,
                },
            },
        },
        "&.new-row": {
            ".MuiTableCell-root": {
                borderTop: `2px solid ${theme.palette.warning.main} !important`,
                borderBottom: `2px solid ${theme.palette.warning.main} !important`,
                "&:first-of-type": {
                    borderLeft: `2px solid ${theme.palette.warning.main} !important`,
                },
                "&:last-of-type": {
                    borderRight: `2px solid ${theme.palette.warning.main} !important`,
                },
            },
        },
        ".counter-btn": {
            borderRadius: 5,
            width: "fit-content",
            height: 25,
            margin: "auto",
            alignSelf: "flex-start",
            border: `1px solid ${theme.palette.grey["A600"]}`,
            backgroundColor: theme.palette.common.white,

            ".MuiCheckbox-root": {
                width: 20,
                height: 20,
                marginRight: theme.spacing(1),
            },
            ".MuiInputBase-root": {
                width: 35,
                height: 22,
                borderRadius: 5,
                border: 0,
                margin: 0,
                ".MuiInputBase-input": {
                    textAlign: "center",
                },
            },
            ".MuiIconButton-root": {
                borderRadius: 4,
                padding: 2,
                width: 25,
                height: 25,
                backgroundColor: theme.palette.grey["A600"],
                svg: {
                    width: 14,
                    height: 14,
                },
            },
        },
        "& .expand-icon": {
            width: 16,
            height: 16,
            border: " 1px solid",
            borderRadius: 3,
            marginRight: 8,
        },
        "& .source-icon": {
            margin: "auto",
        },
        "& .MuiAvatar-root .error": {

            width: 12,
            marginRight: 0,
        },
        ".collapse-wrapper": {
            marginLeft: -1,
            marginRight: -1,
            ".means-wrapper": {
                padding: theme.spacing(2),
                backgroundColor: theme.palette.background.default,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderTop: "none",
            },
            ".consultation-card": {
                position: "relative",

                ".MuiCardContent-root": {
                    "&:last-child": {
                        padding: theme.spacing(2),
                    },
                },
                "&:not(:last-child)": {
                    marginBottom: theme.spacing(2),
                },
            },
        },
        "&.row-cashbox": {
            ".MuiTableCell-root": {
                //backgroundColor: rest.rest === 0 ?"#c7ffe1":rest.fees - rest.rest === 0 ?"#FDF6D0":"#F4D9E1",
                "&.MuiTableCell-root": {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    borderRadius: 0,

                    "&:first-of-type": {
                        borderBottomLeftRadius: 0,
                    },
                    "&:last-of-type": {
                        borderBottomRightRadius: 0,
                    },
                },
            },
            "&.row-collapse": {
                ".MuiTableCell-root": {
                    "&.MuiTableCell-root": {
                        borderBottomColor: "transparent",
                        "&:first-of-type": {
                            borderBottomLeftRadius: 0,
                        },
                        "&:last-of-type": {
                            borderBottomRightRadius: 0,
                        },
                    },
                },
            },
        },
        "&.cashbox-collapse-row": {
            ".collapse-wrapper": {
                marginLeft: 0,
                marginRight: 0,
                padding: theme.spacing(2),
                backgroundColor: theme.palette.background.default,
            },
        },
        "&.paid-consult-row": {
            ".MuiTableCell-root": {
                "&.MuiTableCell-root": {
                    "&.MuiTableCell-root": {
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        borderRadius: 0,

                        "&:first-of-type": {
                            borderBottomLeftRadius: 0,
                        },
                        "&:last-of-type": {
                            borderBottomRightRadius: 0,
                        },
                    },
                },
            },
        },
        "&.user-row": {
            ".role-select": {
                ".MuiOutlinedInput-root": {
                    backgroundColor: 'transparent',
                    fontSize: 13,
                    fontWeight: 700
                },
                fieldset: {border: 'none !important', boxShadow: 'none !important'},
            },
            ".btn-edit": {
                border: `1px solid ${theme.palette.divider}`,
                padding: theme.spacing(.8),
            }
        }
    })
);
export default TableRowStyled;
