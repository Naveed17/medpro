import {Persistor} from "redux-persist/es/types";
import {PersistGate} from 'redux-persist/integration/react';

function PersistGateProvider({children, persistor}: { children: React.ReactNode, persistor: Persistor }) {
    return (
        <PersistGate loading={null} persistor={persistor}>
            {children}
        </PersistGate>
    )
}

export default PersistGateProvider
