import {
    Box,
    Card, Chip, Collapse,
    Grid,
    IconButton, InputAdornment,
    Skeleton,
    Stack,
    TextField,
    Typography
} from '@mui/material'
import {Form, FormikProvider, useFormik} from "formik";
import BalanceSheetDialogStyled from '../balanceSheet/overrides/balanceSheetDialogStyle';
import {useTranslation} from 'next-i18next'
import Icon from '@themes/urlIcon'
import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {useRequest, useRequestMutation} from "@lib/axios";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

import {NoDataCard} from "@features/card";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {ExpandMore} from "@features/buttons";

export const MedicalPrescriptionCardData = {
    mainIcon: "ic-soura",
    title: "noRequest",
    description: "noRequest-description"
};

function MedicalImageryDialog({...props}) {
    const {data} = props;

    const [miList, setMiList] = useState<MIModel[]>([]);
    const [defaultMiList, setDefaultMiList] = useState<MIModel[]>([]);
    const [mi, setMi] = useState<MIModel[]>([...data.state]);
    const [loading, setLoading] = useState<boolean>(true);
    const {trigger} = useRequestMutation(null, "/medicalImagery");
    const [name, setName] = useState('');

    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    const formik = useFormik({
        initialValues: {
            name: ''
        },
        onSubmit: async () => {
            if (name.length > 0)
                addImage({uuid: '', name})
        },
    });

    const initialData = Array.from(new Array(10));

    const router = useRouter();
    const {data: session} = useSession();

    const {data: httpAnalysisResponse} = useRequest({
        method: "GET",
        url: "/api/private/medical-imaging/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const addImage = (value: MIModel) => {
        setName('')
        setMiList((httpAnalysisResponse as HttpResponse)?.data);
        mi.unshift({...value, note: ""})
        setMi([...mi])
        localStorage.setItem("medical-imagery-recent", JSON.stringify([...mi]));
        data.setState([...mi])
    }

    const handleChange = (ev: { target: { value: string; }; }) => {
        searchInMedicalImagery(ev.target.value);

    }

    const searchInMedicalImagery = (medicalImagery: string) => {
        setName(medicalImagery);
        if (medicalImagery.length >= 2) {
            trigger({
                method: "GET",
                url: `/api/private/medical-imaging/${router.locale}?name=${medicalImagery}`,
                headers: {Authorization: `Bearer ${session?.accessToken}`}
            }).then((r) => {
                const res = (r?.data as HttpResponse).data;
                setMiList(res)
            })
        } else {
            const recent = localStorage.getItem("medical-imagery-recent") ? JSON.parse(localStorage.getItem("medical-imagery-recent") as string) : [] as AnalysisModel[];
            setMiList([
                ...recent,
                ...defaultMiList.filter(x => !recent.find((r: AnalysisModel) => r.uuid === x.uuid))]);
        }
    }

    useEffect(() => {
        if (httpAnalysisResponse) {
            const res = (httpAnalysisResponse as HttpResponse)?.data;
            const recent = localStorage.getItem("medical-imagery-recent") ? JSON.parse(localStorage.getItem("medical-imagery-recent") as string) : [] as AnalysisModel[];
            setDefaultMiList(res)
            setMiList([
                ...recent,
                ...res.filter((x: {
                    uuid: string | undefined;
                }) => !recent.find((r: AnalysisModel) => r.uuid === x.uuid))]);
            setTimeout(() => {
                setLoading(false);
            }, 1000)
        }
    }, [httpAnalysisResponse]) // eslint-disable-line react-hooks/exhaustive-deps

    const {handleSubmit} = formik;

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <BalanceSheetDialogStyled>
            <Grid container spacing={5}>
                <Grid item xs={12} md={7}>
                    <FormikProvider value={formik}>
                        <Stack
                            spacing={2}
                            component={Form}
                            autoComplete="off"
                            noValidate
                            onSubmit={handleSubmit}>
                            <Stack spacing={1}>
                                <Stack direction="row" alignItems="center">
                                    <Typography>{t('please_name_medical_imagery')}</Typography>
                                </Stack>

                                <TextField
                                    id="balance_sheet_name"
                                    value={name}
                                    placeholder={t('placeholder_medical_imagery')}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">
                                            <SearchIcon/>
                                        </InputAdornment>,
                                    }}
                                    onChange={handleChange}/>
                                {/*<Autocomplete
                                    value={imageryValue}
                                    onInputChange={(event, value) => searchInMedicalImagery(value)}
                                    onChange={(event, newValue) => {
                                        if (typeof newValue === 'string') {
                                            addImage({
                                                name: newValue,
                                            });
                                        } else if (newValue && newValue.inputValue) {
                                            // Create a new value from the user input
                                            addImage({
                                                name: newValue.inputValue,
                                            });
                                        } else {
                                            const medicalImagery = (newValue as MIModel);
                                            if (!mi.find(item => item.uuid === medicalImagery.uuid)) {
                                                addImage(newValue as MIModel);
                                            }
                                        }
                                        sortMedicalImagery();
                                    }}
                                    filterOptions={(options, params) => {
                                        const filtered = filter(options, params);
                                        const {inputValue} = params;
                                        // Suggest the creation of a new value
                                        const isExisting = options.some((option) => inputValue === option.name);
                                        if (inputValue !== '' && !isExisting) {
                                            filtered.push({
                                                inputValue,
                                                name: `${t('add_medical_imagery')} "${inputValue}"`,
                                            });
                                        }

                                        return filtered;
                                    }}
                                    selectOnFocus
                                    clearOnEscape
                                    handleHomeEndKeys
                                    id="sheet-solo-balance"
                                    options={miList ? miList : []}
                                    getOptionLabel={(option) => {
                                        // Value selected with enter, right from the input
                                        if (typeof option === 'string') {
                                            return option;
                                        }
                                        // Add "xxx" option created dynamically
                                        if (option.inputValue) {
                                            return option.inputValue;
                                        }
                                        // Regular option
                                        return option.name;
                                    }}
                                    renderOption={(props, option) => <li {...props}>{option.name}</li>}
                                    freeSolo
                                    renderInput={(params) => (
                                        <TextField {...params} label={t('placeholder_medical_imagery')}/>
                                    )}
                                />*/}
                            </Stack>
                            <Typography color={"gray"} fontSize={12}>
                                {t('recent-search')}
                            </Typography>

                            <Box>
                                {!loading ? miList?.map((item, index) => (
                                        <Chip
                                            className={"chip-item"}
                                            key={index}
                                            id={item.uuid}
                                            onClick={() => addImage(item)}
                                            onDragStart={(event) => event.dataTransfer.setData("Text", (event.target as any).id)}
                                            onDelete={() => console.log("delete")}
                                            disabled={!!mi.find(an => an.uuid === item.uuid)}
                                            label={item.name}
                                            color="default"
                                            clickable
                                            draggable="true"
                                            deleteIcon={<AddIcon/>}
                                        />
                                    ))
                                    :
                                    initialData.map((item, index) => (
                                        <Chip
                                            className={"chip-item"}
                                            key={index}
                                            label={""}
                                            color="default"
                                            clickable
                                            draggable="true"
                                            avatar={<Skeleton width={90} sx={{marginLeft: '16px !important'}}
                                                              variant="text"/>}
                                            deleteIcon={<AddIcon/>}
                                        />)
                                    )}
                            </Box>
                        </Stack>
                    </FormikProvider>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Stack direction="row" alignItems="center">
                        <Typography gutterBottom>{t('medical_imagery_list')}</Typography>
                    </Stack>
                    <Box className="list-container"
                         sx={{minHeight: 300, pr: 1}}
                         onDragOver={event => event.preventDefault()}
                         onDrop={(event) => {
                             event.preventDefault();
                             const data = event.dataTransfer.getData("Text");
                             addImage(miList.find(item => item.uuid === data) as MIModel);
                         }}>
                        {mi.length > 0 ?
                            mi.map((item, index) => (
                                <Card key={index}>
                                    <Stack p={2} pt={1} pb={1} direction='row' alignItems="center"
                                           justifyContent='space-between'>
                                        <Typography>{item.name}</Typography>
                                        <ExpandMore
                                            expand={item.expanded as boolean}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                setMi([
                                                    ...mi.slice(0, index),
                                                    {...mi[index], expanded: !item.expanded,},
                                                    ...mi.slice(index + 1)
                                                ]);
                                            }}
                                            aria-expanded={item.expanded}
                                            aria-label="show more"
                                        >
                                            <ExpandMoreIcon/>
                                        </ExpandMore>
                                        <IconButton size="small" onClick={() => {
                                            mi.splice(index, 1);
                                            setMi([...mi])
                                            data.setState([...mi])
                                        }}>
                                            <Icon path="setting/icdelete"/>
                                        </IconButton>
                                    </Stack>
                                    <Collapse in={item.expanded} timeout="auto" unmountOnExit>
                                        <Box padding={1} pt={0}>
                                            <TextField
                                                fullWidth
                                                placeholder={t("note")}
                                                multiline={true}
                                                style={{backgroundColor: "white", borderRadius: 5}}
                                                inputProps={
                                                    {
                                                        style: {
                                                            padding: 3
                                                        },
                                                    }
                                                }
                                                rows={5}
                                                value={item.note}
                                                onChange={event => {
                                                    let items = [...mi];
                                                    let x = {...mi[index]};
                                                    x.note = event.target.value;
                                                    items[index] = x;
                                                    setMi([...items])
                                                    data.setState([...items])
                                                }}
                                            />
                                        </Box>
                                    </Collapse>
                                </Card>
                            ))
                            : <Card className='loading-card'>
                                <Stack spacing={2}>
                                    <NoDataCard
                                        {...{t}}
                                        ns={"consultation"}
                                        data={MedicalPrescriptionCardData}/>
                                </Stack>
                            </Card>
                        }
                    </Box>
                </Grid>
            </Grid>
        </BalanceSheetDialogStyled>
    )
}

export default MedicalImageryDialog
