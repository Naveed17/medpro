import type { AppContext, AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { GlobleStyles } from "@themes/globalStyle";
import { Provider } from "react-redux";
import { store } from "@app/redux/store";
import React, { ReactElement, ReactNode, useMemo } from "react";
import AppThemeProvider from "@themes/index";
import '@styles/globals.scss';
import { NextPage } from "next";
import { AnimatePresence } from "framer-motion";
import KeycloakSession from "@app/keycloak/keycloakSession";
import SwrProvider from "@app/swr/swrProvider";
import { useRouter } from "next/router";
import AuthGuard from "@app/keycloak/authGuard";
import App from "next/app";
import { getToken } from "next-auth/jwt";

interface MyAppProps extends AppProps {
    Component: AppProps["Component"] & NextPageWithLayout
}

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}

function MyApp({ Component, pageProps: { ...pageProps } }: MyAppProps) {
    const router = useRouter();

    // Use the dashLayout defined at the page level, if available
    const getLayout = Component.getLayout ?? ((page) => page)
    return (
        <Provider store={store}>
            <AppThemeProvider>
                <GlobleStyles>
                    <KeycloakSession session={pageProps.session}>
                        <SwrProvider fallback={pageProps.fallback}>
                            <AnimatePresence
                                exitBeforeEnter
                                initial={false}
                                onExitComplete={() => window.scrollTo(0, 0)}>
                                {Component.auth ? (
                                    <AuthGuard> {getLayout(<Component {...pageProps} />)}</AuthGuard>) : (
                                    <> {getLayout(<Component {...pageProps} />)}</>)}
                            </AnimatePresence>
                        </SwrProvider>
                    </KeycloakSession>
                </GlobleStyles>
            </AppThemeProvider>
        </Provider>
    )
}

MyApp.displayName = 'Med Pro';

// MyApp.getInitialProps = async (appContext: AppContext) => {
//     const request = appContext.ctx.req as any;
//     const jwt = await getToken({
//         req: request
//     });
//     const appProps = await App.getInitialProps(appContext);
//     return { ...appProps, ...((jwt !== undefined) ? { jwt } : {}) }
// };

export default appWithTranslation(MyApp);
