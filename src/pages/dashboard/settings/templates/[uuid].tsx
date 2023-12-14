import {GetStaticPaths, GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useRef, useState} from "react";
import {configSelector, DashLayout} from "@features/base";
import {useTranslation} from "next-i18next";
import {useFormik} from "formik";
import {
    Box,
    Button,
    Checkbox,
    Collapse,
    DialogActions,
    FormControl,
    Grid,
    IconButton,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {useSnackbar} from "notistack";
import Paper from '@mui/material/Paper';

import {useReactToPrint} from "react-to-print";
import {SubHeader} from "@features/subHeader";
import {RootStyled} from "@features/toolbar";
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded';
import {Dialog} from "@features/dialog";
import {Theme} from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import {useAppSelector} from "@lib/redux/hooks";
import Autocomplete from "@mui/material/Autocomplete";
import {MuiAutocompleteSelectAll} from "@features/muiAutocompleteSelectAll";
import {useMedicalProfessionalSuffix} from "@lib/hooks";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import {LoadingScreen} from "@features/loadingScreen";
import {Resizable} from "re-resizable";

function DocsConfig() {
    const router = useRouter();
    const theme = useTheme();
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();
    const isMobile = useMediaQuery("(max-width:669px)");
    const {enqueueSnackbar} = useSnackbar();

    const {t, ready} = useTranslation(["settings", "common"], {keyPrefix: "documents.config"});
    const {direction} = useAppSelector(configSelector);

    const componentRef = useRef<HTMLDivElement>(null);

    const [files, setFiles] = useState<any[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [types, setTypes] = useState([]);
    const [removeModelDialog, setRemoveModelDialog] = useState(false);
    const [title, setTitle] = useState("");
    const [isDefault, setIsDefault] = useState(false);
    const [hasData, setHasData] = useState(false);
    const [propsModel, setPropsModel] = useState(true);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<any>();
    const [docHeader, setDocHeader] = useState<DocTemplateModel | null>(null);
    const [data, setData] = useState<any>({
        background: {show: false, content: {url: ''}},
        header: {show: true, x: 0, y: 0},
        footer: {show: false, x: 0, y: 900, content: ''},
        title: {show: true, content: 'ORDONNANCE MEDICALE', x: 0, y: 150},
        date: {show: true, prefix: 'Le ', content: '[ 00 / 00 / 0000 ]', x: 0, y: 200, textAlign: "right"},
        patient: {show: true, prefix: 'Nom & prénom: ', content: 'MOHAMED ALI', x: 40, y: 250},
        cin: {show: false, prefix: 'CIN : ', content: '', x: 40, y: 274},
        age: {show: true, prefix: 'AGE:', content: '', x: 40, y: 316},
        size: 'portraitA4',
        content: {
            show: true,
            maxHeight: 600,
            maxWidth: 130,
            content: '[ Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium ]',
            x: 0,
            y: 320
        }
    })
    const [queryState, setQueryState] = useState<any>({type: []});
    const uuid = router.query.uuid;

    const selectedAll = queryState.type.length === types?.length;

    const {trigger: triggerHeaderUpdate} = useRequestQueryMutation("/MP/header/update");
    const {trigger: triggerHeaderDelete} = useRequestQueryMutation("/MP/header/delete");

    const {data: httpDocumentHeader, mutate} = useRequestQuery(urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/header/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    const {data: httpTypeResponse} = useRequestQuery({
        method: "GET",
        url: `/api/private/document/types/${router.locale}`
    }, {variables: {query: "?is_active=0"}});

    const formik = useFormik({
        children: undefined,
        component: undefined,
        initialErrors: undefined,
        initialTouched: undefined,
        innerRef: undefined,
        isInitialValid: undefined,

        onSubmit: async (values) => {
            return values;
        },

        enableReinitialize: true,
        initialValues: {
            left1: "",
            left2: "",
            left3: "",
            right1: "",
            right2: "",
            right3: ""
        }
    })
    let {values, getFieldProps, setFieldValue} = formik;

    const handleDrop = React.useCallback((acceptedFiles: File[]) => {
            let reader = new FileReader();
            reader.onload = (ev) => {
                data.background.content.url = (ev.target?.result as string)
                data.background.show = true;
                setData({...data})
            }
            reader.readAsDataURL(acceptedFiles[0]);
            setFile(acceptedFiles[0]);
            setFiles([...files, ...acceptedFiles]);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [files]
    );

    const handleInsuranceChange = (gTypes: any[]) => {
        setQueryState({
            type: gTypes
        });
    }

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

    const handleAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: string | null,) => {
        data.date.textAlign = newAlignment;
        setData({...data});
    };

    const printNow = () => {
        handlePrint()
    }

    const handleRemove = (file: any) => {
        setFiles(files.filter((_file: any) => _file !== file));
        data.background.content = ''
        setFile(null)
        setData({...data})
    };

    const eventHandler = (ev: any, location: { x: any; y: any; }, from: string) => {
        data[from].x = location.x
        data[from].y = location.y
        setData({...data})
    }

    const save = () => {
        let typeUuids = ""
        queryState.type.map((type: { uuid: string; }) => {
            typeUuids += type.uuid + ','
        });
        typeUuids = typeUuids.slice(0, -1);

        const form = new FormData();
        data.background.content = "";
        form.append('document_header', JSON.stringify({header: values, data}));
        form.append('title', title);
        form.append('isDefault', JSON.stringify(isDefault));
        if (file)
            form.append('file', file);
        if (typeUuids.length > 0)
            form.append('types', typeUuids);

        const url = uuid === 'new' ? `${urlMedicalProfessionalSuffix}/header/${router.locale}` : `${urlMedicalProfessionalSuffix}/header/${uuid}/${router.locale}`
        triggerHeaderUpdate({
            method: uuid === 'new' ? "POST" : "PUT",
            url,
            data: form
        }, {
            onSuccess: () => {
                enqueueSnackbar(t("updated"), {variant: 'success'})
                mutate().then(() => {
                    router.back();
                });
            }
        })
    }

    const openRemoveDialog = () => {
        setRemoveModelDialog(true);
        setSelected({
            title: t('askRemove'),
            subtitle: t('subtitleRemove'),
            icon: "/static/icons/setting/ic-edit-file.svg",
            name1: title,
            name2: ""
        })
    }

    const removeModel = () => {
        triggerHeaderDelete({
            method: "DELETE",
            url: `${urlMedicalProfessionalSuffix}/header/${uuid}/${router.locale}`
        }, {
            onSuccess: () => {
                mutate().then(() => {
                    router.back();
                    enqueueSnackbar(t("removed"), {variant: 'error'})
                });
            }
        });
    }

    const handleSelectAll = (insurances: any): void => {
        setQueryState(insurances);
        handleInsuranceChange(insurances.type);
    }

    useEffect(() => {
        if (httpDocumentHeader)
            setDocHeader((httpDocumentHeader as HttpResponse).data.find((res: { uuid: string }) => res.uuid === uuid))

        setTimeout(() => {
            setLoading(false)
        }, 2000);
    }, [httpDocumentHeader, uuid])

    useEffect(() => {
        if (docHeader) {
            const dh = (docHeader as DocTemplateModel)
            setTitle(dh.title);
            setIsDefault(dh.isDefault);
            setHasData(dh.hasData);
            setQueryState({
                type: (dh.types)
            });
            const header = dh.header.header
            if (header) {
                setFieldValue("left1", header.left1)
                setFieldValue("left2", header.left2)
                setFieldValue("left3", header.left3)
                setFieldValue("right1", header.right1)
                setFieldValue("right2", header.right2)
                setFieldValue("right3", header.right3)
            }

            const data = dh.header.data
            if (data) {
                if (data.footer === undefined)
                    setData({
                        ...data,
                        footer: {show: true, x: 0, y: 140, content: ''},
                        background: {show: data.background.show, content: docHeader.file ? docHeader.file : ''}
                    })
                else
                    setData({
                        ...data,
                        background: {show: data.background.show, content: docHeader.file ? docHeader.file : ''}
                    })
            }

            setTimeout(() => {
                setLoading(false)
            }, 1000)

            setTimeout(() => {
                const footer = document.getElementById('footer');
                if (footer && data.footer) footer.innerHTML = data.footer.content
            }, 1200)

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [docHeader])

    useEffect(() => {
        if (httpTypeResponse)
            setTypes((httpTypeResponse as HttpResponse).data);
    }, [httpTypeResponse])

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{`${t("path")} > ${uuid === 'new' ? 'Créer document' : 'Modifier document'}`}</p>
                </RootStyled>

                {uuid !== 'new' && !hasData && <Button
                    type="submit"
                    variant="contained"
                    color={"error"}
                    style={{marginRight: 10}}
                    onClick={openRemoveDialog}>
                    {!isMobile ? t("remove") : <DeleteOutlineRoundedIcon/>}
                </Button>}
                <Button
                    type="submit"
                    variant="contained"
                    onClick={save}>
                    {!isMobile ? t("save") : <ModeEditOutlineRoundedIcon/>}
                </Button>
            </SubHeader>

            <Grid container>
                <Grid item xs={12} md={3}>
                    <Box padding={2} style={{background: "white", height: "81vh", overflowX: "auto"}}>
                        <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}
                               style={{borderBottom: "1px solid #DDD"}}>
                            <Typography fontSize={16} fontWeight={"bold"}>{t('modelProprities')}</Typography>
                            <IconButton onClick={() => setPropsModel(!propsModel)}>
                                {propsModel ? <KeyboardArrowUpRoundedIcon/> : <KeyboardArrowDownRoundedIcon/>}
                            </IconButton>
                        </Stack>
                        <Collapse in={propsModel} style={{paddingTop: 10}}>
                            <Typography fontSize={14} color={'#999'} mb={1}>{t('titleModel')}</Typography>
                            <TextField
                                variant="outlined"
                                placeholder={t('titleholder')}
                                required
                                style={{marginBottom: 15}}
                                value={title}
                                onChange={(ev) => {
                                    setTitle(ev.target.value)
                                }}
                                fullWidth/>


                            <Typography fontSize={14} color={'#999'} mb={1}>{t('selectTypes')}</Typography>

                            <MuiAutocompleteSelectAll.Provider
                                value={{
                                    onSelectAll: (selectedAll) => void handleSelectAll({type: selectedAll ? [] : types}),
                                    selectedAll,
                                    indeterminate: !!queryState.type.length && !selectedAll,
                                }}
                            >
                                <Autocomplete
                                    size={"small"}
                                    id={"types"}
                                    multiple
                                    autoHighlight
                                    filterSelectedOptions
                                    limitTags={3}
                                    noOptionsText={"Aucun type selectionné"}
                                    ListboxComponent={MuiAutocompleteSelectAll.ListBox}
                                    value={queryState.type ? queryState.type : []}
                                    onChange={(event, value) => handleInsuranceChange(value)}
                                    options={types}
                                    style={{marginBottom: 15}}
                                    getOptionLabel={option => option?.name ? option.name : ""}
                                    isOptionEqualToValue={(option: any, value) => option.name === value.name}
                                    renderOption={(params, option, {selected}) => (
                                        <MenuItem
                                            {...params}>
                                            <Checkbox checked={selected}/>
                                            <Typography sx={{ml: 1}}>{option.name}</Typography>
                                        </MenuItem>)}
                                    renderInput={(params) => (
                                        <FormControl component="form" fullWidth>
                                            <TextField color={"info"}
                                                       {...params}
                                                       sx={{paddingLeft: 0}}
                                                       placeholder={""}
                                                       variant="outlined"
                                            />
                                        </FormControl>)}
                                />
                            </MuiAutocompleteSelectAll.Provider>


                            <Typography fontSize={14} color={'#999'} mb={1}>{t('docSize')}</Typography>
                            <FormControl fullWidth>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={data.size}
                                    size={"small"}
                                    onChange={(ev) => {
                                        data.size = ev.target.value;
                                        console.log(ev.target.value)
                                        setData({...data})
                                    }}>
                                    <MenuItem value={"portraitA4"}>A4</MenuItem>
                                    <MenuItem value={"portraitA5"}>A5</MenuItem>
                                </Select>
                            </FormControl>

                            <Stack direction="row" alignItems='center' sx={{
                                border: `1px solid ${theme.palette.grey["200"]}`,
                                borderRadius: 1,
                                marginTop: 2,
                                padding: "2px 10px 2px 0",
                                bgcolor: theme => theme.palette.grey['A500'],
                            }}>
                                <Checkbox checked={isDefault} onChange={ev => setIsDefault(ev.target.checked)}/>

                                <Typography>{t("asDefault")}</Typography>
                            </Stack>
                        </Collapse>
                    </Box>
                </Grid>

                <Grid item xs={12} md={9}>
                        <IconButton onClick={printNow} sx={{
                            border: "1px solid",
                            mr: 1,
                            borderRadius: 2,
                            color: theme.palette.grey[400]
                        }}>
                        </IconButton>
                    <Box padding={2} style={{height: "81vh", overflowX: "auto"}}>
                        <Box className={"portraitA4"} style={{margin:"auto",padding:50}} ref={componentRef}>

                            <Resizable
                                style={{border:"1px solid"}}
                                defaultSize={{
                                    width: 320,
                                    height: 200,
                                }}>

                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            <p>[Si n&eacute;cessaire, donnez des recommandations pour le suivi, des examens
                                compl&eacute;mentaires ou un traitement. Par exemple, un suivi plus r&eacute;gulier, une
                                consultation avec un sp&eacute;cialiste, des tests de laboratoire, un traitement
                                m&eacute;dicamenteux, etc.]</p>
                            </Resizable>

                        </Box>
                    </Box>
                </Grid>

                {/* <Grid item xs={12} md={7}>
                    {<Box padding={2}>
                        <Box style={{margin: 'auto', paddingTop: 20}}>
                            <Box ref={componentRef}>
                                {!loading && <PreviewA4  {...{eventHandler, data, values, loading}} />}
                                {loading &&
                                    <div className={data.size ? data.size : "portraitA5"} style={{padding: 20}}>
                                        {Array.from(Array(30)).map((item, key) => (
                                            <Skeleton key={key}></Skeleton>))}
                                    </div>}
                            </Box>
                        </Box>

                    </Box>}
                </Grid>*/}
            </Grid>


            <Dialog
                action={"remove"}
                open={removeModelDialog}
                data={selected}
                direction={direction}
                color={(theme: Theme) => theme.palette.error.main}
                title={t('remove')}
                actionDialog={
                    <DialogActions>
                        <Button onClick={() => {
                            setRemoveModelDialog(false);
                        }}
                                startIcon={<CloseIcon/>}>{t('cancel')}</Button>
                        <LoadingButton
                            variant="contained"
                            loading={loading}
                            sx={{backgroundColor: (theme: Theme) => theme.palette.error.main}}
                            onClick={removeModel}>{t('remove')}</LoadingButton>
                    </DialogActions>
                }
            />
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, [
            "common",
            "menu",
            "patient",
            "settings",
        ])),
    },
});
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: "blocking", //indicates the type of fallback
    };
};
export default DocsConfig;

DocsConfig.auth = true;

DocsConfig.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
