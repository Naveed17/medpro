import {SuccessCard} from "@features/card/";
import {useTranslation} from "next-i18next";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {
    addPatientSelector,
    appointmentSelector,
    onResetPatient,
    resetSubmitAppointment
} from "@features/tabPanel";
import {useTheme} from "@mui/material";
import dynamic from "next/dynamic";
import {resetDuplicated} from "@features/duplicateDetected";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function AddPatientStep3({...props}) {
    const {onNext, selectedPatient, OnCustomAction} = props;
    const dispatch = useAppDispatch();
    const theme = useTheme();

    const {t, ready} = useTranslation("patient", {keyPrefix: "config.add-patient"});
    const {submitted} = useAppSelector(appointmentSelector);
    const {stepsData} = useAppSelector(addPatientSelector);

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <SuccessCard
            data={{
                title: t(!selectedPatient ? "added" : "updated"),
                description: t("description"),
                buttons: [
                    {
                        variant: "text-primary",
                        action: "onAddPatient",
                        title: t("add-new")
                    },
                    {
                        icon: "ic-agenda-+",
                        action: "onAddAppointment",
                        variant: "contained",
                        sx: {
                            "& svg": {
                                "& path": {fill: theme.palette.text.primary}
                            },
                        },
                        title: t("add-appo"),
                        color: "warning"
                    },
                    {
                        variant: "text-primary",
                        action: "onClose",
                        title: t("close")
                    },
                ]
            }}
            onClickTextButton={(action: string) => {
                switch (action) {
                    case "onAddPatient":
                        dispatch(onResetPatient());
                        break;
                    case "onAddAppointment":
                        if (OnCustomAction) {
                            if (submitted) {
                                dispatch(resetSubmitAppointment());
                            }
                            OnCustomAction("ADD_APPOINTMENT", stepsData.submit);
                        }
                        break;
                    case "onClose":
                        if (OnCustomAction) {
                            OnCustomAction("CLOSE");
                            dispatch(resetDuplicated());
                        }
                        break;
                }
                onNext(0);
            }}
        />
    );
}

export default AddPatientStep3;
