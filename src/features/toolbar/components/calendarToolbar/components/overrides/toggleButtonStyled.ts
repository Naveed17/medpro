import {styled} from '@mui/material/styles';
import {ToggleButton, ToggleButtonProps} from "@mui/material";

const ToggleButtonStyled = styled(ToggleButton)<ToggleButtonProps>(() => ({
    width: 34,
    height: 34,
    padding: 0,
    color: "white",
    '&:hover': {
        color: "black"
    }
}));

export default ToggleButtonStyled;
