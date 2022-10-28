import {ListItem} from '@mui/material';
import {styled} from '@mui/material/styles';

const ListItemStyled = styled(ListItem)(() => ({
    cursor: "pointer",
    borderTop: '1px solid rgb(221, 221, 221)',
    borderColor: "divider",
    px: 0,
    paddingLeft: 0,
    "& .MuiListItemIcon-root": {
        minWidth: 20,
        svg: {
            width: 14,
            height: 14,
        },
    }
}));
export default ListItemStyled