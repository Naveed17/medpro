import {Box} from "@mui/material";
import {styled} from "@mui/material/styles";

const RootStyled = styled(Box)(({theme}) => ({
    "& .item": {
        display: "flex",
        alignItems: "center",
        marginBottom: theme.spacing(1),
        svg: {marginRight: theme.spacing(1)}
    }
}));

export default RootStyled;
