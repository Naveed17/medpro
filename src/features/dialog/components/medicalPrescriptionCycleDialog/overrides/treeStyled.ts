import {styled} from "@mui/material";

const TreeStyled = styled('div')(() => ({
    //height: "100%",
    overflow: "scroll",
    maxHeight: "306px",
    ul: {
        listStyle: "none"
    },
    '& .MuiSvgIcon-root': {
        verticalAlign: "middle"
    },
    "& .root": {
        padding: 0
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
