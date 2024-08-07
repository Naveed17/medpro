import {SessionProvider} from "next-auth/react";

function KeycloakSession({children, ...pageProps}: LayoutProps) {
    return (
        <SessionProvider
            refetchInterval={5 * 60}
            refetchOnWindowFocus={typeof navigator !== "undefined" && navigator.onLine}
            refetchWhenOffline={false}
            // Provider options are not required but can be useful in situations where
            // you have a short session maxAge time. Shown here with default values.
            {...(pageProps.session !== undefined) ? {session: pageProps.session} : {}}>
            {children}
        </SessionProvider>
    );
}

export default KeycloakSession;
