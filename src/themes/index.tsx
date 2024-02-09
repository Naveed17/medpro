import { useEffect, useMemo, useState } from "react";
// material
import { CssBaseline, useTheme } from "@mui/material";
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
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { Localization } from "@lib/localization";
import * as locales from "@mui/material/locale";
import moment from "moment-timezone";
import { Poppins } from 'next/font/google';

const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-poppins',
    weight: ['400', '500', '600', '700']
})

type SupportedLocales = keyof typeof locales;

function ThemeConfig({ children }: LayoutProps) {
    const { mode } = useAppSelector(configSelector);
    const router = useRouter();
    const theme = useTheme();
    const lang: string | undefined = router.locale;
    const locale: SupportedLocales = Localization(lang);
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    const dispatch = useAppDispatch();

    useEffect(() => {
        const lang = locale.substring(0, 2);
        moment.locale(lang === 'ar' ? 'ar-tn' : lang);
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
            components: {
                MuiBackdrop: {
                    styleOverrides: {
                        root: {
                            '&[style*="opacity: 0"]': {
                                pointerEvents: 'none',
                            },
                        },
                    },
                },
            },
            palette: { ...palette, mode: mode },
            typography,
            direction: dir,
            shadows: shadows,
            customShadows: customShadows,
            shape: {
                borderRadius: 6
            },
            breakpoints: {
                values: {
                    ...theme.breakpoints.values,
                    xl: 1440
                }
            }
        }, locales[locale]),
        [dir, locale, mode],
    );
    themeWithLocale.components = componentsOverride(themeWithLocale);

    return (
        <CacheProvider value={styleCache}>
            <ThemeProvider theme={themeWithLocale}>
                <CssBaseline />
                <main dir={dir} className={`${poppins.className}`}>
                    {children}
                </main>
            </ThemeProvider>
        </CacheProvider>
    );
}

export default ThemeConfig;
