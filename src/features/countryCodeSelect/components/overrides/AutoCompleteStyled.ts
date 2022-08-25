import { styled } from "@mui/material/styles";
import { Autocomplete } from "@mui/material";

const AutoCompleteStyled = styled(Autocomplete)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        color: theme.palette.grey[700],
        border: 'none',
        fieldset: {
            border: "1px solid transparent",
            boxShadow: "none",
        },
        background: "transparent",
        "&:hover": {
            fieldset: {
                border: "1px solid transparent",
                boxShadow: "none",
            },
        },
        "&.Mui-focused": {
            background: "transparent",
            fieldset: {
                border: "1px solid transparent",
                boxShadow: "none",
                outline: "none",
            },
        },
    },
}));
export default AutoCompleteStyled;