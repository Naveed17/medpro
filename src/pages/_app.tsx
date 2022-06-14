import type {AppProps} from 'next/app'
import { appWithTranslation } from 'next-i18next'
import {GlobleStyles} from "@themes/globalStyle";
import {Provider} from "react-redux";
import {store} from "@app/redux/store";
import React, {ReactElement, ReactNode} from "react";
import AppThemeProvider from "@themes/index";
import '@styles/globals.scss';
import {NextPage} from "next";
import {AnimatePresence} from "framer-motion";
import KeycloakSession from "@app/keycloak/keycloakSession";
import SwrProvider from "@app/swr/swrProvider";
import {useRouter} from "next/router";
import AuthGuard from "@app/keycloak/authGuard";

interface MyAppProps extends AppProps {
    Component: AppProps["Component"] & NextPageWithLayout
}

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}

function MyApp({ Component, session, pageProps: {...pageProps } }: MyAppProps) {

    const router = useRouter();
    // Use the dashLayout defined at the page level, if available
    const getLayout = Component.getLayout ?? ((page) => page)
    return (
        <Provider store={store}>
            <AppThemeProvider>
                <GlobleStyles>
                    <KeycloakSession session={session}>
                        <SwrProvider fallback={pageProps.fallback}>
                            <AnimatePresence
                                key={router.route}
                                exitBeforeEnter
                                initial={false}
                                onExitComplete={() => window.scrollTo(0, 0)}>
                                { Component.auth ? (
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

/*MyApp.getInitialProps = async (appContext: AppContext) => {
    let session: Session | null | undefined = undefined
    // getSession works both server-side and client-side but we want to avoid any calls to /api/auth/session
    // on page load, so we only call it server-side.
    if (typeof window === 'undefined')
        session = await getSession(appContext.ctx)
    const appProps = await App.getInitialProps(appContext)
    return { ...appProps, ...((session !== undefined) ? { session } : {}) }
};*/

export default appWithTranslation(MyApp);
