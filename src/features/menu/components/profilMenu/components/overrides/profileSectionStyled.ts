//components styles
import { alpha, styled } from "@mui/material/styles";
import { pxToRem } from "@themes/formatFontSize";

const ProfileSectionStyled = styled('div')(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    "& .profile-btn": {
        marginLeft: "auto",
        borderColor: "transparent",
        width: 60,
        minWidth: 60,
        height: 38,
        padding: "0 4px",
        "& .profile-img": {
            borderRadius: 8,
            // overflow: "hidden",
            marginRight: 3,
            width: pxToRem(22),
            height: pxToRem(22),
        },
        [theme.breakpoints.down("md")]: {
            width: 38,
            minWidth: 38,
            justifyContent: "space-evenly",
            img: {
                marginRight: 0,
            },
        },
    },
    "& .profile-menu-container": {
        zIndex: 9999,
        "& .MuiPaper-root": {
            minWidth: pxToRem(235),
            border: `1px solid ${theme.palette.divider}`,
            boxSizing: "border-box",
            boxShadow: theme.shadows[5],
            borderRadius: 10,

            [theme.breakpoints.down("sm")]: {
                minWidth: "auto",
            },
            "& .profile-menu": {
                position: "relative",
                "&::before, &::after": {
                    bottom: "100%",
                    left: "89%",
                    border: "solid transparent",
                    content: "''",
                    height: 0,
                    width: 0,
                    position: "absolute",
                    pointerEvents: "none",
                },
                "&::after": {
                    borderColor: alpha(theme.palette.common.white, 0),
                    borderBottomColor: theme.palette.common.white,
                    borderWidth: 6,
                    marginLeft: -6,
                },
                "&::before": {
                    borderColor: alpha(theme.palette.common.black, 0),
                    borderBottomColor: theme.palette.divider,
                    borderWidth: 7,
                    marginLeft: -7,
                },
                "& .profile-top-sec": {
                    padding: 0,
                    "& ul": {
                        paddingTop: 0,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        width: "100%",
                        "& li": {
                            "& .profile-detail": {
                                marginLeft: 14,
                                "& .name": {
                                    color: theme.palette.primary.main,
                                },
                            },
                            "&:hover": {
                                backgroundColor: "transparent",
                            },
                        },
                    },
                    "&:hover": {
                        backgroundColor: "transparent",
                    },
                },
                "& .item-list": {
                    [theme.breakpoints.down("sm")]: {
                        paddingTop: 0,
                        paddingBottom: 0,
                        minHeight: pxToRem(36),
                    },
                    "&:hover": {
                        backgroundColor: theme.palette.info.main,
                    },
                    "&.border-bottom": {
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    },
                    "& .item-name": {
                        color: theme.palette.text.secondary,
                        marginLeft: 12,
                    },
                    "& .react-svg": {
                        "& svg": {
                            width: pxToRem(16),
                            height: pxToRem(16),
                        },
                    },
                    "&.has-items": {
                        position: "relative",
                        "& .sub-items": {
                            position: "absolute",
                            backgroundColor: theme.palette.grey[0],
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 10,
                            opacity: 0,
                            visibility: "hidden",
                            transition: "all 0.2s ease-in-out",
                            left: "-100%",
                            width: "100%",
                            "& li": {
                                [theme.breakpoints.down("sm")]: {
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    minHeight: pxToRem(36),
                                },
                                "&:hover": {
                                    backgroundColor: theme.palette.info.main,
                                },
                                "&.border-bottom": {
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                },
                                "& .item-name": {
                                    color: theme.palette.text.secondary,
                                    marginLeft: 12,
                                    "& + .react-svg": {
                                        marginLeft: "auto",
                                    },
                                },
                                "& .react-svg": {
                                    "& svg": {
                                        width: 16,
                                        height: 16,
                                    },
                                },
                            },
                        },
                        "&:hover": {
                            "& .sub-items": {
                                opacity: 1,
                                visibility: "visible",
                            },
                        },
                    },
                },
            },
        },
        "&[data-popper-placement='top-end']": {
            "& .MuiList-root": {
                "&:after": {
                    top: "100%",
                    left: "89%",
                    // borderTopColor: theme.palette.divider,
                    border: "solid transparent",
                    borderTopColor: theme.palette.common.white,
                    borderWidth: 6,
                    marginLeft: -6,
                },
                "&:before": {
                    top: "100%",
                    left: "89%",
                    border: "solid transparent",
                    borderColor: theme.palette.common.black,
                    borderTopColor: theme.palette.divider,
                    borderWidth: 7,
                    marginLeft: -7,
                },
            },
        },
    },
}));

export default ProfileSectionStyled;
