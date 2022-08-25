//component styles
import { styled, Theme } from "@mui/system";
import { AppBar } from "@mui/material";

const SubFooterStyled = styled(AppBar)(({ theme }: { theme: Theme }) => ({
    bottom: 0,
    top: 'unset',
    transition: 'all ease-in-out 0.5s',
    [theme.breakpoints.up('sm')]: {
        width: `calc(100% - 84px)`,
        marginLeft: 84,
        "&.opened-sidebar": {
            width: `calc(100% - 368px)`,
            marginLeft: 368,
        },
        '&.open-action-right': {
            width: `calc(100% - 292px)`,
            marginRight: 208,
        },
        '&.open-action-right.opened-sidebar': {
            width: `calc(100% - 576px)`,
            marginLeft: 368,
        }
    },



}));

export default SubFooterStyled
