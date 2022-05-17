import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import {CssBaseline, ThemeProvider} from "@mui/material";
import {darkTheme} from "../themes/darkTheme";
import {lightTheme} from "../themes/lightTheme";
import {Provider} from "react-redux";
import {store} from "../app/store";
import {useState} from "react";
import Layout from "../features/layout/layout";

function MyApp({ Component, pageProps }: AppProps) {
    let [theme, setTheme] = useState('light');
    store.subscribe(() => {
        setTheme(store.getState().theme.mode);
    });

    return (
      <Provider store={store}>
          <ThemeProvider theme={ theme === 'light' ? lightTheme : darkTheme}>
            <CssBaseline />
              <Layout>
                  <Component {...pageProps} />
              </Layout>
          </ThemeProvider>
      </Provider>
  )
}

export default appWithTranslation(MyApp);
