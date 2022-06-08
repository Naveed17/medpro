import {useEffect, useMemo, useState} from "react";
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
import {configSelector, setDirection, setLocalization} from "@features/setConfig";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {Localization} from "@app/localization/localization";
import * as locales from "@mui/material/locale";
type SupportedLocales = keyof typeof locales;


function ThemeConfig({ children }: LayoutProps) {
    const { mode } = useAppSelector(configSelector);
    const router = useRouter();
    const lang: string | undefined = router.locale;
    const [locale, setLocale] = useState<SupportedLocales>(Localization(lang));
    const dir = lang === 'ar' ? 'rtl': 'ltr';
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setDirection(dir));
        dispatch(setLocalization(locale));
    }, [locale, dir, dispatch]);

    // Create style cache
    const styleCache = createCache({
        key: dir === 'rtl' ? 'muirtl': 'css',
        stylisPlugins: dir === 'rtl' ? [prefixer, rtlPlugin] : [],
        prepend: true
    });
    // styleCache.compat = true;

    const themeWithLocale = useMemo(
        () => createTheme({
            palette: {...palette, mode: mode },
            typography,
            direction: dir,
            shadows: shadows,
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
