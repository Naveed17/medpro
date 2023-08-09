import Typography from "@mui/material/Typography";
import React, {useEffect, useState} from "react";
import {useTranslation} from "next-i18next";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

import {Box} from "@mui/material";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {agendaSelector, setStepperIndex} from "@features/calendar";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {AutoCompleteButton} from "@features/buttons";
import {useRequest, useRequestMutation} from "@lib/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {appointmentSelector, setAppointmentPatient} from "@features/tabPanel";
import {TriggerWithoutValidation} from "@lib/swr/swrProvider";
import {dashLayoutSelector} from "@features/base";
import {useMedicalEntitySuffix, prepareInsurancesData} from "@lib/hooks";

const OnStepPatient = dynamic(() => import('@features/tabPanel/components/tabPanels/agenda/components/patient/components/onStepPatient/onStepPatient'));

function Patient({...props}) {
    const {onNext, onBack, select, onPatientSearch, handleAddPatient = null} = props;
    const {data: session} = useSession();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {patient: selectedPatient} = useAppSelector(appointmentSelector);
    const {currentStepper} = useAppSelector(agendaSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const [addPatient, setAddPatient] = useState<boolean>(false);
    const [query, setQuery] = useState("");
    const [patients, setPatients] = useState<PatientModel[]>([]);

    const {t, ready} = useTranslation("agenda", {keyPrefix: "steppers"});

    const {data: httpPatientResponse, isValidating, mutate} = useRequest(medicalEntityHasUser ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${router.locale}?${query.length > 0 ? `filter=${query}&` : ""}withPagination=false`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null);

    const {trigger} = useRequestMutation(null, "agenda/add-patient", TriggerWithoutValidation);

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

        medicalEntityHasUser && trigger({
            method: selectedPatient ? "PUT" : "POST",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${selectedPatient ? selectedPatient.uuid + '/' : ''}${router.locale}`,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
            data: form
        }).then((res: any) => {
            const {data: patient} = res;
            const {status, data: patientData} = patient;
            if (status === "success") {
                if (!selectedPatient) {
                    dispatch(setAppointmentPatient(patientData.data));
                }
                setAddPatient(false);
                handleAddPatient && handleAddPatient(false);
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

    useEffect(() => {
        if (httpPatientResponse) {
            setPatients((httpPatientResponse as HttpResponse)?.data as PatientModel[]);
        }
    }, [httpPatientResponse]);

    if (!ready) return (<LoadingScreen/>);

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
                            data={patients}/>
                    </Box>
                    {!select && <Paper
                        sx={{
                            borderRadius: 0,
                            borderWidth: "0px",
                            textAlign: "right"
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
