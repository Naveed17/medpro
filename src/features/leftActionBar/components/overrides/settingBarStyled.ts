import { styled } from "@mui/material/styles";

const SettingBarStyled = styled("div")(({ theme }) => ({
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
                height: "36px",
                width: "23px",
                path:{
                    fill:theme.palette.primary.main
                }
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
        [theme.breakpoints.down("sm")]: {
            "& .MuiListItemButton-root": {
                borderRadius: 6,
            },
        },
    },
    [theme.breakpoints.down("sm")]: {
        position: "fixed",
        top: "60px",
        height: "100%",
        background: theme.palette.background.paper,
        width: "100%",
        left: 0,
        padding: "0px 20px",
        "& .heading": {
            marginTop: "30px",
        },
    },
}));

export default SettingBarStyled;
