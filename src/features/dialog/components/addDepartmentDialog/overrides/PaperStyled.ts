import {styled} from "@mui/material/styles";
import {Form} from "formik";

const PaperStyled = styled(Form)(({theme}) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: 0,
    height: "100%",
    border: "none",
    minWidth: "650px",
    [theme.breakpoints.down("md")]: {
        minWidth: 0,
        width: "100%",
    },
    boxShadow: theme.customShadows.motifDialog,
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(0),
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
        marginRight: theme.spacing(-2),
        borderTop: `3px solid ${theme.palette.grey["A700"]}`,
    },
}));

export default PaperStyled;
