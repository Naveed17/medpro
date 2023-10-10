import {styled} from "@mui/material";

const TreeStyled = styled('div')(({theme, ...props}: any) => ({
    overflow: "scroll",
    maxHeight: props?.fullScreen ? (props?.innerHeight > 800 ? "670px" : "466px") : "350px",
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
