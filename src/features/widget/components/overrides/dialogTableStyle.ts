import {styled} from "@mui/material/styles";

const DialogTableStyled = styled("table")(({theme}) => ({
    tableLayout: "fixed",
    width: "100%",
    "& .MuiAutocomplete-root": {
        "& .MuiOutlinedInput-root.MuiInputBase-sizeSmall": {
            padding: 0
        },
        "& .MuiAutocomplete-input": {
            textAlign: "center"
        }
    },
    "& tr": {
        // background: "#eeeff2"
    },
    "& .title": {
        fontSize: 11,
        fontWeight: "bold",
        margin: 5
    },
    "& .tt": {
        fontSize: 14,
        textAlign: "center",
        margin: 5,
    },
    "& .center": {
        textAlign: "center"
    },
    "& .subtitle": {
        fontSize: 12,
        textAlign: "center",
        opacity: .5
    },
    "& .val": {
        fontSize: 12,
        textAlign: "center"
    },
    "& .col": {
        border: "1px solid #80808030",
    },
    borderCollapse: "collapse"

}));
export default DialogTableStyled;
