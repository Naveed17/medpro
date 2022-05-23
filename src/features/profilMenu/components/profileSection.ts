//components styles
import { styled } from "@mui/material/styles";
import {pxToRem} from "@themes/formatFontSize";

const ProfileSection = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    "& .profile-btn": {
        "& .profile-img": {
            borderRadius: 8,
            overflow: 'hidden',
            marginRight: 3,
            width: pxToRem(26),
            height: pxToRem(26),
        },
        "& .react-svg": {
            [theme.breakpoints.down('md')]: {
                display: "none"
            },
        }
    },
    "& .profile-menu-container": {
        zIndex: 9999,
        "& .MuiPaper-root": {
            minWidth: pxToRem(235),
            border: `1px solid ${theme.palette.divider}`,
            boxSizing: "border-box",
            boxShadow: theme.shadows[5],
            borderRadius: 10,

            [theme.breakpoints.down('sm')]: {
                minWidth: "auto"
            },
            "& .profile-menu": {
                "& .profile-img": {
                    borderRadius: 8
                },
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
                    borderColor: "rgba(255, 255, 255, 0)",
                    borderBottomColor: "#fff",
                    borderWidth: 6,
                    marginLeft: -6,
                },
                "&::before": {
                    borderColor: "rgba(0, 0, 0, 0)",
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
                                }
                            },
                            "&:hover": {
                                backgroundColor: 'transparent'
                            }
                        }
                    },
                    "&:hover": {
                        backgroundColor: 'transparent'
                    }
                },
                "& .item-list": {
                    [theme.breakpoints.down('sm')]: {
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
                        }
                    },
                    "& .react-svg": {
                        "& svg": {
                            width: pxToRem(16),
                            height: pxToRem(16),
                        }
                    },
                    "&.has-items": {
                        position: "relative",
                        "& .sub-items": {
                            position: "absolute",
                            backgroundColor: theme.palette.grey[50],
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 10,
                            opacity: 0,
                            visibility: "hidden",
                            transition: "all 0.2s ease-in-out",
                            left: "-100%",
                            width: "100%",
                            "& li": {
                                [theme.breakpoints.down('sm')]: {
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
                                    }
                                },
                                "& .react-svg": {
                                    "& svg": {
                                        width: 16,
                                        height: 16,
                                    }
                                },
                            }
                        },
                        "&:hover": {
                            "& .sub-items": {
                                opacity: 1,
                                visibility: "visible",
                            }
                        }
                    }
                }
            }
        }
    }
}));

export default  ProfileSection;
