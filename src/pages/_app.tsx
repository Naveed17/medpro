import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import {CssBaseline} from "@mui/material";
import {GlobleStyles} from "@themes/globalStyle";
import {Provider} from "react-redux";
import {store} from "@app/redux/store";
import {ReactElement, ReactNode} from "react";
import AppThemeProvider from "@themes/index";
import '@styles/globals.scss'
import {NextPage} from "next";
import {AnimatePresence} from "framer-motion";
import KeycloakSession from "@app/keycloak/keycloakSession";
import { SWRConfig } from 'swr';
import SwrProvider from "@app/swr/swrProvider";

interface MyAppProps extends AppProps {
    Component: AppProps["Component"] & NextPageWithLayout
}

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}

function MyApp({ Component, pageProps }: MyAppProps) {
    console.log(pageProps);
    // Use the dashLayout defined at the page level, if available
    const getLayout = Component.getLayout ?? ((page) => page)
    return (
        <Provider store={store}>
            <AppThemeProvider>
                <CssBaseline />
                <GlobleStyles>
                    <KeycloakSession session={pageProps.session}>
                        <SwrProvider fallback={pageProps.fallback}>
                            <AnimatePresence
                                exitBeforeEnter
                                initial={false}
                                onExitComplete={() => window.scrollTo(0, 0)}>
                                { getLayout(<Component {...pageProps} />) }
                            </AnimatePresence>
                        </SwrProvider>
                    </KeycloakSession>
                </GlobleStyles>
            </AppThemeProvider>
        </Provider>
  )
}

MyApp.displayName = 'Med Pro';

export default appWithTranslation(MyApp);
