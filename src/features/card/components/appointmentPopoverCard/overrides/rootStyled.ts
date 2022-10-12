import {styled} from "@mui/material/styles";
import {Paper} from "@mui/material";

const RootStyled = styled(Paper)(({theme}) => ({
    minHeight: 130,
    borderRadius: "8px",
    overflow: "auto",
    [theme.breakpoints.down('sm')]: {
        width: "90%"
    },
    "& .badge": {
        padding: "0 .5rem",
        verticalAlign: "center",
        width: "100%",
        transform: "rotate(270deg)",
        transformOrigin: "0 0",
        position: "absolute",
        top: "7rem",
        left: 0,
        "& .MuiTypography-root":{
            color: "#fff"
        }
    }
}));
export default RootStyled;
