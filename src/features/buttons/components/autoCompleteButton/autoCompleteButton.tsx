import RootStyled from './overrides/RootStyled'
import {Box, Button, ClickAwayListener} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import {useCallback, useEffect, useState} from "react";
import {PatientAppointmentCard} from "@features/card";
import {AutoComplete} from "@features/autoComplete";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {appointmentSelector, setAppointmentPatient} from "@features/tabPanel";
import {useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {dashLayoutSelector} from "@features/base";
import {useMedicalEntitySuffix} from "@lib/hooks";

function AutoCompleteButton({...props}) {
    const {
        translation,
        data,
        loading,
        OnClickAction,
        onSearchChange,
        OnOpenSelect = null,
        size = 'medium'
    } = props;

    const dispatch = useAppDispatch();
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {patient: initData} = useAppSelector(appointmentSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const {trigger: PatientDetailsTrigger} = useRequestQueryMutation("patient/data");

    const [focus, setFocus] = useState(true);
    const [patient, setPatient] = useState<PatientWithNextAndLatestAppointment | null>(initData);

    const onSubmitPatient = (data: PatientWithNextAndLatestAppointment) => {
        dispatch(setAppointmentPatient(data));
    }

    const onEditPatient = () => {
        medicalEntityHasUser && PatientDetailsTrigger({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/${router.locale}`
        }, {
            onSuccess: (result: any) => {
                const {status} = result?.data;
                const patient = (result?.data as HttpResponse)?.data;
                if (status === "success") {
                    dispatch(setAppointmentPatient(patient as any));
                    OnClickAction(true);
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
                        {!focus &&
                            <Button variant="outlined" size="large" fullWidth className='btn-add' onClick={handleClick}>
                                <AddIcon/>
                            </Button>}

                        {focus &&
                            <ClickAwayListener onClickAway={handleClickAway}>
                                <Box sx={{mb: 4}} className="autocomplete-container">
                                    <AutoComplete
                                        {...{data, loading, onSearchChange, size}}
                                        onAddPatient={OnClickAction}
                                        t={translation}
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
                    {...(size === 'medium' && {onEdit: onEditPatient})}
                    onReset={onSubmitPatient}/>}
        </RootStyled>
    )
}

export default AutoCompleteButton;
