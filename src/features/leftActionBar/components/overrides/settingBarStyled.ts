import { MobileContainer } from "@lib/constants";
import {styled} from "@mui/material/styles";

const SettingBarStyled = styled("div")(({theme}) => ({
    "& .heading": {
        marginTop: "6px",
        bottom: "24px",
        fontFamily: "Poppins",
        "@media(max-height: 750px)": {
            marginTop: "auto",
            marginBottom: "auto",
        },
    },
    "& .MuiListItem-root": {
        transition: "all ease-in 0.3s",
        marginBottom: "4px",
        borderRadius: theme.shape.borderRadius,
        height: "55px",
        "& .MuiListItemButton-root": {
            borderRadius: theme.shape.borderRadius,
            "&:hover": {
                backgroundColor: "transparent",
                boxShadow: theme.shadows[3],
                "& .MuiListItemText-root": {
                    span: {
                        color: theme.palette.text.primary,
                    },
                },
            },
            "& .MuiListItemIcon-root": {
                minWidth: "30px",
            },
            "& .MuiListItemIcon-root svg": {
                height: "28",
                width: "23px"
            },
            "& .MuiListItemText-root": {
                "& span": {
                    color: theme.palette.text.secondary,
                    fontSize: "14px",
                    fontWeight:500,
                },
            },
        },
        "&.active": {
            backgroundColor: theme.palette.primary.lighter,
            "& .MuiListItemButton-root": {
                borderRadius: theme.shape.borderRadius,
                "&:hover": {
                    boxShadow: 'none',
                }
            },
            "& .MuiListItemText-root": {
                span: {
                    color: theme.palette.primary.main,
                },
            },
            ".react-svg.arrow-down":{
             transition:"all .3s",  
             transform:"scale(-1)",
             svg:{
                path:{
                    fill:theme.palette.primary.main
                }
             }
            },
            "&:hover":{
             ".MuiListItemText-root": {
                span: {
                    color: theme.palette.primary.main,
                },
            },
            }
        },
        "@media(max-height: 750px)": {
            height: "auto",
            marginBottom: "2px",
        },
        [`@media (max-width: ${MobileContainer}px)`]: {
            "& .MuiListItemButton-root": {
                borderRadius: 6,
            },
        },
        
    },
    [`@media (max-width: ${MobileContainer}px)`]: {
        position: "fixed",
        top: "60px",
        height: "100%",
        background: theme.palette.background.paper,
        width: "100%",
        left: 0,
        padding: "0px 20px",
        paddingBottom: theme.spacing(5),
        overflow: 'scroll',
        "& .heading": {
            marginTop: "30px",
        },
    },
    ".sub-menu":{
            borderRadius: theme.shape.borderRadius,
            '.MuiListItemText-primary':{
             color:theme.palette.text.secondary,
             fontWeight:500,
            },
            "&.active":{
                backgroundColor: theme.palette.primary.lighter,
                "& .MuiListItemText-root": {
                    span: {
                        color: theme.palette.primary.main,
                    },
                }
            }
        },
}));

export default SettingBarStyled;
