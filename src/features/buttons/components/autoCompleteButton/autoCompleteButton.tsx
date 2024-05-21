import RootStyled from './overrides/RootStyled'
import { Box, Button, ClickAwayListener } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import { useCallback, useEffect, useState } from "react";
import { PatientAppointmentCard } from "@features/card";
import { AutoComplete } from "@features/autoComplete";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { appointmentSelector, setAppointmentPatient } from "@features/tabPanel";
import { useRequestQueryMutation } from "@lib/axios";
import { useRouter } from "next/router";
import { dashLayoutSelector } from "@features/base";
import { useMedicalEntitySuffix } from "@lib/hooks";

function AutoCompleteButton({ ...props }) {
    const {
        translation,
        data,
        defaultValue = "",
        loading,
        OnClickAction,
        onSearchChange,
        OnOpenSelect = null,
        size = 'medium'
    } = props;

    const dispatch = useAppDispatch();
    const router = useRouter();
    const { urlMedicalEntitySuffix } = useMedicalEntitySuffix();

    const { patient: initData } = useAppSelector(appointmentSelector);
    const { medicalEntityHasUser } = useAppSelector(dashLayoutSelector);

    const { trigger: PatientDetailsTrigger } = useRequestQueryMutation("patient/data");

    const [focus, setFocus] = useState(true);
    const [patient, setPatient] = useState<PatientWithNextAndLatestAppointment | null>(initData);

    const handleOnClickAction = useCallback((event: any) => {
        OnClickAction(event);
    }, [OnClickAction]);

    const onSubmitPatient = (data: PatientWithNextAndLatestAppointment) => {
        dispatch(setAppointmentPatient(data));
    }

    const onEditPatient = () => {
        medicalEntityHasUser && PatientDetailsTrigger({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${patient?.uuid}/${router.locale}`
        }, {
            onSuccess: (result: any) => {
                const { status } = result?.data;
                const patient = (result?.data as HttpResponse)?.data;
                if (status === "success") {
                    dispatch(setAppointmentPatient(patient as any));
                    handleOnClickAction(true);
                }

            }
        });
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
                    <Box sx={{ mb: 4 }} className="autocomplete-container">
                        <AutoComplete
                            {...{ data, defaultValue, loading, onSearchChange, size }}
                            onAddPatient={handleOnClickAction}
                            t={translation}
                            onSelectData={onSubmitPatient}
                        />
                    </Box>
                </>
            ) :
                <PatientAppointmentCard
                    key={patient.uuid}
                    item={patient}
                    listing
                    {...(size === 'medium' && { onEdit: onEditPatient })}
                    onReset={onSubmitPatient} />}
        </RootStyled>
    )
}

export default AutoCompleteButton;
