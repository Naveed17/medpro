import {Persistor} from "redux-persist/es/types";
import {PersistGate} from 'redux-persist/integration/react';
import {useRef} from "react";
import {AppStore} from "@lib/redux/store";
import {persistStore} from "redux-persist";

function PersistGateProvider({children, store}: { children: React.ReactNode, store: AppStore }) {
    const persistor = useRef<Persistor>();

    if (!persistor.current) {
        // Create the persistor instance the first time this renders
        persistor.current = persistStore(store);
    }

    return (
        <PersistGate loading={null} persistor={persistor.current}>
            {children}
        </PersistGate>
    )
}

export default PersistGateProvider
