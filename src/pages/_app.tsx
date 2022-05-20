import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import {CssBaseline} from "@mui/material";
import {GlobleStyles} from "@themes/globalStyle";
import {Provider} from "react-redux";
import {store} from "@app/redux/store";
import {useState} from "react";
import Index from "@features/base/layout";
import {EmotionCache} from "@emotion/utils";
import AppThemeProvider from "@themes/index";
import '@styles/globals.scss'

interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

function MyApp({ Component, emotionCache, pageProps }: MyAppProps) {
    let [theme, setTheme] = useState('light');
    let [direction, setDirection] = useState('rtl');

    store.subscribe(() => {
        setTheme(store.getState().theme.mode);
        setDirection(store.getState().theme.direction);
    });

    return (
        <Provider store={store}>
            <AppThemeProvider theme={ theme } direction={ direction }>
                <Index>
                  <CssBaseline />
                  <GlobleStyles>
                     <Component {...pageProps} />
                  </GlobleStyles>
                </Index>
            </AppThemeProvider>
        </Provider>
  )
}

MyApp.displayName = 'Med Pro';

export default appWithTranslation(MyApp);
