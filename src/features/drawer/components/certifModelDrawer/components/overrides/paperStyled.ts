import {styled} from "@mui/material/styles";
import {Form} from "formik";

const PaperStyled = styled(Form)(({theme}) => ({
    backgroundColor: "#F0F7FA",
    borderRadius: 0,
    minWidth: "650px",
    border: "none",
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(0),
    [theme.breakpoints.down("md")]: {
        minWidth: 0,
    },
    "& .container": {
        maxHeight: 680,
        overflowY: "auto",
        "& .MuiCard-root": {
            border: "none",
            "& .MuiCardContent-root": {
                padding: theme.spacing(2),
            },
        },
    },
    "& .bottom-section": {
        background: theme.palette.background.paper,
        padding: theme.spacing(1),
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(-2),
        marginRight: theme.spacing(-2),
        position: "fixed",
        width: "650px",
        bottom: 0,
        borderTop: `3px solid ${theme.palette.grey["A700"]}`,
        [theme.breakpoints.down("md")]: {
            width: "100%",
        },
    },
    "& fieldset legend": {
        display: "none",
    },
}));

export default PaperStyled;
