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
import {CacheProvider} from "@emotion/react";
import {useRouter} from "next/router";
import createCache from "@emotion/cache";
import {prefixer} from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

export default function ThemeConfig({ children, ...pageProps }: any) {
    const router = useRouter();
    const dir = router.locale === 'ar' ? 'rtl': 'ltr';

    // Create style cache
    const styleCache = createCache({
        key: dir === 'rtl' ? 'muirtl': 'css',
        stylisPlugins: dir === 'rtl' ? [prefixer, rtlPlugin] : []
    });
    // cacheRtl.compat = true;

    const themeOptions: any = useMemo(
        () => ({
            palette: { ...palette , mode : pageProps.theme },
            typography,
            direction: pageProps.direction,
            shadows: shadows,
            shape: {
                borderRadius: 6,
            },
        }),
        [pageProps.theme, pageProps.direction]
    );
    const theme = createTheme(themeOptions);
    theme.components = componentsOverride(theme);

    return (
        <CacheProvider value={styleCache}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </CacheProvider>

    );
}

