import {SuccessCard, timerSelector} from "@features/card/";
import {useTranslation} from "next-i18next";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {
    addPatientSelector,
    appointmentSelector,
    onResetPatient,
    resetSubmitAppointment
} from "@features/tabPanel";
import {resetDuplicated} from "@features/duplicateDetected";
import {LoadingScreen} from "@features/loadingScreen";
import {useContext} from "react";
import {AbilityContext} from "@features/casl/can";

function AddPatientStep3({...props}) {
    const {onNext, selectedPatient, OnCustomAction} = props;
    const dispatch = useAppDispatch();
    const ability = useContext(AbilityContext);

    const {t, ready} = useTranslation("patient");
    const {submitted} = useAppSelector(appointmentSelector);
    const {stepsData} = useAppSelector(addPatientSelector);
    const {isActive} = useAppSelector(timerSelector);

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <SuccessCard
            data={{
                title: t(`config.add-patient.${!selectedPatient ? "added" : "updated"}`),
                description: t("config.add-patient.description"),
                buttons: [
                    {
                        variant: "text-primary",
                        action: "onAddPatient",
                        title: t("config.add-patient.add-new")
                    },
                    ...(ability.can("manage", "agenda", "agenda__appointment__create") ? [{
                        icon: "ic-agenda-+",
                        action: "onAddAppointment",
                        variant: "contained",
                        title: t("config.add-patient.add-appo"),
                        color: "primary"
                    }] : []),
                    ...(ability.can("manage", "agenda", "agenda__appointment__start") ? [{
                        icon: "ic-play-audio-black",
                        action: "onStartConsultation",
                        variant: "contained",
                        title: t("patient-details.start-consultation"),
                        disabled: isActive,
                        color: "warning"
                    }] : []),
                    {
                        variant: "text-primary",
                        action: "onClose",
                        title: t("config.add-patient.close")
                    },
                ]
            }}
            onClickTextButton={(action: string) => {
                switch (action) {
                    case "onAddPatient":
                        dispatch(onResetPatient());
                        onNext(0);
                        break;
                    case "onAddAppointment":
                        if (OnCustomAction) {
                            if (submitted) {
                                dispatch(resetSubmitAppointment());
                            }
                            OnCustomAction("ADD_APPOINTMENT", stepsData.submit);
                        }
                        onNext(0);
                        break;
                    case "onStartConsultation":
                        OnCustomAction && OnCustomAction("START_CONSULTATION", stepsData.submit);
                        break;
                    case "onClose":
                        if (OnCustomAction) {
                            OnCustomAction("CLOSE");
                            dispatch(resetDuplicated());
                        }
                        onNext(0);
                        break;
                }

            }}
        />
    );
}

export default AddPatientStep3;
