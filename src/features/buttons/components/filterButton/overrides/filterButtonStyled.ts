import {styled} from "@mui/material/styles";
import {Button} from "@mui/material";

const FilterButtonStyled = styled(Button)(({theme}) => ({
        position: 'fixed',
        bottom: 50,
        transform: 'translateX(-50%)',
        left: '50%',
        zIndex: 999
    }
));

export default FilterButtonStyled;
