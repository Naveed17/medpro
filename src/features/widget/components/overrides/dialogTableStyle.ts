import {styled} from "@mui/material/styles";

const DialogTableStyled = styled("table")(({theme}) => ({
    "& .MuiAutocomplete-root": {
        "& .MuiOutlinedInput-root.MuiInputBase-sizeSmall": {
            padding: 0
        },
        "& .MuiAutocomplete-input": {
            textAlign: "center"
        }
    },
    "& tr": {
         background: "#eeeff2"
    },
    "& .title": {
        fontSize: 14,
        fontWeight: "bold"
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
    /*"& .col": {
        border: "1px dashed black",
    },
    borderCollapse: "collapse"*/

}));
export default DialogTableStyled;
