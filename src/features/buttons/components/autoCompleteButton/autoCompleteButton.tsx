import RootStyled from './overrides/RootStyled'
import {Box, Button, ClickAwayListener} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import {useState} from "react";
import {PatientAppointmentCard} from "@features/card";
import {AutoComplete} from "@features/autoComplete";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {appointmentSelector, setAppointmentPatient} from "@features/tabPanel";

function AutoCompleteButton({...props}) {
    const dispatch = useAppDispatch();
    const {patient: initData} = useAppSelector(appointmentSelector);

    const {translation, data, OnClickAction} = props;
    const [focus, setFocus] = useState(false);
    const [patient, setPatient] = useState<PatientModel | null>(initData);

    const onSubmitPatient = (data: PatientModel) => {
        setPatient(data);
        dispatch(setAppointmentPatient(data));
    }

    const handleClick = () => {
        setFocus(!focus);
    }
    const handleClickAway = () => {
        setFocus(false);
    };

    return (
        <RootStyled>
            {!patient ? (
                <>
                    <Button variant="outlined" size="large" fullWidth className='btn-add' onClick={handleClick}>
                        <AddIcon/>
                    </Button>

                    {focus &&
                        <ClickAwayListener onClickAway={handleClickAway}>
                            <Box sx={{mb: 4}} className="autocomplete-container">
                                <AutoComplete
                                    data={data}
                                    onSelectData={onSubmitPatient}
                                />
                                <Button variant="outlined" size="large"
                                        fullWidth className='btn-add'
                                        onClick={OnClickAction}
                                        sx={{
                                            borderRadius: 0,
                                            borderWidth: '1px 0 0 0',
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            backgroundColor: 'common.white',
                                            mt: '-10px',
                                            '&:hover': {
                                                borderWidth: '1px 0 0 0',
                                                borderColor: 'divider',
                                                backgroundColor: 'common.white',
                                            }
                                        }}>
                                    {translation('stepper-2.add_button')}
                                </Button>
                            </Box>
                        </ClickAwayListener>
                    }

                </>
            ) : <PatientAppointmentCard key={patient.uuid} item={patient} listing onReset={onSubmitPatient}/>}
        </RootStyled>
    )
}

export default AutoCompleteButton;
