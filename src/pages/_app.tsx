import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { GlobleStyles } from "@themes/globalStyle";
import { Provider } from "react-redux";
import { store } from "@app/redux/store";
import React, { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { AnimatePresence } from "framer-motion";
// import global style
import "@styles/globals.scss";
// import moment locales
import "moment/locale/ar";
import "moment/locale/fr";
// import wrap components
import AppThemeProvider from "@themes/index";
import KeycloakSession from "@app/keycloak/keycloakSession";
import SwrProvider from "@app/swr/swrProvider";
import AuthGuard from "@app/keycloak/authGuard";

interface MyAppProps extends AppProps {
  Component: AppProps["Component"] & NextPageWithLayout;
}

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

function MyApp({ Component, pageProps: { ...pageProps } }: MyAppProps) {
  // Use the dashLayout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <Provider store={store}>
      <AppThemeProvider>
        <GlobleStyles>
          <KeycloakSession session={pageProps.session}>
            <SwrProvider fallback={pageProps.fallback}>
              <AnimatePresence
                exitBeforeEnter
                initial={false}
                onExitComplete={() => window.scrollTo(0, 0)}
              >
                {Component.auth ? (
                  <AuthGuard>
                    {getLayout(<Component {...pageProps} />)}
                  </AuthGuard>
                ) : (
                  <> {getLayout(<Component {...pageProps} />)}</>
                )}
              </AnimatePresence>
            </SwrProvider>
          </KeycloakSession>
        </GlobleStyles>
      </AppThemeProvider>
    </Provider>
  );
}

MyApp.displayName = "Med Pro";

export default appWithTranslation(MyApp);
