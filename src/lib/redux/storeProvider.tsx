import {useRef} from 'react';
import {Provider} from 'react-redux';
import {AppStore, store} from "@lib/redux/store";
import {persistStore} from "redux-persist";
import {Persistor} from "redux-persist/es/types";
import dynamic from 'next/dynamic';

const PersistGateProvider = dynamic(() => import('@lib/redux/persistGateProvider'), {ssr: false});

function StoreProvider({children}: { children: React.ReactNode }) {
    const storeRef = useRef<AppStore>()
    const persistor = useRef<Persistor>()

    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = store();
        persistor.current = persistStore(storeRef.current);
    }

    return (
        <Provider store={storeRef.current}>
            <PersistGateProvider persistor={persistor.current as Persistor}>
                {children}
            </PersistGateProvider>
        </Provider>
    )
}

export default StoreProvider;
