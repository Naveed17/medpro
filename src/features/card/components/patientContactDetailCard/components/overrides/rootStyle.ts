import {styled} from "@mui/material/styles";
import {Card} from "@mui/material";

const RootStyled = styled(Card)(({theme}) => ({
    border: "none",
    "& .MuiSelect-select": {
        padding: "0 2rem 0 1rem"
    },
    "& .MuiInputBase-root": {
        background: "no-repeat!important",
        "&:hover": {
            backgroundColor: "none"
        },
    },
    "& fieldset": {
        border: "none!important",
        boxShadow: "none!important"
    },
    "& .MuiCardContent-root": {
        paddingTop: 0
    },
    "& .MuiAppBar-root": {
        border: "none",
        borderBottom: "1px solid #E0E0E0",
        height: 46,
        marginBottom: 12,
        "&.MuiTypography-root": {
            fontSize: 12,
            pt: 0
        }
    },
    "& .MuiToolbar-root": {
        float: "right",
        padding: 0
    },
    "& .MuiAutocomplete-popperDisablePortal": {
        minWidth: "200px"
    },
    "& .phone-handler": {
        // paddingTop: 0
    },
    "& .app-bar-header": {
        marginBottom: 14
    },
    "& .grid-border": {
        border: `1px solid ${theme.palette.grey['A100']}`,
        borderRadius: 4,
        height: 31,
        "& .MuiInputBase-root": {
            paddingLeft: 12
        }
    },
    "& input": {
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis"
    }
}));
export default RootStyled
