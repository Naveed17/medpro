import {styled} from "@mui/material/styles";
import {Form} from "formik";

const PaperStyled = styled(Form)(({theme}) => ({
    borderRadius: 0,
    height: "100%",
    [theme.breakpoints.down("md")]: {
        minWidth: 0,
        width: "100%",
    },
    display: "flex",
    flexDirection: "column",
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
    ".react-svg": {
        svg: {
            width: 20,
            height: 20,
        },
    },
    "& .bottom-section": {
        background: theme.palette.background.paper,
        padding: theme.spacing(1),
        marginTop: "auto",
        marginLeft: theme.spacing(-2),
        marginRight: theme.spacing(-2)
    },
}));

export default PaperStyled;
