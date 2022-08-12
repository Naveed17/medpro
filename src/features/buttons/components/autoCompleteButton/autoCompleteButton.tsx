import RootStyled from './overrides/RootStyled'
import {Box, Button, ClickAwayListener, Typography} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import {useState} from "react";
import {PatientAppointmentCard} from "@features/card";
import {AutoComplete} from "@features/autoComplete";

function AutoCompleteButton() {
    const [focus, setFocus] = useState(false);
    const [getData, setData] = useState(null);

    const handleClick = () => {
        setFocus(!focus);
    }
    const handleClickAway = () => {
        setFocus(false);
    };

    return (
        <RootStyled>
            <Typography variant="h6" sx={{mb: 4}}>
                Choisissez le patient
            </Typography>
            <Typography fontWeight={500} sx={{mb: 2, textTransform: 'uppercase'}}>
                vous devez ajouter un patient
            </Typography>
            {getData === null ? (
                <>
                    <Button variant="outlined" size="large" fullWidth className='btn-add' onClick={handleClick}>
                        <AddIcon />
                    </Button>

                    {focus &&
                        <ClickAwayListener onClickAway={handleClickAway}>
                            <Box sx={{mb: 4}} className="autocomplete-container">
                                <AutoComplete data={[
                                    {
                                        id: 1,
                                        img: 'https://cf-cdn.nmc.ae/Uploads/DoctorsPhoto/Thumb1/48449DoctorImage0086ea58-391d-4993-a233-e465eb0bac8b.jpg',
                                        name: 'John Doe',
                                        dob: '01/01/1970',
                                        ans: '32Ans',
                                        gender: 'male'


                                    },
                                    {
                                        id: 2,
                                        img: null,
                                        name: 'John Doe',
                                        dob: '01/01/1970',
                                        ans: '32Ans',
                                        'gender': 'female'

                                    },
                                    {
                                        id: 3,
                                        img: null,
                                        name: 'Kevin',
                                        dob: '01/01/1970',
                                        ans: '32Ans',
                                        'gender': 'female'

                                    },
                                    {
                                        id: 4,
                                        img: null,
                                        name: 'Kevin',
                                        dob: '01/01/1970',
                                        ans: '32Ans',
                                        'gender': 'female'

                                    },
                                    {
                                        id: 5,
                                        img: null,
                                        name: 'Kevin',
                                        dob: '01/01/1970',
                                        ans: '32Ans',
                                        'gender': 'female'

                                    },
                                    {
                                        id: 6,
                                        img: null,
                                        name: 'Kevin',
                                        dob: '01/01/1970',
                                        ans: '32Ans',
                                        'gender': 'female'

                                    },

                                ]}
                                              getData={setData}
                                />
                                <Button variant="outlined" size="large" fullWidth className='btn-add' sx={{
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
                                    Ajouter un nouveau patient
                                </Button>
                            </Box>
                        </ClickAwayListener>
                    }

                </>
            ) : <PatientAppointmentCard item={getData} listing getData={setData}/>}
        </RootStyled>
    )
}

export default AutoCompleteButton;
