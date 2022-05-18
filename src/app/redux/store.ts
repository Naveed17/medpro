import {
    Action,
    configureStore,
    ThunkAction,
} from '@reduxjs/toolkit';
import {ConfigReducer} from "@features/setConfig/reducer";

export const store = configureStore({
    reducer: {
        theme: ConfigReducer
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
    >;
