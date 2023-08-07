import {
    Autocomplete,
    Box,
    Card, Chip,
    Grid, InputAdornment,
    Skeleton,
    Stack,
    TextField,
    Typography
} from '@mui/material'
import {Form, FormikProvider, useFormik} from "formik";
import BalanceSheetDialogStyled from '../balanceSheet/overrides/balanceSheetDialogStyle';
import {useTranslation} from 'next-i18next'
import React, {createRef, useCallback, useEffect, useRef, useState} from 'react';
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {useRequest, useRequestMutation} from "@lib/axios";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

import {NoDataCard, NoteCardCollapse} from "@features/card";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import {debounce} from "lodash";
import {arrayUniqueByKey} from "@lib/hooks";

function MedicalImageryDialog({...props}) {
    const {data} = props;

    const [miList, setMiList] = useState<MIModel[]>([]);
    const [miListLocal, setMiListLocal] = useState<MIModel[]>([]);
    const [defaultMiList, setDefaultMiList] = useState<MIModel[]>([]);
    const [mi, setMi] = useState<MIModel[]>([...data.state]);
    const [loading, setLoading] = useState<boolean>(true);
    const {trigger} = useRequestMutation(null, "/medicalImagery");
    const [name, setName] = useState('');
    const [imageryValue] = useState<MIModel | null>(null);
    const [anchorElPopover, setAnchorElPopover] = useState<HTMLDivElement | null>(null);
    const textFieldRef = createRef<HTMLDivElement>();
    const autocompleteTextFieldRef = useRef<HTMLInputElement>(null);
    const openPopover = Boolean(anchorElPopover);

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
        const recent = localStorage.getItem("medical-imagery-recent") ?
            JSON.parse(localStorage.getItem("medical-imagery-recent") as string) : [] as MIModel[];
        localStorage.setItem("medical-imagery-recent", JSON.stringify([...mi.filter(x => !recent.find((r: MIModel) => r.uuid === x.uuid)), ...recent]));
        data.setState([...mi])
    }

    const handleClickPopover = useCallback(() => {
        setAnchorElPopover(textFieldRef.current);
    }, [textFieldRef]);

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

    const handleOnChangeImagery = (event: any, newValue: any) => {
        if (typeof newValue === 'string' && newValue.length > 0) {
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
            setMiListLocal(recent.length > 0 ? recent : res);
            setLoading(false);
        }
    }, [httpAnalysisResponse]) // eslint-disable-line react-hooks/exhaustive-deps

    const {handleSubmit} = formik;
    const debouncedOnChange = debounce(handleOnChangeImagery, 500);

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <BalanceSheetDialogStyled>
            <Grid container spacing={5}>
                <Grid item xs={12} md={8}>
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

                                {openPopover ?
                                    <Autocomplete
                                        size={"small"}
                                        value={imageryValue}
                                        onInputChange={(event, value) => searchInMedicalImagery(value)}
                                        onChange={(event, newValue) => {
                                            setAnchorElPopover(null);
                                            debouncedOnChange(event, newValue);
                                        }}
                                        filterOptions={(options, params) => {
                                            const {inputValue} = params;
                                            const filtered = options.filter(option =>
                                                [option.name.toLowerCase()].some(option => option?.includes(inputValue.toLowerCase())));
                                            // Suggest the creation of a new value
                                            const isExisting = options.some((option) => inputValue.toLowerCase() === option.name);
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
                                        freeSolo
                                        id="sheet-solo-balance"
                                        options={arrayUniqueByKey("name", miList)}
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
                                        renderOption={(props, option) => <li {...props}
                                                                             key={option.uuid ? option.uuid : "-1"}>{option.name}</li>}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                autoFocus
                                                inputRef={autocompleteTextFieldRef}
                                                label={t('placeholder_medical_imagery')}/>
                                        )}
                                    />
                                    :
                                    <TextField
                                        className={"MuiInputBase-input-hidden"}
                                        size={"small"}
                                        ref={textFieldRef}
                                        onClick={handleClickPopover}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">
                                                <SearchIcon/>
                                            </InputAdornment>,
                                        }}
                                        placeholder={t('placeholder_medical_imagery')}
                                        fullWidth/>}
                            </Stack>
                            <Typography color={"gray"} fontSize={12}>
                                {t('recent-search')}
                            </Typography>

                            <Box>
                                {!loading ? miListLocal?.slice(0, 20).map((item, index) => (
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
                <Grid item xs={12} md={4}>
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
                                <NoteCardCollapse
                                    key={index}
                                    {...{item, t}}
                                    onExpandHandler={(event: any) => {
                                        event.stopPropagation();
                                        setMi([
                                            ...mi.slice(0, index),
                                            {...mi[index], expanded: !item.expanded},
                                            ...mi.slice(index + 1)
                                        ]);
                                    }}
                                    onDeleteItem={() => {
                                        mi.splice(index, 1);
                                        setMi([...mi])
                                        data.setState([...mi])
                                    }}
                                    onNoteChange={(event: any) => {
                                        let items = [...mi];
                                        let x = {...mi[index]};
                                        x.note = event.target.value;
                                        items[index] = x;
                                        setMi([...items])
                                        data.setState([...items])
                                    }}/>
                            ))
                            : <Card className='loading-card'>
                                <Stack spacing={2}>
                                    <NoDataCard
                                        {...{t}}
                                        ns={"consultation"}
                                        data={{
                                            mainIcon: "ic-soura",
                                            title: "drag-imagery",
                                            description: "drag-description"
                                        }}/>
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
