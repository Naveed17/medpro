import type {AppProps} from "next/app";
import {appWithTranslation} from "next-i18next";
import {GlobleStyles} from "@themes/globalStyle";
import {Provider} from "react-redux";
import {store} from "@lib/redux/store";
import React, {ReactElement, ReactNode} from "react";
import {NextPage} from "next";
import {AnimatePresence} from "framer-motion";
import {SnackbarProvider, useSnackbar} from "notistack";
// import global style
import "@styles/globals.scss";
import 'react-medium-image-zoom/dist/styles.css';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
// import moment locales
import "moment/locale/ar-tn";
import "moment/locale/fr";
// import wrap components
import AppThemeProvider from "@themes/index";
import KeycloakSession from "@lib/keycloak/keycloakSession";
import AuthGuard from "@lib/keycloak/authGuard";
import moment from "moment-timezone";
import Head from "next/head";
import {FcmLayout} from "@features/base";
import ErrorBoundary from "@features/errorBoundary";
import {IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {EnvPattern} from "@lib/constants";
import smartlookClient from "smartlook-client";
import {useRouter} from "next/router";
import {firebaseCloudSdk} from "@lib/firebase";
import {fetchAndActivate, getRemoteConfig, getString} from "firebase/remote-config";
import ReactQueryProvider from "@lib/reactQuery/reactQueryProvider";

interface MyAppProps extends AppProps {
    Component: AppProps["Component"] & NextPageWithLayout;
}

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

const CloseSnackbarAction = ({id}: any) => {
    const {closeSnackbar} = useSnackbar();
    return (
        <IconButton
            className={"snackbar-notification-action"}
            onClick={() => {
                closeSnackbar(id)
            }}>
            <CloseIcon/>
        </IconButton>)
}

function MyApp({Component, pageProps: {session, ...pageProps}}: MyAppProps) {
    const router = useRouter();
    // Use the dashLayout defined at the page level, if available
    moment.tz.setDefault(moment.tz.guess());
    moment.locale(router.locale);

    if (typeof window !== "undefined") {
        const prodEnv = !EnvPattern.some(element => window.location.hostname.includes(element));
        //init remote config
        const remoteConfig = getRemoteConfig(firebaseCloudSdk.firebase);
        remoteConfig.settings.minimumFetchIntervalMillis = 600000;
        if (prodEnv && remoteConfig) {
            fetchAndActivate(remoteConfig).then(() => {
                const config = JSON.parse(getString(remoteConfig, 'medlink_remote_config'));
                if (config.smartlook && config.countries?.includes(process.env.NEXT_PUBLIC_COUNTRY?.toLowerCase())) {
                    // init smartlook client
                    smartlookClient.init('8ffbddca1e49f6d7c5836891cc9c1e8c20c1c79a', {region: 'eu'});
                }
            });
        }
    }
    // Get Layout for pages
    const getLayout = Component.getLayout ?? ((page) => page);
    const pageKey = router.asPath;

    return (
        <Provider store={store}>
            <SnackbarProvider className={"snackbar-notification"}
                              preventDuplicate
                              action={key => key !== "offline" && <CloseSnackbarAction id={key}/>}
                              maxSnack={3}
                              anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
                <AppThemeProvider>
                    <GlobleStyles>
                        <KeycloakSession session={pageProps.session}>
                            <ReactQueryProvider {...pageProps}>
                                <Head>
                                    <title>Med Link</title>
                                    <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
                                </Head>
                                <AnimatePresence
                                    initial={false}
                                    mode="popLayout"
                                    onExitComplete={() => window.scrollTo(0, 0)}>
                                    <ErrorBoundary>
                                        {Component.auth ? (
                                            <AuthGuard>
                                                <FcmLayout {...pageProps}>
                                                    {getLayout(<Component key={pageKey} {...pageProps} />)}
                                                </FcmLayout>
                                            </AuthGuard>
                                        ) : (
                                            <> {getLayout(<Component key={pageKey} {...pageProps} />)}</>
                                        )}
                                    </ErrorBoundary>
                                </AnimatePresence>
                            </ReactQueryProvider>
                        </KeycloakSession>
                    </GlobleStyles>
                </AppThemeProvider>
            </SnackbarProvider>
        </Provider>
    );
}

MyApp.displayName = "Med Link";

export default appWithTranslation(MyApp);
