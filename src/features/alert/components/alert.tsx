import Icon from '@themes/urlIcon';
import { alpha, Theme, PaletteColor } from '@mui/material/styles';
import AlertStyled from './overrides/alertStyled';

export default function BasicAlert({ children, ...props }) {
    const { icon, color, ...rest } = props;
    return (
        <AlertStyled {...rest}
            sx={{
                backgroundColor: (theme: Theme) => alpha((theme?.palette[color as keyof typeof theme.palette] as PaletteColor).main, 0.18),
                '& svg path': {
                    fill: (theme: Theme) => (theme?.palette[color as keyof typeof theme.palette] as PaletteColor).main,
                },
                ...props.sx,
            }}

            icon={<Icon path={icon} />} severity={color}>
            {children}
        </AlertStyled>

    );
}
