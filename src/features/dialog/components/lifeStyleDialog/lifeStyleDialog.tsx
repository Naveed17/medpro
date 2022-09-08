import React from 'react'
import LifeStyleDialogStyled from './overrides/lifeStyleDialogStyle'
import { useTranslation } from 'next-i18next';
import { FormGroup, FormControlLabel, Checkbox, TextField, Box, Stack, Skeleton } from '@mui/material'
import { useRequest } from "@app/axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

function LifeStyleDialog({ ...props }) {
    const codes: any = {
        way_of_life: '0',
        allergic: '1',
        treatment: '2',
        antecedents: '3',
        family_antecedents: '4',
        surgical_antecedents: '5',
        medical_antecedents: '6'
    }
    const action = props.data.action;
    const initalData = Array.from(new Array(20));
    const { t, ready } = useTranslation("consultation", { keyPrefix: "consultationIP" })
    const state: AntecedentsModel[] = props.data.state;
    const setState = props.data.setState;
    const { data: session } = useSession();

    const router = useRouter();

    const { data: httpAntecedentsResponse } = useRequest({
        method: "GET",
        url: `/api/antecedents/${codes[action]}/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const index = state.findIndex((v: any) => v.uuid === event.target.name);
        if (index === -1) {
            const antecents = (httpAntecedentsResponse as HttpResponse).data.find((ant: any) => ant.uuid === event.target.name);
            const antecendent = { uuid: antecents.uuid, name: antecents.name, startDate: '', endDate: '' }
            setState([...state, antecendent])
        } else {
            setState([
                ...state.slice(0, index),
                ...state.slice(index + 1, state.length),
            ]);
        }
    };
    if (!ready) return <>loading translations...</>;
    return (
        <LifeStyleDialogStyled display='block'>

            <Box maxWidth={{ xs: '100%', md: '80%' }} mx="auto">
                {


                    !httpAntecedentsResponse ?
                        initalData.map((item, index) => (
                            <Box
                                key={index}
                                sx={{ display: "flex", alignItems: "center", margin: "0 5px" }}
                            >
                                <Checkbox size="small" />
                                <Skeleton width={180} variant="text" />
                            </Box>
                        ))

                        :
                        (httpAntecedentsResponse as HttpResponse).data.map((list: { uuid: string, name: string, type: number }, idx: number) =>
                            <FormGroup row key={idx}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={state?.find(inf => inf.uuid == list.uuid) !== undefined}
                                            onChange={handleChange} name={list.uuid} />
                                    }
                                    label={list.name}
                                />
                                {
                                    state?.find((inf: AntecedentsModel) => inf.uuid == list.uuid) && <Stack spacing={1} direction={'row'}>
                                        <TextField
                                            name={`${list.uuid}`}
                                            value={state.find((i: AntecedentsModel) => i.uuid === list.uuid)?.startDate ? state.find((i: AntecedentsModel) => i.uuid === list.uuid)?.startDate : ''}
                                            placeholder={t('starting_year')}
                                            sx={{ width: 130 }}
                                            onChange={(e) => {
                                                let items = state.map((item: AntecedentsModel) => ({ ...item }));
                                                let item = items.find((i: AntecedentsModel) => i.uuid === list.uuid)
                                                if (item) item.startDate = e.target.value;
                                                setState(items)
                                            }
                                            } />
                                        <TextField
                                            name={`${list.uuid}`}
                                            sx={{ width: 130 }}
                                            value={state.find(i => i.uuid === list.uuid)?.endDate ? state.find(i => i.uuid === list.uuid)?.endDate : ''}
                                            placeholder={t('ending_year')}
                                            onChange={(e) => {
                                                let items = state.map(item => ({ ...item }));
                                                let item = items.find(i => i.uuid === list.uuid)
                                                if (item) item.endDate = e.target.value;
                                                setState(items)
                                            }
                                            } />
                                    </Stack>
                                }
                            </FormGroup>
                        )
                }
            </Box>
        </LifeStyleDialogStyled>
    )
}

export default LifeStyleDialog