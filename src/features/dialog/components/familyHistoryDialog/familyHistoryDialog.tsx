import React, {ChangeEvent, useEffect, useState} from 'react'
import FamilyHistoryDialogStyled from './overrides/familyHistoryDialogStyle'
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
    TextField,
    Typography
} from '@mui/material'
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useRequest, useRequestMutation} from "@lib/axios";
import CodeIcon from "@mui/icons-material/Code";
import AddIcon from "@mui/icons-material/Add";
import {LoadingScreen} from "@features/loadingScreen";

function FamilyHistoryDialog({...props}) {
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    const state: FamilyAntecedentsModel[] = props.data.state;
    const setState = props.data.setState;
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(true);
    const initalData = Array.from(new Array(20));
    const [antecedents, setAntecedents] = useState<AntecedentsTypeModel[]>([]);
    const {trigger} = useRequestMutation(null, "/antecedent");
    const allAntecedents = props.data.antecedents;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const index = state.findIndex((v: any) => v.uuid === event.target.name);
        if (index === -1) {
            const antecents = (httpAntecedentsResponse as HttpResponse).data.find((ant: any) => ant.uuid === event.target.name);
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

    useEffect(() => {
        if (state && antecedents.length > 0) {
            let items = state.map(item => ({...item}));
            items.map(item => {
                if (antecedents.find(ant => ant.uuid === item.uuid)?.value_type === 2 && item.response && typeof item.response !== "string") {
                    item.response = item.response[0]?.uuid
                }
            })
            setState(items)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [antecedents])

    const {data: httpAntecedentsResponse} = useRequest({
        method: "GET",
        url: `/api/private/antecedents/${allAntecedents.find((ant: { slug: any; }) => ant.slug === 'family_antecedents').uuid}/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    });

    useEffect(() => {
        if (httpAntecedentsResponse) {
            setAntecedents((httpAntecedentsResponse as HttpResponse).data)
            setLoading(false);
        }
    }, [httpAntecedentsResponse])


    const handleChangeSearch = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setValue(e.target.value);
    };

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);
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
                    loading ?
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
                            .map((list: any, idx: number) =>
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
                                        <>
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
                                            </Stack>
                                            {
                                                list.value_type === 1 &&
                                                <TextField
                                                    value={state.find((i: FamilyAntecedentsModel) => i.uuid === list.uuid)?.response ? state.find((i: FamilyAntecedentsModel) => i.uuid === list.uuid)?.response : ''}
                                                    placeholder={t('note')}
                                                    sx={{width: '100%', mt: 1, mb: 2, ml: 2}}
                                                    onChange={(e) => {
                                                        let items = state.map((item: FamilyAntecedentsModel) => ({...item}));
                                                        let item = items.find((i: FamilyAntecedentsModel) => i.uuid === list.uuid)
                                                        if (item) item.response = e.target.value;
                                                        setState(items)
                                                    }
                                                    }/>
                                            }
                                            {
                                                list.value_type === 2 &&
                                                <>
                                                    <Typography fontSize={10} color={"text.secondary"} mt={2}
                                                                ml={1}>{t('selectPlz')}</Typography>
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
                                        </>

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
                                                   const form = new FormData();
                                                   form.append('type', allAntecedents.find((ant: { slug: any; }) => ant.slug === 'family_antecedents').uuid);
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
                                                       antecedents.push({
                                                           name: value,
                                                           type: allAntecedents.find((ant: { slug: any; }) => ant.slug === 'family_antecedents').uuid,
                                                           uuid: (data?.data as HttpResponse).data.uuid,
                                                           value_type: -1
                                                       })
                                                       setAntecedents([...antecedents])
                                                   });

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
