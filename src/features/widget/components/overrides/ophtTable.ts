import {styled} from "@mui/material/styles";

const OphtTableStyled = styled("table")(({theme}) => ({
    cursor: "zoom-in",
    "& tr": {
        background: "#eeeff2"
    },
    "& .title": {
        fontSize: 11,
        fontWeight: "bold"
    },
    "& .center": {
        textAlign: "center"
    },
    "& .subtitle": {
        fontSize: 10,
        textAlign: "center",
        opacity: .5
    },
    "& .val": {
        fontSize: 12,
        textAlign: "center"
    },
    "& .col": {}
}));
export default OphtTableStyled;
