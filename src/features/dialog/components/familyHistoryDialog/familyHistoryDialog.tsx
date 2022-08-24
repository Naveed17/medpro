import React from 'react'
import FamilyHistoryDialogStyled from './overrides/familyHistoryDialogStyle'
import { useTranslation } from 'next-i18next';
import { FormGroup, FormControlLabel, Checkbox, TextField, Box, Stack } from '@mui/material'
const data = [
    {
        id: 1,
        label: 'disease_1',
        input: true,
        name: "diabetes"
    },
    {
        id: 2,
        label: 'disease_2',
        input: true,
        name: "epilepsy"
    },
    {
        id: 3,
        label: 'disease_3',
        input: true,
        name: "respiratory_problems"
    },
    {
        id: 4,
        label: 'disease_4',
        input: true,
        name: "cholesterol"
    },
    {
        id: 5,
        label: 'disease_5',
        input: true,
        name: "phlebitis"
    },
    {
        id: 6,
        label: 'disease_6',
        input: true,
        name: "skin_disease"
    },
    {
        id: 7,
        label: 'other',
        input: false,
        name: "other"
    }


]
function FamilyHistoryDialog() {
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
        <FamilyHistoryDialogStyled display='block'>
            <Box maxWidth={{ xs: '100%', md: '80%' }} mx="auto">
                {
                    data.map((list, idx) =>
                        <FormGroup key={idx}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={!!state[list.name]} onChange={handleChange} name={list.name} />
                                }
                                label={t(list.label)}
                            />
                            {
                                (list.input && state[list.name]) &&
                                <Stack direction='row' spacing={1}>
                                    <TextField
                                        placeholder={t('starting_year')}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={true} name="father" />
                                        }
                                        label={t('father')}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={true} name="mother" />
                                        }
                                        label={t('mother')}
                                    />
                                </Stack>
                            }

                        </FormGroup>
                    )
                }
            </Box>
        </FamilyHistoryDialogStyled>
    )
}

export default FamilyHistoryDialog