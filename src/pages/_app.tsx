import '@styles/globals.scss'
import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import {CssBaseline} from "@mui/material";
import {GlobleStyles} from "@themes/globalStyle";
import {Provider} from "react-redux";
import {store} from "@app/redux/store";
import {useState} from "react";
import Layout from "../features/layout/layout";
import {EmotionCache} from "@emotion/utils";
import AppThemeProvider from "@themes/index";
interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

function MyApp({ Component, emotionCache, pageProps }: MyAppProps) {
    let [theme, setTheme] = useState('light');
    store.subscribe(() => {
        setTheme(store.getState().theme.mode);
    });

    return (
      <Provider store={store}>
          <AppThemeProvider theme={ theme }>
              <Layout>
                  <GlobleStyles>
                     <CssBaseline />
                     <Component {...pageProps} />
                  </GlobleStyles>
              </Layout>
          </AppThemeProvider>
      </Provider>
  )
}

MyApp.displayName = 'Med Pro';

export default appWithTranslation(MyApp);
