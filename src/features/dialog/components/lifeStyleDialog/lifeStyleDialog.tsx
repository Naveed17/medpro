import React from 'react'
import LifeStyleDialogStyled from './overrides/lifeStyleDialogStyle'
import { useTranslation } from 'next-i18next';
import { FormGroup, FormControlLabel, Checkbox, TextField, Box } from '@mui/material'
const data = [
    {
        id: 1,
        label: 'smoking',
        input: true,
    },
    {
        id: 2,
        label: 'alcohol',
        input: true,
    },
    {
        id: 3,
        label: 'play_any_sports',
        input: true,
    },
    {
        id: 4,
        label: 'work_on_the_computer',
        input: false,
    },
    {
        id: 5,
        label: 'weight_is_stable',
        input: false,
    },
    {
        id: 6,
        label: 'last_6_months',
        input: false,
    },
    {
        id: 7,
        label: 'chemical_dependency',
        input: false,
    },
    {
        id: 8,
        label: 'other',
        input: false,
    }


]
function LifeStyleDialog() {
    const { t, ready } = useTranslation("consultation", { keyPrefix: "consultationIP" })
    const [state, setState] = React.useState<any>({});
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked,
        });
    };
    if (!ready) return <>loading translations...</>;
    return (
        <LifeStyleDialogStyled display='block'>
            <Box maxWidth={{ xs: '100%', md: '80%' }} mx="auto">
                {
                    data.map((list, idx) =>
                        <FormGroup row key={idx}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={!!state[list.label]} onChange={handleChange} name={list.label} />
                                }
                                label={t(list.label)}
                            />
                            {
                                (list.input && state[list.label]) && <TextField
                                    placeholder={t('starting_year')}
                                />
                            }

                        </FormGroup>
                    )
                }
            </Box>
        </LifeStyleDialogStyled>
    )
}

export default LifeStyleDialog