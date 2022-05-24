import React, {useCallback, useEffect} from "react";
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
import {configSelector, setDirection} from "@features/setConfig";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";

export default function ThemeConfig({ children}: any) {
    const { mode } = useAppSelector(configSelector);
    const router = useRouter();
    const dir = router.locale === 'ar' ? 'rtl': 'ltr';
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setDirection(dir));
    }, [dir, dispatch]);

    // document.dir = dir;

    // Create style cache
    const styleCache = createCache({
        key: dir === 'rtl' ? 'muirtl': 'css',
        stylisPlugins: dir === 'rtl' ? [prefixer, rtlPlugin] : []
    });
    // styleCache.compat = true;

    const themeOptions: any = useMemo(
        () => ({
            palette: { ...palette , mode : mode },
            typography,
            direction: dir,
            shadows: shadows,
            shape: {
                borderRadius: 6,
            },
        }),
        [mode, dir]
    );
    const theme = createTheme(themeOptions);
    theme.components = componentsOverride(theme);

    return (
        <CacheProvider value={styleCache}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <main dir={dir}>
                    {children}
                </main>
            </ThemeProvider>
        </CacheProvider>

    );
}

