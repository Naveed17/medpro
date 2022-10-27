import {styled} from "@mui/material/styles";

const TableStyled = styled("table")(({theme}) => ({
    backgroundColor: "white",
    "& .title": {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 14
    },
    "& .drugName": {
        fontSize: 11,
        color: theme.palette.grey["600"]
    },
    "& .detail": {
        fontSize: 10,
        color: theme.palette.back.dark
    },
    "& .patientName": {
        fontWeight: 500,
        fontSize: 13
    },
    "& .docDate": {
        fontSize: 9,
        textAlign: "right"
    },
    "& .certifContent": {
        color: theme.palette.grey["600"],
        fontSize: 14,
        lineHeight: 3
    },
    "& .subTitle": {
        fontSize: 12,
        lineHeight: 3
    },
    "& .line": {
        color: theme.palette.back.dark,
        fontSize: 13
    },
    "& .feesHeader": {
        fontSize: 13,
        fontWeight: "bold"
    },
    "& .feesLine": {
        fontSize: 12,
        color: theme.palette.back.dark
    },
    "& .docInfo":{
        fontSize: 9,
        color: theme.palette.grey[600]
    },
    "& .docName":{
        fontSize: 11,
        fontWeight: "bold",
        color: theme.palette.grey[600]
    },
    "& .subInfo":{
        fontSize: 9,
        color: theme.palette.grey[600],
        textAlign: "right"
    }
}));

export default TableStyled;
