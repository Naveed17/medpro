import { IconButton, useTheme } from "@mui/material";
import { PaletteColor } from "@mui/material/styles";
import IconUrl from "@themes/urlIcon";

function CustomIconButton({ ...props }) {
    const { icon, iconProps, variant, color = "back", sx, className = "", ...other } = props;
    const theme = useTheme();

    return (
        <IconButton
            sx={{
                borderRadius: 1,
                ...(color && {
                    backgroundColor: (theme.palette[color as keyof typeof theme.palette] as PaletteColor).main,
                    color: (theme.palette[color as keyof typeof theme.palette] as PaletteColor).contrastText,
                    "&:hover": { backgroundColor: (theme.palette[color as keyof typeof theme.palette] as PaletteColor).main }
                }),
                ...(sx && sx),

            }}
            className={`custom-icon-button ${className}`}
            children={props.children || <IconUrl path={icon} {...iconProps} />}
            {...other}

        />
    );
}

export default CustomIconButton;
