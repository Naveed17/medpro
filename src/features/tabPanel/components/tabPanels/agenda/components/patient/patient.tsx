import Typography from "@mui/material/Typography";
import React, {ChangeEvent, useState} from "react";
import {useTranslation} from "next-i18next";
import {LoadingScreen} from "@features/loadingScreen";
import {Box} from "@mui/material";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {agendaSelector, setStepperIndex} from "@features/calendar";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {AutoCompleteButton} from "@features/buttons";
import {useRequest, useRequestMutation} from "@app/axios";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

import dynamic from "next/dynamic";
import {appointmentSelector, setAppointmentPatient} from "@features/tabPanel";
import {TriggerWithoutValidation} from "@app/swr/swrProvider";

const OnStepPatient = dynamic(() => import('@features/tabPanel/components/tabPanels/agenda/components/patient/components/onStepPatient/onStepPatient'));

function Patient({...props}) {
    const {onNext, onBack, select, onPatientSearch} = props;
    const {data: session} = useSession();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const {patient: selectedPatient} = useAppSelector(appointmentSelector);
    const {currentStepper} = useAppSelector(agendaSelector);

    const [addPatient, setAddPatient] = useState<boolean>(false);
    const [query, setQuery] = useState("");

    const {t, ready} = useTranslation("agenda", {
        keyPrefix: "steppers",
    });

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpPatientResponse, isValidating, mutate} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/patients/${router.locale}?filter=${query}&withPagination=false`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    });

    const {trigger} = useRequestMutation(null, "agenda/add-patient", TriggerWithoutValidation);

    if (!ready) return (<LoadingScreen/>);

    const handleOnClick = () => {
        setAddPatient(true);
    }

    const handlePatientSearch = () => {
        if (select) {
            onPatientSearch(true);
        }
    }
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const search = event.target.value;
        if (search.length >= 3) {
            setQuery(search);
        }
    }

    const onNextStep = () => {
        dispatch(setStepperIndex(3))
        onNext(3)
    }

    const submitNewPatient = (patient: any) => {
        const form = new FormData();
        form.append('first_name', patient.firstName)
        form.append('last_name', patient.lastName);
        form.append('phone', JSON.stringify({
            code: patient.countryCode.phone,
            value: patient.phone,
            type: "phone",
            "contact_type": patient.contact.uuid,
            "is_public": false,
            "is_support": false
        }));
        form.append('gender', patient.gender);
        if (patient.birthdate.day && patient.birthdate.month && patient.birthdate.year) {
            form.append('birthdate',
                `${patient.birthdate.day}-${patient.birthdate.month}-${patient.birthdate.year}`);
        }
        form.append('address', JSON.stringify({
            fr: patient.address
        }));
        form.append('insurance', JSON.stringify(patient.insurance));
        form.append('email', patient.email);
        form.append('family_doctor', patient.family_doctor);
        form.append('region', patient.region);
        form.append('zip_code', patient.zip_code);
        trigger(
            {
                method: selectedPatient ? "PUT" : "POST",
                url: `/api/medical-entity/${medical_entity.uuid}/patients/${selectedPatient ? selectedPatient.uuid + '/' : ''}${router.locale}`,
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
                data: form
            }, TriggerWithoutValidation
        ).then((res: any) => {
            const {data: patient} = res;
            const {status} = patient;
            if (status === "success") {
                if (!selectedPatient) {
                    dispatch(setAppointmentPatient(patient.data));
                }
                setAddPatient(false);
                mutate().then(value => {
                    const {data} = value?.data as HttpResponse;
                    if (selectedPatient) {
                        dispatch(setAppointmentPatient(
                            data.find((patient: PatientModel) => patient.uuid === selectedPatient.uuid)));
                    }
                });
            }
        });
    }

    return (
        <div>
            {!addPatient ? <>
                    <Box className="inner-section">
                        <Typography variant="h6" color="text.primary">
                            {t("stepper-2.title")}
                        </Typography>
                        <Typography variant="body1" sx={{textTransform: 'uppercase'}} color="text.primary" mt={3} mb={1}>
                            {t("stepper-2.sub-title")}
                        </Typography>
                        <AutoCompleteButton
                            onSearchChange={handleSearchChange}
                            OnClickAction={handleOnClick}
                            OnOpenSelect={handlePatientSearch}
                            translation={t}
                            loading={isValidating}
                            data={(httpPatientResponse as HttpResponse)?.data}/>
                    </Box>
                    {!select && <Paper
                        sx={{
                            borderRadius: 0,
                            borderWidth: "0px",
                            textAlign: "right",
                        }}
                        className="action"
                    >
                        <Button
                            size="medium"
                            variant="text-primary"
                            color="primary"
                            sx={{
                                mr: 1,
                            }}
                            onClick={() => onBack(currentStepper)}
                        >
                            {t("back")}
                        </Button>
                        <Button
                            size="medium"
                            variant="contained"
                            color="primary"
                            onClick={onNextStep}
                            disabled={!selectedPatient}
                        >
                            {t("next")}
                        </Button>
                    </Paper>}
                </>
                :
                <OnStepPatient
                    translationKey={"agenda"}
                    translationPrefix={"steppers.stepper-2.patient"}
                    onClose={() => setAddPatient(false)}
                    OnSubmit={submitNewPatient}/>
            }
        </div>
    )
}

export default Patient;
