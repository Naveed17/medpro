import {Action, configureStore, ThunkAction} from "@reduxjs/toolkit";
import {ConfigReducer} from "@features/base/reducer";
import {SideBarReducer} from "@features/sideBarMenu/reducer";
import {ProfileMenuReducer} from "@features/profilMenu";
import {CheckListReducer} from "@features/checkList";
import {userReducer} from "@features/user";
import {addPatientReducer, appointmentReducer, stepperProfileReducer} from "@features/tabPanel";
import {QsSidebarReducer} from "@features/leftActionBar";
import {tableReducer} from "@features/table";
import {ConsultationReducer} from "@features/toolbar";
import {AgendaReducer} from "@features/calendar";
import {DialogReducer, dialogMoveAppointmentReducer} from "@features/dialog";
import {timerReducer} from "@features/card/components/cipCard";


export const store = configureStore({
    reducer: {
        theme: ConfigReducer,
        sideBar: SideBarReducer,
        profileMenu: ProfileMenuReducer,
        checkList: CheckListReducer,
        consultationDetails: ConsultationReducer,
        user: userReducer,
        addPatientSteps: addPatientReducer,
        stepperProfile: stepperProfileReducer,
        tableState: tableReducer,
        qsSidebar: QsSidebarReducer,
        agenda: AgendaReducer,
        appointment: appointmentReducer,
        dialog: DialogReducer,
        dialogMove: dialogMoveAppointmentReducer,
        timer: timerReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(
        {
            serializableCheck: false
        }
    ),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;
