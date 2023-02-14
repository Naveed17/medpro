import RootStyled from './overrides/RootStyled'
import {Box, Button, ClickAwayListener} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import {useEffect, useState} from "react";
import {PatientAppointmentCard} from "@features/card";
import {AutoComplete} from "@features/autoComplete";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {appointmentSelector, setAppointmentPatient} from "@features/tabPanel";
import {useRequest, useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRouter} from "next/router";

function AutoCompleteButton({...props}) {
    const {translation, data, loading, OnClickAction, onSearchChange, OnOpenSelect = null} = props;

    const dispatch = useAppDispatch();
    const {data: session} = useSession();
    const router = useRouter();
    const {patient: initData} = useAppSelector(appointmentSelector);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {trigger: PatientDetailsTrigger} = useRequestMutation(null, "patient/data");

    const [focus, setFocus] = useState(true);
    const [patient, setPatient] = useState<PatientWithNextAndLatestAppointment | null>(initData);

    const onSubmitPatient = (data: PatientWithNextAndLatestAppointment) => {
        dispatch(setAppointmentPatient(data));
    }

    const onEditPatient = () => {
        PatientDetailsTrigger({
            method: "GET",
            url: `/api/medical-entity/${medical_entity?.uuid}/patients/${patient?.uuid}/${router.locale}`,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            }
        }).then((result: any) => {
            const {status} = result?.data;
            const patient = (result?.data as HttpResponse)?.data;
            if (status === "success") {
                dispatch(setAppointmentPatient(patient as any));
                OnClickAction(true);
            }

        })
    }

    useEffect(() => {
        setPatient(initData)
    }, [initData]);

    const handleClick = () => {
        setFocus(!focus);
        if (OnOpenSelect) {
            OnOpenSelect();
        }
    }

    const handleClickAway = () => {
        setFocus(false);
    };

    return (
        <RootStyled>
            {!patient ? (
                    <>
                        {!focus &&
                            <Button variant="outlined" size="large" fullWidth className='btn-add' onClick={handleClick}>
                                <AddIcon/>
                            </Button>}

                        {focus &&
                            <ClickAwayListener onClickAway={handleClickAway}>
                                <Box sx={{mb: 4}} className="autocomplete-container">
                                    <AutoComplete
                                        onAddPatient={OnClickAction}
                                        t={translation}
                                        onSearchChange={onSearchChange}
                                        data={data}
                                        loading={loading}
                                        onSelectData={onSubmitPatient}
                                    />
                                </Box>
                            </ClickAwayListener>
                        }
                    </>
                ) :
                <PatientAppointmentCard
                    key={patient.uuid}
                    item={patient}
                    listing
                    onEdit={onEditPatient}
                    onReset={onSubmitPatient}/>}
        </RootStyled>
    )
}

export default AutoCompleteButton;
