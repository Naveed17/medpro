import {AblyProvider} from 'ably/react';
import * as Ably from 'ably';

const client = new Ably.Realtime.Promise({authUrl: '/api/token', authMethod: 'POST'})

function AblyClient({children}: any) {

    return (<AblyProvider {...{client}}>
        {children}
    </AblyProvider>)
}

export default AblyClient;
