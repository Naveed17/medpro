import {styled} from "@mui/material/styles";
import {TextField} from "@mui/material";

const SearchField = styled(TextField)(({ theme }) => ({
    borderRadius: 10,
    borderColor: theme.palette.divider,
    "&:hover": {
        border: theme.palette.primary.main,
    },
    "fieldset": {
        borderRadius: 10
    }
}));
export default SearchField;