import {SuccessCard} from "@features/card/";
import {useTranslation} from "next-i18next";
import {useAppDispatch} from "@app/redux/hooks";
import {onAddPatient} from "@features/tabPanel";
import {useTheme} from "@mui/material";

function AddPatientStep3({...props}) {
    const {onNext, selectedPatient} = props;
    const dispatch = useAppDispatch();
    const theme = useTheme();

    const initialStep = {
        patient_group: "",
        first_name: "",
        last_name: "",
        birthdate: {
            day: "01",
            month: "01",
            year: "1970",
        },
        phone: "",
        gender: "1",
    };

    const {t, ready} = useTranslation("patient", {keyPrefix: "config.add-patient"});
    if (!ready) return <>loading translations...</>;
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
                    }, {
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
                    }
                ]
            }}
            onClickTextButton={() => {
                dispatch(onAddPatient({step1: initialStep}));
                onNext(0);
            }}
        />
    );
}

export default AddPatientStep3;
