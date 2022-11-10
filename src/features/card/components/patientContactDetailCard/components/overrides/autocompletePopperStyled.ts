import {styled} from "@mui/material/styles";
import {autocompleteClasses} from "@mui/material";

const AutocompletePopperStyled = styled('div')(({ theme }) => ({
    [`& .${autocompleteClasses.paper}`]: {
        boxShadow: 'none',
        margin: 0,
        color: 'inherit',
        fontSize: 13,
    },
}));

export default AutocompletePopperStyled;
