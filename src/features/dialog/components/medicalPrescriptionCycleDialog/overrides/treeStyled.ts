import {styled} from "@mui/material";

const TreeStyled = styled('div')(({theme}) => ({
    ul: {
        listStyle: "none"
    },
    '& .MuiSvgIcon-root': {
        verticalAlign: "middle"
    },
    "& .root": {
        padding: 0
    },
    "& .app": {
        height: "100%",

    },
    "& .treeRoot": {
        height: "100%"
    },
    "& .draggingSource": {
        opacity: "0.3"
    },
    "& .dropTarget": {
        backgroundColor: "#e8f0fe"
    }
}));

export default TreeStyled;
