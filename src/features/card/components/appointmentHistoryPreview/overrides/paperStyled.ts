import {styled} from "@mui/system";
import {Paper} from "@mui/material";

const PaperStyled = styled(Paper)(({theme}) => ({
    borderRadius: "8px",
    overflow: "auto",
    [theme.breakpoints.down('sm')]: {
        width: "90%"
    }
}))

export default PaperStyled;
