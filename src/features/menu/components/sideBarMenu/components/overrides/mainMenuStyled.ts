import {styled} from "@mui/material/styles";
import {Box} from "@mui/material";
import { MobileContainer } from "@lib/constants";

const MainMenuStyled = styled(Box)(({theme}) => ({
    display: "flex",
    [`@media (max-width: ${MobileContainer}px)`]: {
        flexDirection: "column",
    },
    "& .body-main": {
        flexGrow: 1,
        overflow: "hidden",
    },
    "& .sidenav-main": {
        width: 84,
        flexShrink: 0,
        "& .MuiDrawer-root": {
            display: "block",
            "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: 84,
            },
        },
        "& .nav-logo": {
            margin: "0 auto",
            display: "table",
            marginTop: 4,
        },
        "& .MuiList-root": {
            "&.list-bottom": {
                position: "absolute",
                bottom: 0,
                left: 22,
                 "& .MuiListItem-root":{
                backgroundColor: "transparent",
                  "&:not(.active):hover": {
                    "& .MuiListItemIcon-root": {
                        backgroundColor: theme.palette.info.main,
                        boxShadow: theme.shadows[4],
                        border: `1px solid ${theme.palette.grey["A100"]}`,
                    },
                    }
                },
                "& .mt-2": {
                    marginTop: 6,
                },
            },
            "& .MuiListItem-root": {
                flexDirection: "column",
                zIndex:10,
                "&.active": {
                    "& .MuiListItemIcon-root": {
                        backgroundColor: theme.palette.primary.main,
                        "& svg": {
                            "& path": {
                                fill: theme.palette.grey[50],
                                transition: "all ease-in 0.2s",
                            },
                        },
                    },
                },
                "& .MuiListItemIcon-root": {
                    borderRadius: 10,
                    border: "1px solid transparent",
                    transition: "all ease-in 0.2s",
                    padding: 7,
                    "& svg": {
                        width: 22,
                    },
                },
                "& .MuiListItemText-root": {
                    "& span": {
                        fontSize: 12,
                    },
                },
                ".icon-background":{
                       backgroundColor: theme.palette.primary.main,
                        boxShadow: theme.shadows[4],
                        border: `1px solid ${theme.palette.grey["A100"]}`,
                        position:'absolute',
                        width:39,
                        height:40,
                        borderRadius:10,
                        marginLeft:'auto',
                        marginRight:'auto',
                        zIndex:-1,
                }
            },

            "@media screen and (max-height: 600px)": {
                marginTop: 0,
                "&.list-bottom": {
                    paddingTop: 0,
                    position: "relative",
                    bottom: 0,
                    left: 0,
                },
            },
            "@media screen and (min-height: 750px)": {
                marginTop: 20,
                " &.list-bottom": {
                    position: "absolute",
                    bottom: 0,
                    left: 22,
                },
                "& .action-bar-open": {
                    padding: "10px 0px 10px 20px",
                    backgroundColor: theme.palette.background.paper,
                    overflowY: "auto",
                    overflowX: "hidden",
                    height: "100%",
                    zIndex: 1200,
                    position: "fixed",
                    top: 0,
                    outline: 0,
                    left: 84,
                    borderRight: `1px solid ${theme.palette.divider}`,
                    transition: "all ease-in-out 0.5s",
                    width: 284,
                },
            },
        },
        [`@media (max-width: ${MobileContainer}px)`]: {
            display: "none",
        },
    },
    "& .action-side-nav": {
        width: 0,
        flexShrink: 0,
        overflow: "hidden",
        opacity: 0,
        visibility: "hidden",
        zIndex: -999,
        transition: "all ease-in-out 0.5s",

        "&.active": {
            width: 284,
            opacity: 1,
            backgroundColor: theme.palette.background.paper,
            zIndex: 100,
            visibility: "visible",
        },
        "& .action-bar-open": {
            padding: "10px 0px 10px 20px",
            backgroundColor: theme.palette.background.paper,
            overflowY: "auto",
            height: "100%",
            zIndex: 1200,
            position: "fixed",
            top: 0,
            outline: 0,
            left: 84,
            borderRight: `1px solid ${theme.palette.divider}`,
            transition: "all ease-in-out 0.5s",
            width: 284,
        },
    },
    "& .med-logo": {
        textAlign: "center",
        cursor: "pointer",
        "& span:hover": {
            backgroundColor: theme.palette.info.main,
            boxShadow: theme.customShadows.infoButton,
            borderRadius: 4,
            borderCollapse: "collapse",
            border: `1px solid ${theme.palette.grey["A100"]}`
        },
    }
}));

export default MainMenuStyled;
