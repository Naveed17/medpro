import {styled} from "@mui/material/styles";
import {Card, Theme} from "@mui/material";

const PanelCardStyled = styled(Card)(({theme}) => ({
    // border: "none",
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
    "& textarea": {
        borderColor: theme.palette.common.white,
        borderRadius: 6,
        padding: 6,
        width: "100%",
        backgroundColor: theme.palette.grey["A10"]
    },
    "& .document-container": {
        cursor: "pointer",
        "& .document-card:hover": {
            boxShadow: theme.customShadows.documentButton,
        }
    },
    "& .document-card-image":{
        border: `1px solid ${theme.palette.grey['A300']}`,
        cursor: "pointer"
    },
    "& .image-cover": {
        borderRadius: "10px 10px 0 0",
        width: 150,
        height: 110,
        objectFit: "cover"
    }
}));

export default PanelCardStyled;
