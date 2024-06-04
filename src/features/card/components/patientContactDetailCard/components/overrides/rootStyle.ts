import {styled} from "@mui/material/styles";
import {Card} from "@mui/material";

const RootStyled = styled(Card)(({theme}) => ({
    border: "none",
    borderRadius:0,
    boxShadow: "none",
    
    
    "& .MuiAutocomplete-popperDisablePortal": {
        minWidth: "200px"
    },
    
    
    "& .grid-border": {
        width: "100%",
        border: `1px solid ${theme.palette.grey['A100']}`,
        borderRadius: 6,
        height: 38,
        "& .MuiInputBase-root": {
            paddingLeft: 12
        }
    },
    
    "& .grid-container-border": {
        borderRadius: 8,
        border: `1px dashed ${theme.palette.grey['A100']}`,
        padding: '6px 0'
    },
    ".required":{
        color: theme.palette.error.main
    }
}));
export default RootStyled
