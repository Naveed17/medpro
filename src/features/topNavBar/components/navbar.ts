//components styles
import {styled} from "@mui/material/styles";
import {AppBar} from "@mui/material";
import {pxToRem} from "@themes/formatFontSize";

const Navbar = styled(AppBar)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    "& .btn": {
        marginRight: pxToRem(24),
        [theme.breakpoints.down("sm")]: {
            marginRight: 5,
        },
    },
    "& .topbar-nav": {
        display: "flex",
        marginLeft: "auto",
        padding: 0,
        "& .custom-badge": {
            "& .MuiBadge-badge": {
                minWidth: 14,
                color: theme.palette.common.black,
                height: 14,
                fontSize: 10,
                padding: 0,
                top: 10,
                right: 10,
            },
            "&.badge": {
                [theme.breakpoints.down("md")]: {
                    display: "none",
                },
            },
            "& li": {
                padding: 0,
                minHeight: pxToRem(20),
                linHeight: 0,
                "&:hover": {
                    backgroundColor: "transparent",
                },
            },
            "&:not(:last-child)": {
                marginRight: 20,
            },
            "&:nth-of-type(3)": {
                [theme.breakpoints.down("md")]: {
                    marginRight: 0,
                },
            },
        },
    },
    "& .topbar-account": {
        "& > li:hover": {
            backgroundColor: "transparent",
        },
    },
    "& .nav-logo": {
        lineHeight: 0,
    },
    [theme.breakpoints.up("sm")]: {
        width: `calc(100% - ${pxToRem(84)})`,
        transition: "all ease-in-out 0.5s",
        marginLeft: pxToRem(84),
        paddingRight: 0,
        "&.openedSidebar": {
            width: `calc(100% - ${pxToRem(368)})`,
            marginLeft: pxToRem(368),
        },
    },
    [theme.breakpoints.down("sm")]: {
        paddingTop: 10,
    },
}));

export default Navbar
