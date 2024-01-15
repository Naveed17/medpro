import {AblyProvider} from 'ably/react';
import * as Ably from 'ably';

function AblyClient({children, ...pageProps}: any) {
    const client = new Ably.Realtime.Promise({authUrl: '/api/token', authMethod: 'POST'});

    return (<AblyProvider {...{client}}>
        {children}
    </AblyProvider>)
}

export default AblyClient;
