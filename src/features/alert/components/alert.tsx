import Icon from '@themes/urlIcon';
import { alpha, Theme, PaletteColor } from '@mui/material/styles';
import AlertStyled from './overrides/alertStyled';
import { AlertColor, AlertProps, SxProps } from '@mui/material';

type BasicAlertProps = {
    children: React.ReactNode;
    icon?: string;
    color?: AlertColor;
    sx?: SxProps<Theme>;
    props?: AlertProps;
}

function BasicAlert({ children, icon, color, sx, ...props }: BasicAlertProps) {

    return (
        <AlertStyled {...props}
            sx={{
                backgroundColor: (theme: Theme) => alpha((theme?.palette[color as keyof typeof theme.palette] as PaletteColor).main, 0.18),
                '& svg path': {
                    fill: (theme: Theme) => (theme?.palette[color as keyof typeof theme.palette] as PaletteColor).main,
                },
                ...sx,
            }}

            icon={<Icon path={icon as string} />} severity={color as AlertColor}>
            {children}
        </AlertStyled>

    );
}


export default BasicAlert;