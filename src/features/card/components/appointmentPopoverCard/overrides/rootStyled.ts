import {styled} from "@mui/material/styles";
import {Paper} from "@mui/material";

const RootStyled = styled(Paper)(({theme}) => ({
    minHeight: 120,
    borderRadius: "8px",
    overflow: "auto",
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
        width: "90%"
    },
    "& .badge": {
        padding: "0 .5rem",
        verticalAlign: "center",
        transform: "rotate(270deg)",
        transformOrigin: "0 0",
        position: "absolute",
        bottom: -13,
        left: 6,
        "& .MuiTypography-root": {
            color: "#fff"
        }
    }
}));
export default RootStyled;
