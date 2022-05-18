import React from "react";
import { useMemo } from "react";
// material
import { CssBaseline } from "@mui/material";
import {
    createTheme,
    ThemeProvider
} from "@mui/material/styles";
import palette from "@themes/palette";
import typography from "@themes/typography";
import shadows from "@themes/shadows";
import componentsOverride from "./overrides";
import {useAppSelector} from "@app/redux/hooks";
import {setConfig} from "@features/setConfig/selectors";

// ----------------------------------------------------------------------


export default function ThemeConfig({ children, ...pageProps }: any) {
    console.log(pageProps.theme);
    const config = useAppSelector(setConfig);

    const themeOptions: any = useMemo(
        () => ({
            palette: { ...palette , mode : pageProps.theme },
            typography,
            direction: config.direction,
            shadows: shadows,
            shape: {
                borderRadius: 6,
            },
        }),
        [pageProps.theme]
    );
    const theme = createTheme(themeOptions);
    theme.components = componentsOverride(theme);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}
