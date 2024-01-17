import {AblyProvider} from 'ably/react';
import * as Ably from 'ably';
import {useMemo} from "react";

function AblyClient({children, ...pageProps}: any) {
    const client = useMemo(() => new Ably.Realtime.Promise({authUrl: '/api/token', authMethod: 'POST'}), []);

    // console.log("connectionID", client.connection.id)
    return (<AblyProvider {...{client}}>
        {children}
    </AblyProvider>)
}

export default AblyClient;
