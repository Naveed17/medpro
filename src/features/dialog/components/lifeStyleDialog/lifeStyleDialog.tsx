import React, {ChangeEvent, useEffect, useState} from 'react'
import LifeStyleDialogStyled from './overrides/lifeStyleDialogStyle'
import {useTranslation} from 'next-i18next';
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    InputAdornment,
    Skeleton,
    Stack,
    TextField
} from '@mui/material'
import {useRequest} from "@app/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import CodeIcon from "@mui/icons-material/Code";
import AddIcon from "@mui/icons-material/Add";

function LifeStyleDialog({...props}) {
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
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    const state: AntecedentsModel[] = props.data.state;
    const setState = props.data.setState;
    const {data: session} = useSession();
    const [value, setValue] = useState("");
    const [antecedents, setAntecedents] = useState<AntecedentsTypeModel[]>([]);

    const router = useRouter();

    const {data: httpAntecedentsResponse} = useRequest({
        method: "GET",
        url: `/api/antecedents/${codes[action]}/${router.locale}`,
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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const index = state.findIndex((v: any) => v.uuid === event.target.name);
        if (index === -1) {
            const antecents = antecedents.find((ant: any) => ant.uuid === event.target.name);
            const antecendent = {uuid: antecents?.uuid, name: antecents?.name, startDate: '', endDate: ''}
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


                    !httpAntecedentsResponse ?
                        initalData.map((item, index) => (
                            <Box
                                key={index}
                                sx={{display: "flex", alignItems: "center", margin: "0 5px"}}
                            >
                                <Checkbox size="small"/>
                                <Skeleton width={180} variant="text"/>
                            </Box>
                        ))

                        :
                        antecedents.filter((item: AntecedentsTypeModel) => {
                            return item.name.toLowerCase().includes(value.toLowerCase());
                        })
                            .map((list: AntecedentsTypeModel, idx: number) =>
                                <FormGroup row key={idx}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={state?.find(inf => inf.uuid == list.uuid) !== undefined}
                                                      onChange={handleChange} name={list.uuid}/>
                                        }
                                        label={list.name}
                                    />
                                    {
                                        state?.find((inf: AntecedentsModel) => inf.uuid == list.uuid) &&
                                        <Stack spacing={1} direction={'row'}>
                                            <TextField
                                                name={`${list.uuid}`}
                                                value={state.find((i: AntecedentsModel) => i.uuid === list.uuid)?.startDate ? state.find((i: AntecedentsModel) => i.uuid === list.uuid)?.startDate : ''}
                                                placeholder={t('starting_year')}
                                                sx={{width: 130}}
                                                onChange={(e) => {
                                                    let items = state.map((item: AntecedentsModel) => ({...item}));
                                                    let item = items.find((i: AntecedentsModel) => i.uuid === list.uuid)
                                                    if (item) item.startDate = e.target.value;
                                                    setState(items)
                                                }
                                                }/>
                                            <TextField
                                                name={`${list.uuid}`}
                                                sx={{width: 130}}
                                                value={state.find(i => i.uuid === list.uuid)?.endDate ? state.find(i => i.uuid === list.uuid)?.endDate : ''}
                                                placeholder={t('ending_year')}
                                                onChange={(e) => {
                                                    let items = state.map(item => ({...item}));
                                                    let item = items.find(i => i.uuid === list.uuid)
                                                    if (item) item.endDate = e.target.value;
                                                    setState(items)
                                                }
                                                }/>
                                        </Stack>
                                    }
                                </FormGroup>
                            )
                }
                {antecedents.filter((item: any) => {
                        return item.name.toLowerCase().includes(value.toLowerCase());
                    }).length === 0 &&
                    <Button className='btn-add'
                            sx={{ml: 'auto'}}
                            size='small'
                            onClick={() => {
                                antecedents.push({name: value, type: codes[action], uuid: ''})
                                setAntecedents([...antecedents])
                            }}
                            startIcon={<AddIcon/>}>
                        {t('createAnt')}
                    </Button>
                }
            </Box>
        </LifeStyleDialogStyled>
    )
}

export default LifeStyleDialog