import React, {ChangeEvent, useEffect, useState} from 'react'
import LifeStyleDialogStyled from './overrides/lifeStyleDialogStyle'
import {useTranslation} from 'next-i18next';
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControlLabel,
    FormGroup, IconButton,
    InputAdornment,
    List,
    ListItem,
    Skeleton,
    Stack,
    TextField,
    Theme,
    Typography,
    useMediaQuery
} from '@mui/material'
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import CodeIcon from "@mui/icons-material/Code";
import AddIcon from "@mui/icons-material/Add";
import dynamic from "next/dynamic";
import SearchIcon from "@mui/icons-material/Search";
import AntecedentWidget from "@features/dialog/components/lifeStyleDialog/AntecedentWidget";
import DeleteIcon from "@mui/icons-material/Delete";
import IconUrl from "@themes/urlIcon";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function LifeStyleDialog({...props}) {
    const router = useRouter();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const action = props.data.action;
    const allAntecedents = props.data.antecedents;
    const initalData = Array.from(new Array(20));
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    const state: AntecedentsModel[] = props.data.state;

    const setState = props.data.setState;

    const [value, setValue] = useState("");
    const [antecedents, setAntecedents] = useState<AntecedentsTypeModel[]>([]);
    const [loading, setLoading] = useState(true);

    const {trigger: triggerAntecedentCreate} = useRequestQueryMutation("/antecedent/create");
    const {data: httpAntecedentsResponse} = useRequestQuery({
        method: "GET",
        url: `/api/private/antecedents/${allAntecedents?.find((ant: {
            slug: any
        }) => ant.slug === action).uuid}/${router.locale}`
    });

    useEffect(() => {
        if (httpAntecedentsResponse)
            setAntecedents((httpAntecedentsResponse as HttpResponse).data)
    }, [httpAntecedentsResponse])

    useEffect(() => {
        if (state && antecedents.length > 0) {
            state.forEach((item: any) => {
                item.data.forEach((data: { response: { uuid: string; }[] | string; }) => {
                    if (antecedents.find(ant => ant.uuid === item.uuid)?.value_type === 2 && data.response && typeof data.response !== "string") {
                        data.response = data.response[0]?.uuid
                    }
                })
            })
            setState([...state])
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
            const antecedent = antecedents.find((ant: any) => ant.uuid === event.target.name);
            const _antecedent = {
                uuid: antecedent?.uuid,
                data: [{
                    antecedent: {uuid: antecedent?.uuid},
                    name: antecedent?.name,
                    startDate: '',
                    endDate: '',
                    response: '',
                    ascendantOf: null,
                    note: ''
                }
                ]
            }
            setState([...state, _antecedent])
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
                    <List sx={{width: '100%'}}>
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

                        {antecedents.filter((item: AntecedentsTypeModel) => item.name.toLowerCase().includes(value.toLowerCase())).map((list: any, idx: number) =>
                            <Stack key={idx} spacing={0}>
                                <ListItem>
                                    <FormGroup
                                        className={state?.find(inf => inf.uuid == list.uuid) !== undefined ? "selected-ant" : ""}
                                        row>
                                        <Stack style={{width: "100%"}}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={state?.find(inf => inf.uuid == list.uuid) !== undefined}
                                                        onChange={handleChange} name={list.uuid}/>
                                                }
                                                label={list.name}
                                            />

                                            {
                                                state.find(ant => ant.uuid === list.uuid) && state && state[state.findIndex(ant => ant.uuid === list.uuid)].data.map((data, index) => (
                                                    <Card key={data.uuid}
                                                          style={{width: "100%", borderStyle: "dashed", marginBottom: 10}}>
                                                        <CardContent>
                                                            <Stack style={{paddingRight: 20}}>
                                                                {
                                                                    state && state[state.findIndex(ant => ant.uuid === list.uuid)].data.length > 1 &&
                                                                    <Stack direction={"row"}
                                                                           justifyItems={"center"}
                                                                           justifyContent={"space-between"}
                                                                           style={{
                                                                               padding: 10,
                                                                               paddingTop: 0,
                                                                               marginBottom: 10,
                                                                               borderBottom: '1px dashed #DDD',
                                                                           }}>
                                                                        <Typography style={{
                                                                            letterSpacing: 2,
                                                                            color: "grey"
                                                                        }}>{list.name} {index + 1}</Typography>
                                                                        {index === state[state.findIndex(ant => ant.uuid === list.uuid)].data.length -1 && <Button size={"small"}
                                                                                 onClick={() => {
                                                                                     let x = state.findIndex(ant => ant.uuid === list.uuid)

                                                                                     state[x].data.splice(index, 1)
                                                                                     setState([...state]);

                                                                                 }}
                                                                                 color={"error"}>
                                                                            <IconUrl path={"setting/icdelete"}/>
                                                                        </Button>}

                                                                    </Stack>
                                                                }
                                                                <Stack spacing={1} direction={'row'}>
                                                                    {/*Start time*/}
                                                                    {
                                                                        !list.hideStartTime && <TextField
                                                                            name={`${list.uuid}`}
                                                                            value={data.startDate}
                                                                            placeholder={list.hideEndTime ? t('date') : t('starting_year')}
                                                                            sx={{width: 130}}
                                                                            onChange={(e) => {
                                                                                data.startDate = e.target.value;
                                                                                setState([...state])
                                                                            }
                                                                            }/>
                                                                    }
                                                                    {/*End time*/}
                                                                    {
                                                                        !list.hideEndTime && <TextField
                                                                            name={`${list.uuid}`}
                                                                            sx={{width: 130}}
                                                                            value={data.endDate}
                                                                            placeholder={t('ending_year')}
                                                                            onChange={(e) => {
                                                                                data.endDate = e.target.value;
                                                                                setState([...state])
                                                                            }
                                                                            }/>
                                                                    }
                                                                </Stack>
                                                                {action === 'family_antecedents' &&
                                                                    <Stack spacing={1} direction={'row'}>
                                                                        <FormControlLabel
                                                                            control={
                                                                                <Checkbox
                                                                                    name={list.uuid}
                                                                                    checked={state?.find(inf => inf.uuid == list.uuid)?.ascendantOf === 'father'}
                                                                                    onChange={() => {

                                                                                        if (data.ascendantOf === 'father')
                                                                                            data.ascendantOf = '';
                                                                                        else
                                                                                            data.ascendantOf = 'father';

                                                                                        setState([...state])
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
                                                                                        if (data.ascendantOf === 'mother')
                                                                                            data.ascendantOf = '';
                                                                                        else
                                                                                            data.ascendantOf = 'mother';
                                                                                        setState([...state])
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

                                                                                        if (data.ascendantOf === 'both')
                                                                                            data.ascendantOf = '';
                                                                                        else
                                                                                            data.ascendantOf = 'both';

                                                                                        setState([...state])
                                                                                    }}
                                                                                />
                                                                            }
                                                                            label={t('both')}
                                                                        />
                                                                    </Stack>}
                                                                {
                                                                    list.value_type === 1 &&
                                                                    <TextField
                                                                        value={data.response}
                                                                        placeholder={t('note')}
                                                                        sx={{width: '100%', mt: 1, ml: 2}}
                                                                        onChange={(e) => {
                                                                            data.response = e.target.value;
                                                                            setState([...state])
                                                                        }
                                                                        }/>
                                                                }
                                                                {!list.hideNote &&
                                                                    <TextField
                                                                        value={data.note}
                                                                        placeholder={t('note2')}
                                                                        sx={{width: '100%', mt: 1, ml: 2}}
                                                                        onChange={(e) => {
                                                                            data.note = e.target.value;
                                                                            setState([...state])
                                                                        }
                                                                        }/>
                                                                }
                                                                {
                                                                    list.value_type === 2 &&
                                                                    <>
                                                                        <Typography fontSize={10} mt={2}
                                                                                    ml={1}>{t('selectPlz')} <span
                                                                            style={{color: "red"}}> *</span></Typography>
                                                                        <Stack direction={'row'} spacing={{xs: 0, sm: 1}}
                                                                               mb={1}
                                                                               ml={1}
                                                                               {...(isMobile && {
                                                                                   sx: {
                                                                                       display: 'grid',
                                                                                       gridTemplateColumns: 'repeat(auto-fit, minmax(88px, 1fr))',
                                                                                       gap: 1,
                                                                                       width: 1,
                                                                                       "label": {
                                                                                           margin: 0
                                                                                       }
                                                                                   }
                                                                               })}
                                                                        >
                                                                            {list.values.map((val: {
                                                                                uuid: string;
                                                                                value: string
                                                                            }) => (
                                                                                <FormControlLabel
                                                                                    key={val.uuid}
                                                                                    control={
                                                                                        <Checkbox
                                                                                            name={val.uuid}
                                                                                            checked={data.response === val.uuid}
                                                                                            onChange={() => {
                                                                                                if (data.response === val.uuid)
                                                                                                    data.response = ''
                                                                                                else
                                                                                                    data.response = val.uuid;
                                                                                                setState([...state])
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
                                                                        <AntecedentWidget {...{
                                                                            list,
                                                                            data,
                                                                            state,
                                                                            setState
                                                                        }}/>
                                                                    </Box>
                                                                }
                                                            </Stack>
                                                        </CardContent>
                                                    </Card>
                                                ))
                                            }
                                            {
                                                list.multiple == true && state?.find(inf => inf.uuid == list.uuid) !== undefined &&
                                                <Button size={"small"}
                                                        style={{width: "fit-content"}}
                                                        onClick={() => {
                                                            const x: any = state[state.findIndex(ant => ant.uuid === list.uuid)];
                                                            x.data.push({
                                                                antecedent: {uuid: x?.uuid},
                                                                name: '',
                                                                startDate: '',
                                                                endDate: '',
                                                                response: '',
                                                                ascendantOf: null,
                                                                note: ''
                                                            })
                                                            setState([...state])
                                                        }}
                                                        startIcon={<AddIcon/>}>
                                                    <Typography
                                                        textTransform={"lowercase"}>{t('other')} {list.name}</Typography>
                                                </Button>
                                            }
                                        </Stack>
                                    </FormGroup>

                                </ListItem>

                            </Stack>
                        )}
                    </List>
                }
                {/***Create new antecedent***/}
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
                                triggerAntecedentCreate({
                                    method: "POST",
                                    url: `/api/private/antecedents/${router.locale}`,
                                    data: form
                                }, {
                                    onSuccess: (data: any) => {
                                        const res = (data?.data as HttpResponse).data;
                                        antecedents.push({
                                            name: value,
                                            type: allAntecedents?.find((ant: {
                                                slug: any;
                                            }) => ant.slug === action).uuid,
                                            uuid: res.uuid,
                                            value_type: -1,
                                            multiple: false
                                        })
                                        setState([...state, {
                                            endDate: "",
                                            name: res.name,
                                            res: "",
                                            startDate: "",
                                            uuid: res.uuid,
                                        }])
                                        setAntecedents([...antecedents])
                                    }
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
