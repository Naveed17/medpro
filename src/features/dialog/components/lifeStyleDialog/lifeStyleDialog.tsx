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
    List,
    ListItem,
    ListSubheader,
    Skeleton,
    Stack,
    TextField,
    Typography
} from '@mui/material'
import {useRequest, useRequestMutation} from "@lib/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import CodeIcon from "@mui/icons-material/Code";
import AddIcon from "@mui/icons-material/Add";
import dynamic from "next/dynamic";
import AntecedentWidget from "@features/dialog/components/lifeStyleDialog/AntecedentWidget";
import SearchIcon from "@mui/icons-material/Search";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function LifeStyleDialog({...props}) {

    const action = props.data.action;
    const allAntecedents = props.data.antecedents;
    const initalData = Array.from(new Array(20));
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    const state: AntecedentsModel[] = props.data.state;
    const setState = props.data.setState;
    const {data: session} = useSession();
    const [value, setValue] = useState("");
    const [antecedents, setAntecedents] = useState<AntecedentsTypeModel[]>([]);
    const [loading, setLoading] = useState(true);
    const {trigger} = useRequestMutation(null, "/antecedent");

    const router = useRouter();

    const {data: httpAntecedentsResponse} = useRequest({
        method: "GET",
        url: `/api/private/antecedents/${allAntecedents?.find((ant: {
            slug: any;
        }) => ant.slug === action).uuid}/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    });

    useEffect(() => {
        if (httpAntecedentsResponse)
            setAntecedents((httpAntecedentsResponse as HttpResponse).data)
    }, [httpAntecedentsResponse])

    useEffect(() => {
        if (state && antecedents.length > 0) {
            let items = state.map(item => ({...item}));
            items.forEach((item: any) => {
                if (antecedents.find(ant => ant.uuid === item.uuid)?.value_type === 2 && item.response && typeof item.response !== "string") {
                    item.response = item.response[0]?.uuid
                }
            })
            setState(items)
            setLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [antecedents])

    const handleChangeSearch = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const index = state.findIndex((v: any) => v.uuid === event.target.name);
        if (index === -1) {
            const antecents = antecedents.find((ant: any) => ant.uuid === event.target.name);
            const antecendent = {uuid: antecents?.uuid, name: antecents?.name, startDate: '', endDate: '', res: ''}
            setState([...state, antecendent])
        } else {
            setState([
                ...state.slice(0, index),
                ...state.slice(index + 1, state.length),
            ]);
        }
    };
    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <LifeStyleDialogStyled display='block'>
            <Box maxWidth={{xs: '100%', md: '100%'}} mx="auto">
                {loading ?
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
                    <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                        <ListSubheader>
                            <TextField
                                id="standard-basic"
                                variant="outlined"
                                placeholder={t('search')}
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
                                    startAdornment: <InputAdornment position="start">
                                        <SearchIcon/>
                                    </InputAdornment>
                                }}
                            />
                        </ListSubheader>
                        {antecedents.filter((item: AntecedentsTypeModel) => item.name.toLowerCase().includes(value.toLowerCase())).map((list: any, idx: number) =>
                            <ListItem key={idx}>
                                <FormGroup
                                    className={state?.find(inf => inf.uuid == list.uuid) !== undefined ? "selected-ant" : ""}
                                    row>
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={state?.find(inf => inf.uuid == list.uuid) !== undefined}
                                                      onChange={handleChange} name={list.uuid}/>
                                        }
                                        label={list.name}
                                    />
                                    {state?.find((inf: AntecedentsModel) => inf.uuid == list.uuid) &&
                                        <>
                                            <Stack spacing={1} direction={'row'}>
                                                {!list.hideStartTime && <TextField
                                                    name={`${list.uuid}`}
                                                    value={state.find((i: AntecedentsModel) => i.uuid === list.uuid)?.startDate ? state.find((i: AntecedentsModel) => i.uuid === list.uuid)?.startDate : ''}
                                                    placeholder={list.hideEndTime ? t('date') : t('starting_year')}
                                                    sx={{width: 130}}
                                                    onChange={(e) => {
                                                        let items = state.map((item: AntecedentsModel) => ({...item}));
                                                        let item = items.find((i: AntecedentsModel) => i.uuid === list.uuid)
                                                        if (item) item.startDate = e.target.value;
                                                        setState(items)
                                                    }
                                                    }/>}
                                                {!list.hideEndTime && <TextField
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
                                                    }/>}
                                            </Stack>
                                            {action === 'family_antecedents' && <Stack spacing={1} direction={'row'}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            name={list.uuid}
                                                            checked={state?.find(inf => inf.uuid == list.uuid)?.ascendantOf === 'father'}
                                                            onChange={() => {
                                                                let items = state.map(item => ({...item}));
                                                                let item = items.find(i => i.uuid === list.uuid)
                                                                if (item) {
                                                                    if (item.ascendantOf === 'father')
                                                                        item.ascendantOf = '';
                                                                    else
                                                                        item.ascendantOf = 'father';
                                                                }
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
                                                                if (item) {
                                                                    if (item.ascendantOf === 'mother')
                                                                        item.ascendantOf = '';
                                                                    else
                                                                        item.ascendantOf = 'mother';
                                                                }
                                                                setState(items)

                                                            }}
                                                        />
                                                    }
                                                    label={t('mother')}
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            name={list.uuid}
                                                            checked={state?.find(inf => inf.uuid === list.uuid)?.ascendantOf === 'both'}
                                                            onChange={() => {
                                                                let items = state.map(item => ({...item}));
                                                                let item = items.find(i => i.uuid === list.uuid)
                                                                if (item) {
                                                                    if (item.ascendantOf === 'both')
                                                                        item.ascendantOf = '';
                                                                    else
                                                                        item.ascendantOf = 'both';
                                                                }
                                                                setState(items)
                                                            }}
                                                        />
                                                    }
                                                    label={t('both')}
                                                />
                                            </Stack>}
                                            {
                                                list.value_type === 1 &&
                                                <TextField
                                                    value={state.find((i: AntecedentsModel) => i.uuid === list.uuid)?.response ? state.find((i: AntecedentsModel) => i.uuid === list.uuid)?.response : ''}
                                                    placeholder={t('note')}
                                                    sx={{width: '100%', mt: 1, ml: 2}}
                                                    onChange={(e) => {
                                                        let items = state.map((item: AntecedentsModel) => ({...item}));
                                                        let item = items.find((i: AntecedentsModel) => i.uuid === list.uuid)
                                                        if (item) item.response = e.target.value;
                                                        setState(items)
                                                    }
                                                    }/>
                                            }
                                            {!list.hideNote &&
                                                <TextField
                                                    value={state.find((i: AntecedentsModel) => i.uuid === list.uuid)?.note ? state.find((i: AntecedentsModel) => i.uuid === list.uuid)?.note : ''}
                                                    placeholder={t('note2')}
                                                    sx={{width: '100%', mt: 1, ml: 2}}
                                                    onChange={(e) => {
                                                        let items = state.map((item: AntecedentsModel) => ({...item}));
                                                        let item = items.find((i: AntecedentsModel) => i.uuid === list.uuid)
                                                        if (item) item.note = e.target.value;
                                                        setState(items)
                                                    }
                                                    }/>
                                            }
                                            {list.value_type === 2 &&
                                                <>
                                                    <Typography fontSize={10} mt={2}
                                                                ml={1}>{t('selectPlz')} <span
                                                        style={{color: "red"}}> *</span></Typography>
                                                    <Stack direction={'row'} spacing={1} mb={1} ml={1}>
                                                        {list.values.map((val: { uuid: string; value: string }) => (
                                                            <FormControlLabel
                                                                key={val.uuid}
                                                                control={
                                                                    <Checkbox
                                                                        name={val.uuid}
                                                                        checked={state?.find(inf => inf.uuid === list.uuid)?.response === val.uuid}
                                                                        onChange={() => {
                                                                            let items = state.map(item => ({...item}));
                                                                            let item = items.find(i => i.uuid === list.uuid)
                                                                            if (item) {
                                                                                if (item.response === val.uuid)
                                                                                    item.response = ''
                                                                                else
                                                                                    item.response = val.uuid;
                                                                            }
                                                                            setState(items)
                                                                        }}/>
                                                                }
                                                                label={val.value}
                                                            />))}
                                                    </Stack>
                                                </>
                                            }
                                            {
                                                list.value_type === 7 &&
                                                <Box padding={3} pb={0}>
                                                    <AntecedentWidget {...{list, state, setState}}/>
                                                </Box>
                                            }
                                        </>
                                    }
                                </FormGroup>
                            </ListItem>
                        )}
                    </List>
                }
                {antecedents.filter((item: any) => item.name.toLowerCase().includes(value.toLowerCase())).length === 0 &&
                    <Button className='btn-add'
                            sx={{ml: 'auto'}}
                            size='small'
                            onClick={() => {
                                const form = new FormData();
                                form.append('type', allAntecedents?.find((ant: {
                                    slug: any;
                                }) => ant.slug === action).uuid);
                                form.append('name', value);
                                trigger({
                                    method: "POST",
                                    url: `/api/private/antecedents/${router.locale}`,
                                    data: form,
                                    headers: {
                                        ContentType: 'multipart/form-data',
                                        Authorization: `Bearer ${session?.accessToken}`
                                    }
                                }, {revalidate: true, populateCache: true}).then((data) => {
                                    const res = (data?.data as HttpResponse).data;
                                    antecedents.push({
                                        name: value,
                                        type: allAntecedents?.find((ant: { slug: any; }) => ant.slug === action).uuid,
                                        uuid: res.uuid,
                                        value_type: -1
                                    })
                                    setState([...state, {
                                        endDate: "",
                                        name: res.name,
                                        res: "",
                                        startDate: "",
                                        uuid: res.uuid,
                                    }])
                                    setAntecedents([...antecedents])
                                });
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
