import {IconButton, styled, IconButtonProps, SxProps, Theme} from "@mui/material";

interface ButtonProps extends IconButtonProps {
    sx?: SxProps<Theme>
}

const ButtonSyled = styled(IconButton)<ButtonProps>(({theme}) => ({
    backgroundColor: theme.palette.grey["A500"],
    width: 34,
    height: 34,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1.2),
    '.react-svg div': {
        display: 'flex'
    }
}));

export default ButtonSyled;
