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
        borderRadius: "6px 0px 0px 6px",
        height: "55px",
        "& .MuiListItemButton-root": {
            borderRadius: "6px 0px 0px 6px",
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
                    fontFamily: "Poppins",
                },
            },
        },
        "&.active": {
            backgroundColor: theme.palette.grey['A700'],
            "& .MuiListItemButton-root": {
                borderRadius: "6px 0px 0px 6px",
                "&:hover": {
                    boxShadow: 'none',
                }
            },
            "& .MuiListItemText-root": {
                span: {
                    color: theme.palette.text.primary,
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
}));

export default SettingBarStyled;
