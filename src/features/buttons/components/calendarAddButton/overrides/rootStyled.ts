import {styled} from "@mui/material/styles";
import {Button} from "@mui/material";

const RootStyled = styled(Button)(({ theme }) => ({
    background: theme.palette.warning.main,
    minWidth: 20,
    minHeight: 30,
    borderRadius: 6,
    '& .MuiSvgIcon-root': {
        fontSize: 18
    }
}))

export default RootStyled;
