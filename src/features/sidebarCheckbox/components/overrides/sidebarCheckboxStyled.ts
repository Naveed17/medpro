import {styled} from "@mui/material/styles";
import {ListItem} from "@mui/material";

type Props = {
    styleprops: string;
    component?: string;
    theme?: any;
    htmlFor?: string;
}

const SidebarCheckboxStyled = styled(ListItem)(({theme}: Props) => ({
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
