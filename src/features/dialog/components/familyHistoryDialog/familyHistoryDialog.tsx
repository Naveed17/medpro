import React from 'react'
import FamilyHistoryDialogStyled from './overrides/familyHistoryDialogStyle'
import { useTranslation } from 'next-i18next';
import { FormGroup, FormControlLabel, Checkbox, TextField, Box, Stack } from '@mui/material'
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useRequest} from "@app/axios";

function FamilyHistoryDialog() {
    const { t, ready } = useTranslation("consultation", { keyPrefix: "consultationIP" })
    const [state, setState] = React.useState<any>({});
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked,
        });
    };
    const handleChangeTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });
    };
    const {data: session} = useSession();
    const router = useRouter();

    const {data: httpAntecedentsResponse} = useRequest({
        method: "GET",
        url: `/api/antecedents/1/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    });
    console.log(httpAntecedentsResponse);
    if (!ready) return <>loading translations...</>;
    return (
        <FamilyHistoryDialogStyled display='block'>
            <Box maxWidth={{ xs: '100%', md: '80%' }} mx="auto">
                { httpAntecedentsResponse &&
                    (httpAntecedentsResponse as HttpResponse).data.map((list:{ id: number, name: string, type: number }, idx:number) =>
                        <FormGroup key={idx}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={!!state[list.name]} onChange={handleChange} name={list.name} />
                                }
                                label={list.name}
                            />
                            {
                                (list.name && state[list.name]) &&
                                <Stack direction='row' spacing={1}>
                                    <TextField
                                        placeholder={t('starting_year')}
                                        name={`text_field_${list.name}`}
                                        onChange={handleChangeTextField}

                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={!!state[`father_${list.name}`]}
                                                name={`father_${list.name}`}
                                                onChange={handleChange}
                                            />

                                        }
                                        label={t('father')}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={!!state[`mother_${list.name}`]} name={`mother_${list.name}`}
                                                onChange={handleChange}
                                            />
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