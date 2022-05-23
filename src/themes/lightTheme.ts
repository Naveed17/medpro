import { createTheme } from "@mui/material";
import palette from "@themes/palette";
import typography from "@themes/typography";
import shadows from "@themes/shadows";

export const lightTheme = createTheme({
    palette: { ...palette , mode : 'light' },
    typography,
    direction: 'ltr',
    shadows: shadows,
    shape: {
        borderRadius: 6,
    }
});
