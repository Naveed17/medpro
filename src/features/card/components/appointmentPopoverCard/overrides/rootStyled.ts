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
        borderTopLeftRadius:6,
        borderTopRightRadius:6,
        "& .MuiTypography-root": {
            color: "#fff"
        }
    },
    "& .MuiChip-label": {
        fontSize: 11,
        wordBreak: "break-all"
    },
    ".btn-actions":{
        button:{
        borderRadius: 10,
        padding: theme.spacing(0.5),
        width:34,
        height:34,
        "&.btn-rdv":{
        backgroundColor: theme.palette.warning.main,
        },
        '&.btn-waiting-room':{
            backgroundColor: theme.palette.primary.main,
        }
        }

    
}
}));
export default RootStyled;
