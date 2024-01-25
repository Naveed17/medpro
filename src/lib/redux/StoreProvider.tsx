import {useRef} from 'react'
import {Provider} from 'react-redux'
import {AppStore, store} from "@lib/redux/store";
import {PersistGate} from 'redux-persist/integration/react';
import {persistStore} from "redux-persist";
import {Persistor} from "redux-persist/es/types";

export default function StoreProvider({children,}: { children: React.ReactNode }) {
    const storeRef = useRef<AppStore>()
    const persistor = useRef<Persistor>()

    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = store();
        persistor.current = persistStore(storeRef.current);
    }

    return (
        <Provider store={storeRef.current}>
            <PersistGate loading={null} persistor={persistor.current as Persistor}>
                {children}
            </PersistGate>
        </Provider>
    )
}
