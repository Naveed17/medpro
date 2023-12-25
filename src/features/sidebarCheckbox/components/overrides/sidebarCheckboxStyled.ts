import {styled} from "@mui/material/styles";
import {ListItem} from "@mui/material";

const SidebarCheckboxStyled = styled(ListItem)(({theme}) => ({
    cursor: 'pointer',
    border: "none",
    width: "fit-content",
    '& .MuiCheckbox-root': {
        width: '30px'
    },
    '& .MuiButtonBase-root': {
        width: "fit-content"
    }
}));
export default SidebarCheckboxStyled;
