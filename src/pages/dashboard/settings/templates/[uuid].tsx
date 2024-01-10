import {GetStaticPaths, GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useRef, useState} from "react";
import {configSelector, DashLayout} from "@features/base";
import {useTranslation} from "next-i18next";
import {
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    Collapse,
    DialogActions,
    FormControl,
    Grid,
    IconButton,
    LinearProgress,
    MenuItem,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {useSnackbar} from "notistack";

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
import {Doc} from "@features/page";
import IconUrl from "@themes/urlIcon";
import Icon from "@themes/urlIcon";
import PageStyled from "@features/page/components/overrides/pageStyled";
import {UploadFile} from "@features/uploadFile";

function DocsConfig() {
    const router = useRouter();
    const theme = useTheme();
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();
    const isMobile = useMediaQuery("(max-width:669px)");
    const {enqueueSnackbar} = useSnackbar();

    const {t, ready} = useTranslation(["settings", "common"], {keyPrefix: "documents.config"});
    const {direction} = useAppSelector(configSelector);

    const componentRef = useRef<HTMLDivElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [types, setTypes] = useState([]);
    const [removeModelDialog, setRemoveModelDialog] = useState(false);
    const [title, setTitle] = useState("");
    const [isDefault, setIsDefault] = useState(false);
    const [hasData, setHasData] = useState(false);
    const [propsModel, setPropsModel] = useState(false);
    const [elDoc, setElDoc] = useState(true);
    const [loading, setLoading] = useState(true);
    const [header, setHeader] = useState<any>(null);
    const [selected, setSelected] = useState<any>();
    const [docHeader, setDocHeader] = useState<DocTemplateModel | null>(null);
    const [data, setData] = useState<any>({
        background: {show: false, content: {url: ''}},
        header: {show: false, x: 0, y: 0},
        footer: {show: false, x: 0, y: 400, content: 'change me ...'},
        title: {show: false, content: 'ORDONNANCE MEDICALE', x: 0, y: 150},
        date: {show: false, prefix: 'Le ', content: '[ 00 / 00 / 0000 ]', x: 0, y: 200, textAlign: "right"},
        patient: {show: false, prefix: 'Nom & prénom: ', content: 'MOHAMED ALI', x: 40, y: 250},
        cin: {show: false, prefix: 'CIN : ', content: '', x: 40, y: 274},
        age: {show: false, prefix: 'AGE:', content: '', x: 40, y: 316},
        size: 'portraitA4',
        content: {
            show: true,
            maxHeight: 100,
            heightPages: [],
            maxWidth: 130,
            content: '<p>[ Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium ]</p>',
            x: 0,
            y: 320
        }
    })
    const [queryState, setQueryState] = useState<any>({type: []});
    const [files, setFiles] = useState<any[]>([]);
    const [onReSize, setOnResize] = useState(true)

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

    const handleInsuranceChange = (gTypes: any[]) => {
        setQueryState({
            type: gTypes
        });
    }

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

    const printNow = () => {
        handlePrint()
    }

    const save = () => {
        let typeUuids = ""
        queryState.type.map((type: { uuid: string; }) => {
            typeUuids += type.uuid + ','
        });
        typeUuids = typeUuids.slice(0, -1);

        const form = new FormData();
        data.background.content = "";
        form.append('document_header', JSON.stringify({header: header, data}));
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
                /*mutate().then(() => {
                    router.back();
                });*/
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


    useEffect(() => {
        if (httpDocumentHeader) {
            setDocHeader((httpDocumentHeader as HttpResponse).data.find((res: { uuid: string }) => res.uuid === uuid))
        }
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
            const _header = dh.header.header
            setHeader(_header)

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
                const footer = document.getElementById('footer');
                if (footer && data.footer) footer.innerHTML = data.footer.content
            }, 1200)

        } else
            setHeader({left1: "", left2: "", left3: "", right1: "", right2: "", right3: ""})
        // eslint-disable-next-line react-hooks/exhaustive-deps

        setLoading(false)

    }, [docHeader])

    useEffect(() => {
        if (httpTypeResponse)
            setTypes((httpTypeResponse as HttpResponse).data);
    }, [httpTypeResponse])

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <PageStyled>

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
                    <Box id={"slide"} padding={2} style={{background: "white", height: "81vh", overflowX: "auto"}}>

                        <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}
                               onClick={() => setPropsModel(!propsModel)}>
                            <Typography fontSize={16} style={{cursor: "default"}}
                                        fontWeight={"bold"}>{t('modelProprities')}</Typography>
                            <IconButton>
                                {propsModel ? <KeyboardArrowUpRoundedIcon/> : <KeyboardArrowDownRoundedIcon/>}
                            </IconButton>
                        </Stack>
                        <Collapse in={propsModel}>
                            <Typography fontSize={14} color={'#999'} mt={1} mb={1}>{t('titleModel')}</Typography>
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

                            <Stack direction={"row"} spacing={1} justifyContent={"center"}>
                                <ButtonGroup color={"info"} variant="outlined" aria-label="outlined button group">
                                    <Button onClick={() => {
                                        data.size = "portraitA4";
                                        data.content.width = "90%"
                                        setOnResize(true)
                                        setData({...data})
                                    }}>
                                        <Typography fontSize={12} fontWeight={"bold"}
                                                    color={data.size === "portraitA4" ? "primary" : theme.palette.grey["400"]}>A4</Typography>
                                    </Button>
                                    <Button onClick={() => {
                                        data.size = "portraitA5";
                                        data.content.width = "90%"
                                        setOnResize(true)
                                        setData({...data})
                                    }}>
                                        <Typography fontSize={12} fontWeight={"bold"}
                                                    color={data.size === "portraitA5" ? "primary" : theme.palette.grey["400"]}>A5</Typography>
                                    </Button>
                                </ButtonGroup>
                                <ButtonGroup color={"info"} variant="outlined" aria-label="outlined button group">
                                    <Button onClick={() => {
                                        data.layout = "";
                                        data.content.width = "90%"
                                        setOnResize(true)
                                        setData({...data})
                                    }}>
                                        <IconUrl path={"Portrait"}
                                                 color={data.layout === undefined || data.layout === "" ? theme.palette.primary.main : theme.palette.grey["400"]}/>
                                    </Button>
                                    <Button onClick={() => {
                                        data.layout = "landscape";
                                        data.content.width = "90%"
                                        setOnResize(true)
                                        setData({...data})
                                    }}>
                                        <IconUrl path={"Landscape"}
                                                 color={data.layout === "landscape" ? theme.palette.primary.main : theme.palette.grey["400"]}/>
                                    </Button>

                                </ButtonGroup>
                            </Stack>

                            <Stack direction="row" alignItems='center' sx={{
                                border: `1px solid ${theme.palette.grey["200"]}`,
                                borderRadius: 1,
                                marginTop: 2,
                                marginBottom: 2,
                                padding: "2px 10px 2px 0",
                                bgcolor: theme => theme.palette.grey['A500'],
                            }}>
                                <Checkbox checked={isDefault} onChange={ev => setIsDefault(ev.target.checked)}/>
                                <Typography>{t("asDefault")}</Typography>
                            </Stack>
                        </Collapse>

                        <div style={{borderBottom: "1px solid #DDD", marginTop: 5, marginBottom: 5}}></div>

                        <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}
                               onClick={() => setElDoc(!elDoc)}>
                            <Typography fontSize={16} style={{cursor: "default"}}
                                        fontWeight={"bold"}>{t('elDoc')}</Typography>
                            <IconButton>
                                {elDoc ? <KeyboardArrowUpRoundedIcon/> : <KeyboardArrowDownRoundedIcon/>}
                            </IconButton>
                        </Stack>

                        <Collapse in={elDoc} style={{paddingTop: 10}}>
                            <Typography mb={2}>{t('bg')}</Typography>

                            <UploadFile
                                files={files}
                                accept={{'image/jpeg': ['.png', '.jpeg', '.jpg']}}
                                onDrop={handleDrop}
                                singleFile={true}/>

                            {data.background.show &&
                                <div className={"btnMenu"} style={{margin: "10px 0 -40px auto"}} onClick={() => {
                                    data.background.show = false;
                                    setData({...data})
                                }}>
                                    <Icon path={"ic-delete"}/>
                                </div>}
                            {data.background.show &&
                                <div style={{width: "fit-content", margin: "20px auto", boxShadow: "0 0 6px #ccc"}}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img style={{width: 120}} src={data.background.content.url} alt={""}/>
                                </div>}

                            <Typography mt={2} mb={2}>{t('section')}</Typography>

                            <Grid
                                container
                                spacing={1}
                                alignItems="center">
                                {data && Object.keys(data).filter(key => !["content", "size", "background"].includes(key)).map(key => (
                                    <Grid key={key} item xs={6}>
                                        <div style={{opacity: data[key].show === true ? 0.5 : 1}}>
                                            <Stack
                                                direction={"row"}
                                                spacing={1}
                                                alignItems={"center"}
                                                onClick={() => {
                                                    data[key].show = true
                                                    setData({...data})
                                                }}
                                                style={{
                                                    backgroundColor: "#F0FAFF",
                                                    height: 40,
                                                    padding: 10,
                                                    borderRadius: 6
                                                }}>
                                                <Typography textAlign={"center"} width={"100%"}>{t(key)}</Typography>
                                                <IconUrl path={"ic-plus"} width={20} height={20}/>

                                            </Stack>
                                        </div>
                                    </Grid>))}
                            </Grid>
                        </Collapse>

                    </Box>
                </Grid>

                <Grid item xs={12} md={9}>
                    {loading && <LinearProgress/>}

                    <Box style={{height: "81vh", overflowX: "auto"}}>
                        <Button onClick={printNow}>PRINT</Button>
                        <Box ref={componentRef}>
                            {!loading &&
                                <Doc {...{data, setData, state: undefined, header, setHeader, onReSize, setOnResize}}/>}
                        </Box>
                    </Box>
                </Grid>

                {/*
                <Grid item xs={12} md={2} padding={2} style={{background:"white"}}>
                    <Stack spacing={1}>
                        <Typography fontSize={16} fontWeight={"bold"}>Pages</Typography>
                        <Box style={{            backgroundColor: theme.palette.background.default,
                            padding: theme.spacing(2),
                            borderRadius: 6,
                        }}>
                            <Box style={{zoom:"20%"}} className={"container"}>
                                <Page   {...{data, setData, state:null, id: 0, title,header,setHeader}}/>
                            </Box>
                            <Typography fontSize={12} textAlign={"center"}>Page1</Typography>
                        </Box>
                        <Box style={{            backgroundColor: theme.palette.background.default,
                            padding: theme.spacing(2),
                            borderRadius: 6,
                        }}>
                            <Box style={{zoom:"20%"}} className={"container"}>
                                <Page   {...{data, setData, state:null, id: 0, title,header,setHeader}}/>
                            </Box>
                            <Typography fontSize={12} textAlign={"center"}>Page2</Typography>
                        </Box>
                    </Stack>

                </Grid>
*/}

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
        </PageStyled>
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
