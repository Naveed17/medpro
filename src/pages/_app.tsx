import type {AppProps} from "next/app";
import {appWithTranslation} from "next-i18next";
import {GlobleStyles} from "@themes/globalStyle";
import {Provider} from "react-redux";
import {store} from "@app/redux/store";
import React, {ReactElement, ReactNode} from "react";
import {NextPage} from "next";
import {AnimatePresence} from "framer-motion";
import {SnackbarProvider} from "notistack";
// import global style
import "@styles/globals.scss";
// import moment locales
import "moment/locale/ar-tn";
import "moment/locale/fr";
// import wrap components
import AppThemeProvider from "@themes/index";
import KeycloakSession from "@app/keycloak/keycloakSession";
import SwrProvider from "@app/swr/swrProvider";
import AuthGuard from "@app/keycloak/authGuard";
import moment from "moment-timezone";
import Head from "next/head";
import {FcmLayout} from "@features/base";


interface MyAppProps extends AppProps {
    Component: AppProps["Component"] & NextPageWithLayout;
}

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

function MyApp({Component, pageProps: {session, ...pageProps}}: MyAppProps) {
    // Use the dashLayout defined at the page level, if available
    moment.tz.setDefault(moment.tz.guess());

    const getLayout = Component.getLayout ?? ((page) => page);
    return (
        <Provider store={store}>
            <SnackbarProvider className={"snackbar-notification"}
                              maxSnack={3}
                              anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
                <AppThemeProvider>
                    <GlobleStyles>
                        <KeycloakSession session={pageProps.session}>
                            <SwrProvider fallback={pageProps.fallback}>
                                <Head>
                                    <title>Med Pro</title>
                                    <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
                                </Head>
                                <AnimatePresence
                                    exitBeforeEnter
                                    initial={false}
                                    onExitComplete={() => window.scrollTo(0, 0)}
                                >
                                    {Component.auth ? (
                                        <AuthGuard>
                                            <FcmLayout>
                                                {getLayout(<Component {...pageProps} />)}
                                            </FcmLayout>
                                        </AuthGuard>
                                    ) : (
                                        <> {getLayout(<Component {...pageProps} />)}</>
                                    )}
                                </AnimatePresence>
                            </SwrProvider>
                        </KeycloakSession>
                    </GlobleStyles>
                </AppThemeProvider>
            </SnackbarProvider>
        </Provider>
    );
}

MyApp.displayName = "Med Pro";

export default appWithTranslation(MyApp);
