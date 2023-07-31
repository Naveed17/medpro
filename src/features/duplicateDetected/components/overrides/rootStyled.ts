import {Box} from "@mui/material";
import {styled} from "@mui/material/styles";

const RootStyled = styled(Box)(({theme}) => ({
    [theme.breakpoints.up("md")]: {
        width: "100%",
    },
    "& .modal-header": {
        backgroundColor: theme.palette.primary.main,
        padding: "1rem" + " " + "2rem",
        "& h6": {
            fontWeight: theme.typography.fontWeightMedium,
            color: theme.palette.common.white,
        },
    },
    "& .modal-body": {
        minHeight: "13.5rem",
        overflow: "auto",
        display: "flex",
        //justifyContent: "center",
        alignItems: "flex-start",
        [theme.breakpoints.down("sm")]: {
            maxHeight: "100%",
            "& > .MuiList-root": {
                borderLeft: "none",
            },
        },
        "& .list-main": {
            display: "-webkit-inline-box",
            padding: theme.spacing(0),
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: theme.palette.divider,
            borderRadius: 0.7,
            //overflow: "hidden",
            "& .list-item": {
                width: 262,
                overflow: "hidden",
                padding: theme.spacing(0),

                alignItems: "flex-start",
                "&.except1,&.except2": {
                    borderWidth: "0 0 0 1px",
                    borderStyle: "solid",
                    borderColor: theme.palette.divider,
                    [theme.breakpoints.down("md")]: {
                        "&.except1": {
                            borderWidth: "0 ",
                        },
                    },
                },
                "&.first": {
                    li: {
                        backgroundColor: theme.palette.background.default,
                    },
                    [theme.breakpoints.down("md")]: {
                        width: 150,
                        display: "none",
                    },
                },
                "& .child-list-main": {
                    padding: theme.spacing(0),
                    width: "100%",
                    li: {
                        paddingLeft: theme.spacing(0),
                        paddingRight: theme.spacing(1),
                    },
                    "& .list-subheader": {
                        display: "flex",
                        lineHeight: "80%",
                        alignItems: "center",
                        color: "text.primary",
                        backgroundColor: theme.palette.background.default,
                        fontWeight: "normal",
                        fontFamily: "Roboto",
                        borderWidth: "0 0 1px 0",
                        borderColor: theme.palette.divider,
                        borderStyle: "solid",
                        padding: "1rem",
                        "&.first": {
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.common.white,
                            fontWeight: "normal",
                            fontFamily: "Roboto",
                        },
                        "&.second": {
                            padding: "0 0 0.8px 4px",
                            marginLeft: 1
                        },
                    },
                    "& .alert-attribute-change": {
                        width: 22,
                        height: 22,
                        opacity: 0.5,
                        backgroundColor: theme.palette.error.main
                    },
                    "& .alert-appointments-change": {
                        position: "absolute",
                        right: "2.4rem",
                        width: 22,
                        height: 22,
                        backgroundColor: theme.palette.error.main
                    }
                },
            },
        },
    },
}));
export default RootStyled;
