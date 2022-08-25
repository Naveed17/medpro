import { styled } from '@mui/material/styles';
import {ToggleButton, ToggleButtonProps} from "@mui/material";

const ToggleButtonStyled = styled(ToggleButton)<ToggleButtonProps>(({ theme}) => ({
    color: "white",
    '&:hover': {
        color: "black"
    }
}));

export default ToggleButtonStyled;
