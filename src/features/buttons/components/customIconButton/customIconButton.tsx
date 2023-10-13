import {IconButton, useTheme} from "@mui/material";
import {PaletteColor} from "@mui/material/styles";

function CustomIconButton({...props}) {
    const {variant, color, ...other} = props;
    const theme = useTheme();

    return (
        <IconButton
            sx={{
                borderRadius: 1,
                ...(color && {
                    backgroundColor: (theme.palette[color as keyof typeof theme.palette] as PaletteColor).main,
                    color: (theme.palette[color as keyof typeof theme.palette] as PaletteColor).contrastText
                }),
                "&:hover": {backgroundColor: (theme.palette[color as keyof typeof theme.palette] as PaletteColor).main}
            }}
            {...other}
        />
    );
}

export default CustomIconButton;
