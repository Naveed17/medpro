import {styled} from "@mui/material/styles";
import {Box} from "@mui/material";

const ContainerLayoutStyled = styled(Box)(({theme}) => ({
    "& .bottom-section": {
        background: theme.palette.background.paper,
        padding: theme.spacing(1),
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(0),
        marginRight: theme.spacing(-2),
        position: "fixed",
        bottom: 0,
        left: 0,
        zIndex: 1,
        width: "100%",
        borderTop: `3px solid ${theme.palette.background.default}`,
    }
}));
export default ContainerLayoutStyled;
