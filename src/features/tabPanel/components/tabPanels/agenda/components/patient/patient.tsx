import Typography from "@mui/material/Typography";
import React, {useState} from "react";
import {useTranslation} from "next-i18next";
import {Box} from "@mui/material";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {agendaSelector, setStepperIndex} from "@features/calendar";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {AutoCompleteButton} from "@features/buttons";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {appointmentSelector, OnStepPatient, setAppointmentPatient} from "@features/tabPanel";
import {dashLayoutSelector, setOngoing} from "@features/base";
import {useMedicalEntitySuffix, prepareInsurancesData, increaseNumberInString} from "@lib/hooks";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {LoadingScreen} from "@features/loadingScreen";
import {PatientContactRelation} from "@lib/constants";

function Patient({...props}) {
    const {onNext, onBack, select, onPatientSearch, handleAddPatient = null} = props;
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {patient: selectedPatient} = useAppSelector(appointmentSelector);
    const {currentStepper} = useAppSelector(agendaSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const [addPatient, setAddPatient] = useState<boolean>(false);
    const [query, setQuery] = useState("");

    const {t, ready} = useTranslation("agenda", {keyPrefix: "steppers"});

    const {data: httpPatientResponse, mutate: mutatePatients, isLoading} = useRequestQuery(medicalEntityHasUser ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${router.locale}?${query.length > 0 ? `filter=${query}&` : ""}withPagination=false`
    } : null, ReactQueryNoValidateConfig);

    const {trigger: triggerAddPatient} = useRequestQueryMutation("agenda/patient/add");

    const handleOnClick = () => {
        setAddPatient(true);
        handleAddPatient && handleAddPatient(true);
    }

    const handlePatientSearch = () => {
        if (select) {
            onPatientSearch(true);
        }
    }

    const handleSearchChange = (search: string) => {
        setQuery(search);
    }

    const onNextStep = () => {
        dispatch(setStepperIndex(3))
        onNext(3)
    }

    const submitNewPatient = (patient: any) => {
        const form = new FormData();
        form.append('fiche_id', patient.fiche_id);
        form.append('nationality', patient.nationality);
        form.append('first_name', patient.firstName);
        form.append('last_name', patient.lastName);
        form.append('phone', JSON.stringify(patient.phones.map((phoneData: any) => ({
            code: phoneData.dial.phone,
            value: phoneData.phone.replace(phoneData.dial.phone, ""),
            type: "phone",
            contact_type: patient.contact.uuid,
            is_whatsapp: phoneData.isWhatsapp,
            contact_relation: PatientContactRelation.find(relation => relation.key === phoneData.relation)?.value,
            contact_social: {
                first_name: phoneData.firstName,
                last_name: phoneData.lastName
            },
            is_public: false,
            is_support: false
        }))));
        form.append('gender', patient.gender);
        if (patient.birthdate) {
            form.append('birthdate',
                `${patient.birthdate.day}-${patient.birthdate.month}-${patient.birthdate.year}`);
        }
        form.append('address', JSON.stringify({
            [router.locale as string]: patient.address
        }));
        form.append('insurance', JSON.stringify(prepareInsurancesData({
            insurances: patient.insurance,
            contact: patient.contact.uuid
        })));
        form.append('email', patient.email);
        form.append('family_doctor', patient.family_doctor);
        form.append('region', patient.region);
        form.append('zip_code', patient.zip_code);
        patient.cin && form.append('id_card', patient.cin);
        patient.note && form.append('note', patient.note);
        form.append('profession', patient.profession);
        patient.addressedBy?.uuid && form.append('addressed_by', patient.addressedBy.uuid);
        patient.civilStatus?.uuid && form.append('civil_status', patient.civilStatus.uuid);

        medicalEntityHasUser && triggerAddPatient({
            method: selectedPatient ? "PUT" : "POST",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${selectedPatient ? selectedPatient.uuid + '/' : ''}${router.locale}`,
            data: form
        }, {
            onSuccess: (res: any) => {
                const {data: patient} = res;
                const {status, data: patientData} = patient;
                if (status === "success") {
                    if (!selectedPatient) {
                        dispatch(setAppointmentPatient(patientData.data));
                        // mutate last id after creation
                        dispatch(setOngoing({last_fiche_id: increaseNumberInString(patientData.data.fiche_id)}));
                    }
                    setAddPatient(false);
                    handleAddPatient && handleAddPatient(false);
                    mutatePatients().then(result => {
                        const {data: patients} = result
                        const {data: patientList} = (patients as any)?.data as HttpResponse;
                        if (selectedPatient) {
                            dispatch(setAppointmentPatient(
                                patientList.find((patient: PatientModel) => patient.uuid === selectedPatient.uuid)));
                        }
                    });
                }
            }
        });
    }

    const patients = (httpPatientResponse as HttpResponse)?.data as PatientModel[] ?? [];

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);
    console.log('select', select)
    return (
        <div>
            {!addPatient ?
                <>
                    <Box className="inner-section" {...(!!select && {mt: 3})}>
                        <Typography sx={{fontSize: "1rem", fontWeight: "bold", mb: 1}} color="text.primary">
                            {t("stepper-2.title")}
                        </Typography>
                        <AutoCompleteButton
                            onSearchChange={handleSearchChange}
                            OnClickAction={handleOnClick}
                            OnOpenSelect={handlePatientSearch}
                            translation={t}
                            loading={isLoading}
                            data={patients}/>
                    </Box>
                    {!select && <Paper
                        sx={{
                            borderRadius: 0,
                            borderWidth: "0px",
                            textAlign: "right"
                        }}
                        className="action">
                        <Button
                            size="medium"
                            variant="text-primary"
                            color="primary"
                            sx={{
                                mr: 1,
                            }}
                            onClick={() => onBack(currentStepper)}>
                            {t("back")}
                        </Button>
                        <Button
                            size="medium"
                            variant="contained"
                            color="primary"
                            onClick={onNextStep}
                            disabled={!selectedPatient}>
                            {t("next")}
                        </Button>
                    </Paper>}
                </>
                :
                <OnStepPatient
                    {...{handleAddPatient}}
                    translationKey={"agenda"}
                    translationPrefix={"steppers.stepper-2.patient"}
                    onClose={() => {
                        handleAddPatient && handleAddPatient(false);
                        setAddPatient(false);
                    }}
                    OnSubmit={submitNewPatient}/>
            }
        </div>
    )
}

export default Patient;
