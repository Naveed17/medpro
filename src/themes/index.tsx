import { useEffect, useMemo, useState } from "react";
// material
import { CssBaseline } from "@mui/material";
import {
    createTheme,
    ThemeProvider
} from "@mui/material/styles";
import palette from "@themes/palette";
import typography from "@themes/typography";
import { shadows, customShadows } from "@themes/shadows";
import componentsOverride from "./overrides";
import { CacheProvider } from "@emotion/react";
import { useRouter } from "next/router";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { configSelector, setDirection, setLocalization } from "@features/base";
import { useAppDispatch, useAppSelector } from "@app/redux/hooks";
import { Localization } from "@app/localization/localization";
import * as locales from "@mui/material/locale";
import moment from "moment-timezone";
type SupportedLocales = keyof typeof locales;


function ThemeConfig({ children }: LayoutProps) {
    const { mode } = useAppSelector(configSelector);
    const router = useRouter();
    const lang: string | undefined = router.locale;
    const [locale, setLocale] = useState<SupportedLocales>(Localization(lang));
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    const dispatch = useAppDispatch();

    useEffect(() => {
        moment.locale(locale.substring(0,2));
        dispatch(setDirection(dir));
        dispatch(setLocalization(locale));
    }, [locale, dir, dispatch]);

    // Create style cache
    const styleCache = createCache({
        key: dir === 'rtl' ? 'muirtl' : 'css',
        stylisPlugins: dir === 'rtl' ? [prefixer, rtlPlugin] : []
    });
    // styleCache.compat = true;

    const themeWithLocale = useMemo(
        () => createTheme({
            palette: { ...palette, mode: mode },
            typography,
            direction: dir,
            shadows: shadows,
            customShadows: customShadows,
            shape: {
                borderRadius: 6,
            },
        }, locales[locale]),
        [dir, locale, mode],
    );
    themeWithLocale.components = componentsOverride(themeWithLocale);

    return (
        <CacheProvider value={styleCache}>
            <ThemeProvider theme={themeWithLocale}>
                <CssBaseline />
                <main dir={dir}>
                    {children}
                </main>
            </ThemeProvider>
        </CacheProvider>
    );
}

export default ThemeConfig;
