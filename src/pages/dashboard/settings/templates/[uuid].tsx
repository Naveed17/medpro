import {GetStaticPaths, GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useRef, useState} from "react";
import {configSelector, DashLayout} from "@features/base";
import {useTranslation} from "next-i18next";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {pdfjs} from "react-pdf";
import {useFormik} from "formik";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Collapse,
    DialogActions,
    FormControl,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Skeleton,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {useRequest, useRequestMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {useSnackbar} from "notistack";
import {LoadingScreen} from "@features/loadingScreen";
import {useReactToPrint} from "react-to-print";
import LocalPrintshopRoundedIcon from '@mui/icons-material/LocalPrintshopRounded';
import {UploadFile} from "@features/uploadFile";
import {FileuploadProgress} from "@features/progressUI";
import {SWRNoValidateConfig, TriggerWithoutValidation} from "@lib/swr/swrProvider";
import Zoom from "@mui/material/Zoom";
import PreviewA4 from "@features/files/components/previewA4";
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import {Editor} from '@tinymce/tinymce-react';
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

function DocsConfig() {

    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    const router = useRouter();
    const theme = useTheme();
    const {data: session} = useSession();
    const urlMedicalProfessionalSuffix = useMedicalProfessionalSuffix();
    const isMobile = useMediaQuery("(max-width:669px)");
    const {enqueueSnackbar} = useSnackbar();

    const {t, ready} = useTranslation(["settings", "common"], {keyPrefix: "documents.config"});
    const {direction} = useAppSelector(configSelector);

    const componentRef = useRef<HTMLDivElement>(null);

    const [files, setFiles] = useState<any[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [types, setTypes] = useState([]);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [isDefault, setIsDefault] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<any>();
    const [docHeader, setDocHeader] = useState<DocTemplateModel | null>(null);
    const [data, setData] = useState<any>({
        background: {show: false, content: ''},
        header: {show: true, x: 0, y: 0},
        footer: {show: false, x: 0, y: 234, content: ''},
        title: {show: true, content: 'ORDONNANCE MEDICALE', x: 0, y: 8},
        date: {show: true, prefix: 'Le ', content: '[ 00 / 00 / 0000 ]', x: 0, y: 155, textAlign: "right"},
        patient: {show: true, prefix: 'Nom & prénom: ', content: 'MOHAMED ALI', x: 40, y: 55},
        size: 'portraitA4',
        content: {
            show: true,
            maxHeight: 600,
            maxWidth: 130,
            content: '[ Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium ]',
            x: 0,
            y: 150
        }
    })
    const [queryState, setQueryState] = useState<any>({type: []});
    const uuid = router.query.uuid;

    const {data: user} = session as Session;
    const medical_professional = (user as UserDataResponse).medical_professional as MedicalProfessionalModel;
    const selectedAll = queryState.type.length === types?.length;

    const {trigger} = useRequestMutation(null, "/MP/header");

    const {data: httpDocumentHeader, mutate} = useRequest({
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/header/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const {data: httpTypeResponse} = useRequest({
        method: "GET",
        url: `/api/private/document/types/${router.locale}?is_active=0`,
        headers: {
            ContentType: "multipart/form-data",
            Authorization: `Bearer ${session?.accessToken}`,
        },
    });

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
                data.background.content = (ev.target?.result as string)
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
        trigger({
            method: uuid === 'new' ? "POST" : "PUT",
            url,
            data: form,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        }, TriggerWithoutValidation).then(() => {
            mutate().then(() => {
                router.back();
            });
        })
        enqueueSnackbar(t("updated"), {variant: 'success'})
    }

    const openDialog = () => {
        setOpen(true);
        setSelected({
            title: t('askRemove'),
            subtitle: t('subtitleRemove'),
            icon: "/static/icons/setting/ic-edit-file.svg",
            name1: title,
            name2: "",
            // data: props,
            request: {
                method: "DELETE",
                url: `${urlMedicalProfessionalSuffix}/header/${uuid}/${router.locale}`,
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`
                }
            }
        })
    }

    const remove = () => {
        trigger(selected.request, {revalidate: true, populateCache: true}).then(() => {
            mutate().then(() => {
                router.back();
                enqueueSnackbar(t("removed"), {variant: 'error'})
            });
        });
    }

    const handleSelectAll = (insurances: any): void => {
        setQueryState(insurances);
        handleInsuranceChange(insurances.type);
    }


    useEffect(() => {
        if (uuid === 'new') {
            setTimeout(() => {
                setLoading(false)
            }, 1000);
        } else if (httpDocumentHeader)
            setDocHeader((httpDocumentHeader as HttpResponse).data.find((res: { uuid: string }) => res.uuid === uuid))
    }, [httpDocumentHeader, uuid])

    useEffect(() => {
        if (docHeader) {
            setTitle((docHeader as DocTemplateModel).title);
            setIsDefault((docHeader as DocTemplateModel).isDefault);
            setQueryState({
                type: ((docHeader as DocTemplateModel).types)
            });
            const header = (docHeader as DocTemplateModel).header.header
            if (header) {
                setFieldValue("left1", header.left1)
                setFieldValue("left2", header.left2)
                setFieldValue("left3", header.left3)
                setFieldValue("right1", header.right1)
                setFieldValue("right2", header.right2)
                setFieldValue("right3", header.right3)
            }

            const data = (docHeader as DocTemplateModel).header.data
            if (data) {
                if (data.footer === undefined)
                    setData({
                        ...data,
                        footer: {show: true, x: 0, y: 140, content: ''},
                        background: {show: docHeader.file !== null, content: docHeader.file ? docHeader.file : ''}
                    })
                else
                    setData({
                        ...data,
                        background: {show: docHeader.file !== null, content: docHeader.file ? docHeader.file : ''}
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

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{`${t("path")} > ${uuid === 'new' ? 'Créer document' : 'Modifier document'}`}</p>
                </RootStyled>

                {uuid !== 'new' && <Button
                    type="submit"
                    variant="contained"
                    color={"error"}
                    style={{marginRight: 10}}
                    onClick={openDialog}>
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
                <Grid item xs={12} md={5}>
                    <Box padding={2} style={{background: "white"}}
                         borderRight={'1px solid #c7c6c7'}
                         height={'100%'}>
                        <Stack direction={"row"}
                               alignItems={"center"}
                               paddingBottom={1}
                               borderBottom={'1px solid rgba(0,0,0,.1)'}
                               justifyContent={"space-between"}>
                            <Typography fontSize={16}>
                                {t('proprety')}
                            </Typography>
                            <Stack direction={"row"}>
                                <Tooltip title={t("preview")} TransitionComponent={Zoom}>
                                    <IconButton onClick={printNow} sx={{
                                        border: "1px solid",
                                        mr: 1,
                                        borderRadius: 2,
                                        color: theme.palette.grey[400]
                                    }}>
                                        <LocalPrintshopRoundedIcon
                                            style={{color: theme.palette.grey[400], fontSize: 16}}/>
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Stack>

                        <List
                            sx={{width: '100%', bgcolor: 'background.paper'}}
                            component="nav"
                            aria-labelledby="nested-list-subheader">

                            <Typography fontSize={12} color={'#999'} mb={1}>{t('titleModel')}{" "}
                                <Typography component="span" color="error">
                                    *
                                </Typography>
                            </Typography>
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

                            <Typography fontSize={12} color={'#999'} mb={1}>{t('selectTypes')}{" "}
                                <Typography component="span" color="error">
                                    *
                                </Typography>
                            </Typography>

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


                            <ListItem style={{padding: 0, marginTop: 10, marginBottom: 5}}>
                                <Checkbox
                                    checked={isDefault}
                                    onChange={(ev) => {
                                        setIsDefault(ev.target.checked)
                                    }}
                                />
                                <ListItemText primary={t("asDefault")}/>
                            </ListItem>

                            <div style={{
                                width: '100%',
                                borderTop: '1px solid rgba(0,0,0,.1)',
                                marginBottom: 20,
                                marginTop: 10
                            }}></div>
                            {/*Content*/}
                            <fieldset style={{marginBottom: 10}}>
                                <legend>{t('configContent')}</legend>
                                <Typography fontSize={12} color={'#999'} mb={1}>{t('maxHeight')}</Typography>
                                <TextField
                                    variant="outlined"
                                    placeholder={"400"}
                                    required
                                    type={"number"}
                                    value={data.content.maxHeight}
                                    onChange={(ev) => {
                                        data.content.maxHeight = ev.target.value
                                        setData({...data})
                                    }}
                                    fullWidth/>
                                <Typography fontSize={12} color={'#999'} textAlign={"right"} mt={1}>x
                                    : {data.content.x} , y : {data.content.y}</Typography>
                            </fieldset>

                            {/*we will add it late*/}
                            <fieldset style={{marginBottom: 10}}>
                                <legend>{t('paperSize')}</legend>
                                <ListItem style={{padding: 0, marginBottom: 5}}>
                                    <Checkbox
                                        checked={data.size === 'portraitA5'}
                                        onChange={(ev) => {
                                            data.size = 'portraitA5';
                                            setData({...data})
                                        }}
                                    />
                                    <ListItemText primary={t("A5")}/>
                                </ListItem>
                                <ListItem style={{padding: 0, marginBottom: 5}}>
                                    <Checkbox
                                        checked={data.size === 'portraitA4'}
                                        onChange={(ev) => {
                                            data.size = 'portraitA4';
                                            setData({...data})
                                        }}
                                    />
                                    <ListItemText primary={t("A4")}/>
                                </ListItem>
                            </fieldset>
                            {/*Import document*/}
                            <ListItem style={{padding: 0, marginBottom: 5}}>
                                <Checkbox
                                    checked={data.background.show}
                                    onChange={(ev) => {
                                        data.background.show = ev.target.checked;
                                        setData({...data})
                                    }}
                                />
                                <ListItemText primary={t("background")}/>
                            </ListItem>
                            <Collapse in={data.background.show} timeout="auto" unmountOnExit>
                                {files.length === 0 &&
                                    <UploadFile
                                        files={files}
                                        accept={{'image/jpeg': ['.png', '.jpeg', '.jpg']}}
                                        onDrop={handleDrop}
                                        singleFile={true}/>}

                                <Stack spacing={2} maxWidth={{xs: "100%", md: "100%"}}>
                                    {files?.map((file: any, index: number) => (
                                        <FileuploadProgress
                                            key={index}
                                            file={file}
                                            progress={100}
                                            handleRemove={handleRemove}
                                        />
                                    ))}
                                </Stack>
                            </Collapse>

                            {/*Header config*/}
                            <ListItem style={{padding: 0, marginTop: 10, marginBottom: 5}}>
                                <Checkbox
                                    checked={data.header.show}
                                    onChange={(ev) => {
                                        data.header.show = ev.target.checked;
                                        setData({...data})
                                    }}
                                />
                                <ListItemText primary={t("header")}/>
                            </ListItem>
                            <Collapse in={data.header.show} timeout="auto" unmountOnExit>
                                <Card>
                                    <CardContent>
                                        <Stack spacing={2}>
                                            <Stack direction={"row"} justifyContent={"space-between"} spacing={1}>
                                                <Typography color={'#999'}
                                                            fontSize={12}>{t('leftSide')}</Typography>
                                                <Typography color={'#999'}
                                                            fontSize={12}>{t('rightSide')}</Typography>
                                            </Stack>

                                            <Stack direction={"row"} justifyContent={"space-between"} spacing={1}>
                                                <TextField
                                                    variant="outlined"
                                                    placeholder={t("case1")}
                                                    required
                                                    {...getFieldProps("left1")}
                                                    fullWidth/>

                                                <TextField
                                                    variant="outlined"
                                                    placeholder={t("case1")}
                                                    required
                                                    inputProps={{
                                                        style: {
                                                            textAlign: "right"
                                                        },
                                                    }}
                                                    {...getFieldProps("right1")}
                                                    fullWidth/>
                                            </Stack>
                                            <Stack direction={"row"} justifyContent={"space-between"} spacing={1}>
                                                <TextField
                                                    variant="outlined"
                                                    placeholder={t("case2")}
                                                    required
                                                    {...getFieldProps("left2")}
                                                    fullWidth/>
                                                <TextField
                                                    variant="outlined"
                                                    placeholder={t("case2")}
                                                    inputProps={{
                                                        style: {
                                                            textAlign: "right"
                                                        },
                                                    }}
                                                    {...getFieldProps("right2")}
                                                    required
                                                    fullWidth/>
                                            </Stack>
                                            <Stack direction={"row"} justifyContent={"space-between"} spacing={1}>
                                                <TextField
                                                    variant="outlined"
                                                    placeholder={t("case3")}
                                                    required
                                                    multiline
                                                    rows={4}
                                                    {...getFieldProps("left3")}

                                                    fullWidth/>
                                                <TextField
                                                    variant="outlined"
                                                    placeholder={t("case3")}
                                                    required
                                                    multiline
                                                    rows={4}
                                                    inputProps={{
                                                        style: {
                                                            textAlign: "right"
                                                        },
                                                    }}
                                                    {...getFieldProps("right3")}
                                                    fullWidth/>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Collapse>

                            {/*Footer config*/}
                            {data.footer && <Box>
                                <ListItem style={{padding: 0, marginTop: 10, marginBottom: 5}}>
                                    <Checkbox
                                        checked={data.footer?.show}
                                        onChange={(ev) => {
                                            data.footer.show = ev.target.checked;
                                            setData({...data})
                                        }}
                                    />
                                    <ListItemText primary={t("footer")}/>
                                </ListItem>

                                {!loading && <Collapse in={data.footer.show} timeout="auto" unmountOnExit>
                                    <Editor
                                        value={data.footer.content}
                                        apiKey='5z2ufor849kkaz900ye60ztlyfbx8jr7d6uubg6hbgjs5b2j'
                                        onEditorChange={(res) => {
                                            data.footer.content = res;
                                            setData({...data});
                                        }}
                                        init={{
                                            branding: false,
                                            statusbar: false,
                                            menubar: false,
                                            plugins: [
                                                'advlist autolink lists link image charmap print preview anchor',
                                                'searchreplace visualblocks code fullscreen textcolor',
                                                'insertdatetime media table paste code help wordcount'
                                            ],
                                            toolbar: 'undo redo | formatselect | ' +
                                                'bold italic backcolor forecolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'removeformat | help',
                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'

                                        }}
                                    />
                                </Collapse>}
                            </Box>}


                            {/*Title document*/}
                            <ListItem style={{padding: 0, marginTop: 10, marginBottom: 5}}>
                                <Checkbox
                                    checked={data.title.show}
                                    onChange={(ev) => {
                                        data.title.show = ev.target.checked;
                                        setData({...data})
                                    }}
                                />
                                <ListItemText primary={t("title")}/>
                            </ListItem>
                            {/*
                                <Collapse in={data.title.show} timeout="auto" unmountOnExit>
                                    <fieldset>
                                        <legend>{t('configTitle')}</legend>
                                        <Typography fontSize={12} color={'#999'} mb={1}>{t('nom')}</Typography>
                                        <TextField
                                            variant="outlined"
                                            placeholder={t("nameDoc")}
                                            required

                                            value={data.title.content}
                                            onChange={(ev) => {
                                                data.title.content = ev.target.value
                                                setData({...data})
                                            }}
                                            fullWidth/>
                                        <Typography fontSize={12} color={'#999'} textAlign={"right"} mt={1}>x
                                            : {data.title.x} , y : {data.title.y}</Typography>
                                    </fieldset>
                                </Collapse>
*/}

                            {/*Date*/}

                            <ListItem style={{padding: 0, marginTop: 10, marginBottom: 5}}>
                                <Checkbox
                                    checked={data.date.show}
                                    onChange={(ev) => {
                                        data.date.show = ev.target.checked;
                                        setData({...data})
                                    }}
                                />
                                <ListItemText primary={t("date")}/>
                            </ListItem>
                            <Collapse in={data.date.show} timeout="auto" unmountOnExit>
                                <fieldset>
                                    <legend>{t('configDate')}</legend>

                                    <Stack padding={1}>
                                        <ToggleButtonGroup
                                            value={data.date.textAlign}
                                            exclusive
                                            onChange={handleAlignment}
                                            aria-label="text alignment">
                                            <ToggleButton value="left" aria-label="left aligned">
                                                <FormatAlignLeftIcon/>
                                            </ToggleButton>
                                            <ToggleButton value="center" aria-label="centered">
                                                <FormatAlignCenterIcon/>
                                            </ToggleButton>
                                            <ToggleButton value="right" aria-label="right aligned">
                                                <FormatAlignRightIcon/>
                                            </ToggleButton>
                                            <ToggleButton value="justify" aria-label="justified" disabled>
                                                <FormatAlignJustifyIcon/>
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                    </Stack>

                                    <Typography fontSize={12} color={'#999'} mb={1}>{t('prefix')}</Typography>
                                    <TextField
                                        variant="outlined"
                                        placeholder={t("le")}
                                        required
                                        value={data.date.prefix}
                                        onChange={(ev) => {
                                            data.date.prefix = ev.target.value
                                            setData({...data})
                                        }}
                                        fullWidth/>
                                    <Typography fontSize={12} color={'#999'} textAlign={"right"} mt={1}>x
                                        : {data.date.x} , y : {data.date.y}</Typography>
                                </fieldset>
                            </Collapse>

                            {/*Patient name*/}
                            <ListItem style={{padding: 0, marginTop: 10, marginBottom: 5}}>
                                <Checkbox
                                    checked={data.patient.show}
                                    onChange={(ev) => {
                                        data.patient.show = ev.target.checked;
                                        setData({...data})
                                    }}
                                />
                                <ListItemText primary={t("patient")}/>
                            </ListItem>
                            <Collapse in={data.patient.show} timeout="auto" unmountOnExit>
                                <fieldset>
                                    <legend>{t('configPatient')}</legend>
                                    <Typography fontSize={12} color={'#999'} mb={1}>{t('prefix')}</Typography>
                                    <TextField
                                        variant="outlined"
                                        placeholder={t("firstName")}
                                        required
                                        value={data.patient.prefix}
                                        onChange={(ev) => {
                                            data.patient.prefix = ev.target.value
                                            setData({...data})
                                        }}
                                        fullWidth/>
                                    <Typography fontSize={12} color={'#999'} textAlign={"right"} mt={1}>x
                                        : {data.patient.x} , y : {data.patient.y}</Typography>
                                </fieldset>
                            </Collapse>
                        </List>
                    </Box>
                </Grid>

                <Grid item xs={12} md={7}>
                    {<Box padding={2}>
                        <Box style={{margin: 'auto', paddingTop: 20}}>
                            <Box ref={componentRef}>
                                <PreviewA4  {...{eventHandler, data, values, loading}} />
                                {loading &&
                                    <div className={data.size ? data.size : "portraitA5"} style={{padding: 20}}>
                                        {Array.from(Array(30)).map((item, key) => (
                                            <Skeleton key={key}></Skeleton>))}
                                    </div>}
                            </Box>
                        </Box>

                    </Box>}
                </Grid>
            </Grid>


            <Dialog action={"remove"}
                    open={open}
                    data={selected}
                    direction={direction}
                    color={(theme: Theme) => theme.palette.error.main}
                    title={t('remove')}
                    t={t}
                    actionDialog={
                        <DialogActions>
                            <Button onClick={() => {
                                setOpen(false);
                            }}
                                    startIcon={<CloseIcon/>}>{t('cancel')}</Button>
                            <LoadingButton variant="contained"
                                           loading={loading}
                                           sx={{backgroundColor: (theme: Theme) => theme.palette.error.main}}
                                           onClick={remove}>{t('remove')}</LoadingButton>
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
