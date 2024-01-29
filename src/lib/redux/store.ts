import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {ConfigReducer} from "@features/base/reducer";
import {SideBarReducer, ProfileMenuReducer} from "@features/menu";
import {CheckListReducer} from "@features/checkList";
import {userReducer} from "@features/user";
import {addPatientReducer, appointmentReducer, stepperProfileReducer} from "@features/tabPanel";
import {QsSidebarReducer, leftActionBarReducer, ocrDocumentReducer} from "@features/leftActionBar";
import {tableReducer} from "@features/table";
import {ConsultationReducer} from "@features/toolbar";
import {AgendaReducer} from "@features/calendar";
import {
    DialogReducer,
    dialogMoveAppointmentReducer,
    dialogPatientDetailReducer,
    PrescriptionReducer,
    PreConsultationReducer,
    dialogOpeningHoursReducer
} from "@features/dialog";
import {timerReducer} from "@features/card";
import {DashLayoutReducer} from "@features/base";
import {AppLockReducer} from "@features/appLock";
import {DuplicatedReducer} from "@features/duplicateDetected";
import {navBarReducer} from "@features/topNavBar";
import {ProgressUIReducer} from "@features/progressUI";
import {selectCheckboxReducer} from "@features/selectCheckboxCard"
import {CashboxReducer} from "@features/leftActionBar";
import {absenceDrawerReducer} from "@features/drawer";
import {minMaxWindowToggleReducer} from '@features/buttons';
import {StepperReducer} from "@features/stepper";
import storageSession from 'redux-persist/lib/storage/session'
import {persistReducer} from 'redux-persist';
import {CaslReducer} from "@features/casl";

const persistConfig = {
    key: 'root',
    storage: storageSession
}

const rootReducer = combineReducers({
    theme: ConfigReducer,
    sideBar: SideBarReducer,
    profileMenu: ProfileMenuReducer,
    checkList: CheckListReducer,
    consultationDetails: ConsultationReducer,
    user: userReducer,
    casl: CaslReducer,
    addPatientSteps: addPatientReducer,
    stepperProfile: stepperProfileReducer,
    tableState: tableReducer,
    qsSidebar: QsSidebarReducer,
    agenda: AgendaReducer,
    cashBox: CashboxReducer,
    appointment: appointmentReducer,
    dialog: DialogReducer,
    dialogMove: dialogMoveAppointmentReducer,
    timer: timerReducer,
    leftActionBar: leftActionBarReducer,
    dashLayout: DashLayoutReducer,
    appLock: AppLockReducer,
    patientDetail: dialogPatientDetailReducer,
    duplicate: DuplicatedReducer,
    navBar: navBarReducer,
    progressUI: ProgressUIReducer,
    preConsultation: PreConsultationReducer,
    prescription: PrescriptionReducer,
    selectCheckbox: selectCheckboxReducer,
    ocrDocument: ocrDocumentReducer,
    openingHours: dialogOpeningHoursReducer,
    absence: absenceDrawerReducer,
    minMaxWindow: minMaxWindowToggleReducer,
    stepper: StepperReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = () => {
    return configureStore({
        reducer: persistedReducer,
        devTools: process.env.NODE_ENV !== 'production',
        middleware: (getDefaultMiddleware) => getDefaultMiddleware(
            {
                serializableCheck: false
            }
        ),
    })
}
// Infer the type of makeStore
export type AppStore = ReturnType<typeof store>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
