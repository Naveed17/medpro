import {styled} from "@mui/material/styles";
import {IconButton} from "@mui/material";

const IconButtonStyled = styled(IconButton)(({theme}) => ({
    width: 30,
    height: 30,
    border: `1px solid ${theme.palette.divider}`,
    background: theme.palette.background.default,
    borderRadius: 8,
    padding: theme.spacing(1.3)
}))

export default IconButtonStyled;
