import {Action, configureStore, ThunkAction} from "@reduxjs/toolkit";
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
    PreConsultationReducer
} from "@features/dialog";
import {timerReducer} from "@features/card";
import {DashLayoutReducer} from "@features/base";
import {AppLockReducer} from "@features/appLock";
import {DuplicatedReducer} from "@features/duplicateDetected";
import {navBarReducer} from "@features/topNavBar";
import {ProgressUIReducer} from "@features/progressUI";
import {selectCheckboxReducer} from "@features/selectCheckboxCard"
import {CashboxReducer} from "@features/leftActionBar/components/cashbox";
import {dialogOpeningHoursReducer} from "@features/dialog/components/openingHoursDialog";
import {absenceDrawerReducer} from "@features/drawer/components/absenceDrawer/reducer";

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
