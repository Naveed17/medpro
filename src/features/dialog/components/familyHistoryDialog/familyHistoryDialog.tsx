import React, {ChangeEvent, useEffect, useState} from 'react'
import FamilyHistoryDialogStyled from './overrides/familyHistoryDialogStyle'
import {useTranslation} from 'next-i18next';
import {Box, Button, Checkbox, FormControlLabel, FormGroup, InputAdornment, Stack, TextField} from '@mui/material'
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useRequest} from "@app/axios";
import CodeIcon from "@mui/icons-material/Code";
import AddIcon from "@mui/icons-material/Add";

function FamilyHistoryDialog({...props}) {
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    const state: FamilyAntecedentsModel[] = props.data.state;
    const setState = props.data.setState;
    const [value, setValue] = useState("");
    const [antecedents, setAntecedents] = useState<AntecedentsTypeModel[]>([]);

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

    useEffect(() => {
        if (httpAntecedentsResponse)
            setAntecedents((httpAntecedentsResponse as HttpResponse).data)
    }, [httpAntecedentsResponse])


    const handleChangeSearch = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setValue(e.target.value);
    };

    if (!ready) return <>loading translations...</>;
    return (
        <FamilyHistoryDialogStyled display='block'>
            <Box maxWidth={{xs: '100%', md: '80%'}} mx="auto">
                <TextField
                    id="standard-basic"
                    variant="outlined"
                    sx={{marginBottom: 3}}
                    placeholder={'recherche par mots-clés'}
                    onChange={(e) => {
                        handleChangeSearch(e);
                    }}
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end" sx={{justifyContent: "center"}}>
                                <CodeIcon
                                    sx={{
                                        transform: "rotate(90deg)",
                                        color: "text.secondary",
                                        fontSize: "1rem",
                                    }}
                                />
                            </InputAdornment>
                        ),
                    }}
                />
                {
                    antecedents.filter((item: AntecedentsTypeModel) => {
                        return item.name.toLowerCase().includes(value.toLowerCase());
                    })
                        .map((list: { uuid: string, name: string, type: number }, idx: number) =>
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

                {
                    antecedents.filter((item: any) => {
                        return item.name.toLowerCase().includes(value.toLowerCase());
                    }).length === 0 && <Button className='btn-add'
                                               sx={{ml: 'auto'}}
                                               size='small'
                                               onClick={() => {
                                                   antecedents.push({name: value, type: 4, uuid: ''})
                                                   setAntecedents([...antecedents])
                                               }}
                                               startIcon={<AddIcon/>}>
                        {t('createAnt')}
                    </Button>
                }
            </Box>
        </FamilyHistoryDialogStyled>
    )
}

export default FamilyHistoryDialog