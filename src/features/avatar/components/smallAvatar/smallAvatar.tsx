import {Avatar, styled} from "@mui/material";

const SmallAvatar = styled(Avatar)(({theme}) => ({
    width: 20,
    height: 20,
    borderRadius: 20,
    border: `2px solid ${theme.palette.background.paper}`
}));

export default SmallAvatar;
