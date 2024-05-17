import Head from "next/head";
import {AnimatePresence} from "framer-motion";
import ErrorBoundary from "@features/errorBoundary";
import React from "react";
import {EnvPattern} from "@lib/constants";
import {fetchAndActivate, getRemoteConfig, getString} from "firebase/remote-config";
import {firebaseCloudSdk} from "@lib/firebase";
import smartlookClient from "smartlook-client";
import {useRouter} from "next/router";
import moment from "moment-timezone";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {useAppSelector} from "@lib/redux/hooks";
import {configSelector} from "@features/base";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFnsV3";
import {LocaleFnsProvider} from "@lib/localization";

function RootLayout({children}: LayoutProps) {
    const router = useRouter();

    const {locale} = useAppSelector(configSelector);

    // Use the dashLayout defined at the page level, if available
    moment.tz.setDefault(moment.tz.guess());
    moment.locale(router.locale);
    // initialise smartlook client
    if (typeof window !== "undefined") {
        const prodEnv = !EnvPattern.some(element => window.location.hostname.includes(element));
        //init remote config
        const remoteConfig = getRemoteConfig(firebaseCloudSdk.firebase);
        remoteConfig.settings.minimumFetchIntervalMillis = 600000;
        if (prodEnv && remoteConfig && !smartlookClient.initialized()) {
            fetchAndActivate(remoteConfig).then(() => {
                const config = JSON.parse(getString(remoteConfig, 'medlink_remote_config'));
                if (config.smartlook && config.countries?.includes(process.env.NEXT_PUBLIC_COUNTRY?.toLowerCase())) {
                    // init smartlook client
                    smartlookClient.init('8ffbddca1e49f6d7c5836891cc9c1e8c20c1c79a', {region: 'eu'});
                }
            });
        }
    }

    return (
        <>
            <Head>
                <title>Med Link</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
            </Head>
            <AnimatePresence
                initial={false}
                mode="popLayout"
                onExitComplete={() => window.scrollTo(0, 0)}>
                <ErrorBoundary>
                    {/* Localization date picker */}
                    <LocalizationProvider
                        adapterLocale={LocaleFnsProvider(locale)}
                        dateAdapter={AdapterDateFns}>
                        {children}
                    </LocalizationProvider>
                </ErrorBoundary>
            </AnimatePresence>
        </>
    )
}

export default RootLayout;
