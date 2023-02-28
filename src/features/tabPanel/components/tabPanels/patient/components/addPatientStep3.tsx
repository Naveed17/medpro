import {SuccessCard} from "@features/card/";
import {useTranslation} from "next-i18next";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {
    addPatientSelector,
    appointmentSelector,
    onAddPatient,
    onResetPatient,
    resetSubmitAppointment
} from "@features/tabPanel";
import {useTheme} from "@mui/material";
import {LoadingScreen} from "@features/loadingScreen";

function AddPatientStep3({...props}) {
    const {onNext, selectedPatient, OnCustomAction} = props;
    const dispatch = useAppDispatch();
    const theme = useTheme();

    const {submitted} = useAppSelector(appointmentSelector);
    const {stepsData} = useAppSelector(addPatientSelector);

    const {t, ready} = useTranslation("patient", {keyPrefix: "config.add-patient"});
    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);
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
                        }
                        break;
                }
                onNext(0);
            }}
        />
    );
}

export default AddPatientStep3;
