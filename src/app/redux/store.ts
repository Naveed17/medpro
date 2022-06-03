import {
    Action,
    configureStore,
    ThunkAction,
} from '@reduxjs/toolkit';
import {ConfigReducer} from "@features/setConfig/reducer";
import {SideBarReducer} from "@features/sideBarMenu/reducer";
import {ProfileMenuReducer} from "@features/profilMenu";
import {CheckListReducer} from "@features/checkList";

export const store = configureStore({
    reducer: {
        theme: ConfigReducer,
        sideBar: SideBarReducer,
        profileMenu: ProfileMenuReducer,
        checkList: CheckListReducer
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
