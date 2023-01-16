import RootStyled from './overrides/RootStyled'
import {Box, Button, ClickAwayListener} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import {useEffect, useState} from "react";
import {PatientAppointmentCard} from "@features/card";
import {AutoComplete} from "@features/autoComplete";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {appointmentSelector, setAppointmentPatient} from "@features/tabPanel";

function AutoCompleteButton({...props}) {
    const {translation, data, loading, OnClickAction, onSearchChange, OnOpenSelect = null} = props;

    const dispatch = useAppDispatch();
    const {patient: initData} = useAppSelector(appointmentSelector);

    const [focus, setFocus] = useState(false);
    const [patient, setPatient] = useState<PatientWithNextAndLatestAppointment | null>(initData);

    const onSubmitPatient = (data: PatientWithNextAndLatestAppointment) => {
        dispatch(setAppointmentPatient(data));
    }
    const onEditPatient = () => {
        dispatch(setAppointmentPatient(patient as any));
        OnClickAction(true);
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
