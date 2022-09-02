import React from 'react'
import FamilyHistoryDialogStyled from './overrides/familyHistoryDialogStyle'
import {useTranslation} from 'next-i18next';
import {FormGroup, FormControlLabel, Checkbox, TextField, Box, Stack} from '@mui/material'
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useRequest} from "@app/axios";

function FamilyHistoryDialog({...props}) {
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    const state: FamilyAntecedentsModel[] = props.data.state;
    const setState = props.data.setState;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const index = state.findIndex((v: any) => v.uuid === event.target.name);
        if (index === -1) {
            const antecents = (httpAntecedentsResponse as HttpResponse).data.find((ant: any) => ant.uuid === event.target.name);
            console.log(antecents);
            const antecendent = {uuid: antecents.uuid, name: antecents.name, startDate: '', ascendantOf: ''}
            setState([...state, antecendent])
        } else {
            setState([
                ...state.slice(0, index),
                ...state.slice(index + 1, state.length),
            ]);
        }
    };

    const {data: session} = useSession();
    const router = useRouter();

    const {data: httpAntecedentsResponse} = useRequest({
        method: "GET",
        url: `/api/antecedents/4/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    });

    if (!ready) return <>loading translations...</>;
    return (
        <FamilyHistoryDialogStyled display='block'>
            <Box maxWidth={{xs: '100%', md: '80%'}} mx="auto">
                {httpAntecedentsResponse &&
                    (httpAntecedentsResponse as HttpResponse).data.map((list: { uuid: string, name: string, type: number }, idx: number) =>
                        <FormGroup key={idx}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={state?.find(inf => inf.uuid == list.uuid) !== undefined}
                                              onChange={handleChange} name={list.uuid}/>
                                }
                                label={list.name}
                            />
                            {
                                state?.find(inf => inf.uuid == list.uuid) &&
                                <Stack direction='row' spacing={1}>
                                    <TextField
                                        placeholder={t('starting_year')}
                                        name={list.uuid}
                                        value={state.find(i => i.uuid === list.uuid)?.startDate ? state.find(i => i.uuid === list.uuid)?.startDate : ''}
                                        onChange={(e) => {
                                            let items = state.map(item => ({...item}));
                                            let item = items.find(i => i.uuid === list.uuid)
                                            if (item) item.startDate = e.target.value
                                            setState(items)
                                        }}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name={list.uuid}
                                                checked={state?.find(inf => inf.uuid == list.uuid)?.ascendantOf === 'father'}
                                                onChange={() => {
                                                    let items = state.map(item => ({...item}));
                                                    let item = items.find(i => i.uuid === list.uuid)
                                                    if (item) item.ascendantOf = 'father';
                                                    setState(items)
                                                }}
                                            />

                                        }
                                        label={t('father')}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name={list.uuid}
                                                checked={state?.find(inf => inf.uuid === list.uuid)?.ascendantOf === 'mother'}
                                                onChange={() => {
                                                    let items = state.map(item => ({...item}));
                                                    let item = items.find(i => i.uuid === list.uuid)
                                                    if (item) item.ascendantOf = 'mother';
                                                    setState(items)

                                                }}
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