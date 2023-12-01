import {styled} from "@mui/material/styles";

const OphtTableStyled = styled("table")(({theme}) => ({
    cursor: "zoom-in",
    borderCollapse: "collapse",
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
        textAlign: "center",
        fontWeight: "bold"
    },
    "& .valIs0": {
        fontSize: 12,
        textAlign: "center",
        color: "grey"
    },
    "& .col": {
        border: "1px dashed #DDD",
        padding: 2,
        borderRadius: 12,


    }
}));
export default OphtTableStyled;
