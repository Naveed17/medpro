import type {AppProps} from "next/app";
import {appWithTranslation} from "next-i18next";
import {GlobleStyles} from "@themes/globalStyle";
import {Provider} from "react-redux";
import {store} from "@lib/redux/store";
import React, {ReactElement, ReactNode, useMemo} from "react";
import {NextPage} from "next";
import {SnackbarProvider} from "notistack";
// import global style
import "@styles/globals.scss";
import 'react-medium-image-zoom/dist/styles.css';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "leaflet/dist/leaflet.css";
// import moment locales
import "moment/locale/ar-tn";
import "moment/locale/fr";
// import wrap components
import AppThemeProvider from "@themes/index";
import KeycloakSession from "@lib/keycloak/keycloakSession";
import AuthGuard from "@lib/keycloak/authGuard";
import moment from "moment-timezone";
import {FcmLayout} from "@features/base";
import {useRouter} from "next/router";
import ReactQueryProvider from "@lib/reactQuery/reactQueryProvider";
import {buildProvidersTree} from "@lib/routes/buildProvidersTree";
import RootLayout from "@features/base/components/rootLayout/rootLayout";
import {ConditionalWrapper} from "@lib/hooks";
import {CloseSnackbarAction} from "@features/popup";
import AblyClient from "@lib/ably/ablyClient";

interface MyAppProps extends AppProps {
    Component: AppProps["Component"] & NextPageWithLayout;
}

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

function App({Component, pageProps: {session, ...pageProps}}: MyAppProps) {
    const router = useRouter();
    // Use the dashLayout defined at the page level, if available
    moment.tz.setDefault(moment.tz.guess());
    moment.locale(router.locale);

    const ProvidersTree = useMemo(() => buildProvidersTree([
        [Provider, {store}],
        [SnackbarProvider, {
            className: "snackbar-notification",
            preventDuplicate: true,
            action: (key: string) => key !== "offline" && <CloseSnackbarAction id={key}/>,
            maxSnack: 3,
            anchorOrigin: {horizontal: 'right', vertical: 'top'}
        }],
        [AppThemeProvider],
        [GlobleStyles],
        [KeycloakSession, {session: pageProps.session}],
        [ReactQueryProvider, {...pageProps}],
        [RootLayout]
    ]), []); // eslint-disable-line react-hooks/exhaustive-deps
    // Get Layout for pages
    const getLayout = Component.getLayout || ((page) => page);
    const pageKey = router.asPath;

    return (
        <ProvidersTree>
            <ConditionalWrapper
                condition={Component.auth}
                wrapper={(children: any) =>
                    <AuthGuard>
                        <AblyClient>
                            <FcmLayout {...pageProps}>
                                {children}
                            </FcmLayout>
                        </AblyClient>
                    </AuthGuard>}>
                {getLayout(<Component key={pageKey} {...pageProps} />)}
            </ConditionalWrapper>
        </ProvidersTree>
    );
}

App.displayName = "Med Link";

export default appWithTranslation(App);
