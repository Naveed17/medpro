import React from 'react'
import LifeStyleDialogStyled from './overrides/lifeStyleDialogStyle'
import {useTranslation} from 'next-i18next';
import {FormGroup, FormControlLabel, Checkbox, TextField, Box} from '@mui/material'
import {useRequest} from "@app/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

function LifeStyleDialog({...props}) {
    const codes: any = {
        way_of_life: '0',
        allergic: '1'
    }
    const action = props.data.action;
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    const [state, setState] = React.useState<AntecedentsModel[]>(props.data.data);
    const {data: session} = useSession();
    const router = useRouter();

    const {data: httpAntecedentsResponse} = useRequest({
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
            const antecendent = {uuid: antecents.uuid, name: antecents.name, startDate: '', endDate: ''}
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

            <Box maxWidth={{xs: '100%', md: '80%'}} mx="auto">
                {httpAntecedentsResponse &&
                    (httpAntecedentsResponse as HttpResponse).data.map((list: { uuid: string, name: string, type: number }, idx: number) =>
                        <FormGroup row key={idx}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={state?.find(inf => inf.uuid == list.uuid) !== undefined}
                                              onChange={handleChange} name={list.uuid}/>
                                }
                                label={list.name}
                            />
                            {
                                state?.find(inf => inf.uuid == list.uuid) && <TextField
                                    name={`${list.uuid}`}
                                    value={state.find(i => i.uuid === list.uuid)?.startDate}
                                    placeholder={t('starting_year')}
                                    onChange={(e) => {
                                        const antecedent = state.find(ant => ant.uuid === e.target.name)
                                        if (antecedent) antecedent.startDate = e.target.value
                                        setState([...state])
                                    }
                                    }
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