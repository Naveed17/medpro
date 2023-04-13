import React, {useEffect, useState} from "react";
import {
    Avatar,
    Button,
    DialogActions,
    MenuItem,
    Stack,
    Tab,
    Tabs,
    tabsClasses,
    Typography,
    useMediaQuery,
} from "@mui/material";
import ConsultationIPToolbarStyled from "./overrides/consultationIPToolbarStyle";
import StyledMenu from "./overrides/menuStyle";
import {useTranslation} from "next-i18next";
import {documentButtonList} from "./config";
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import Icon from "@themes/urlIcon";
import IconUrl from "@themes/urlIcon";
import {useRequest, useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {Theme} from "@mui/material/styles";
import {resetAppointment, setAppointmentPatient} from "@features/tabPanel";
import {openDrawer} from "@features/calendar";
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {consultationSelector, SetRecord, SetSelectedDialog, SetTimer} from "@features/toolbar";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import RecondingBoxStyle from '@features/card/components/consultationDetailCard/overrides/recordingBoxStyle';
import moment from "moment-timezone";
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import Zoom from "react-medium-image-zoom";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";

const MicRecorder = require('mic-recorder-to-mp3');
const recorder = new MicRecorder({
    bitRate: 128
});

function ConsultationIPToolbar({...props}) {
    const {
        selectedTab,
        setSelectedTab,
        appuuid,
        mutate,
        agenda,
        mutateDoc,
        setPendingDocuments,
        pendingDocuments,
        dialog,
        patient,
        selectedDialog,
        setDialog,
        setPatientShow,
        changes,
        appointement
    } = props;

    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down("md")
    );
    const {t, ready} = useTranslation("consultation", {
        keyPrefix: "consultationIP",
    });
    const {trigger} = useRequestMutation(null, "/drugs");
    const router = useRouter();
    const {data: session} = useSession();
    //const intervalref = useRef<number | null>(null);

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [info, setInfo] = useState<null | string>("");
    const [state, setState] = useState<any>();
    const [prescription, setPrescription] = useState<PrespectionDrugModel[]>([]);
    const [checkUp, setCheckUp] = useState<AnalysisModel[]>([]);
    const [imagery, setImagery] = useState<AnalysisModel[]>([]);
    const [tabs, setTabs] = useState(0);
    const [lastTabs, setLastTabs] = useState<string | null>("");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [action, setactions] = useState<boolean>(false);
    const [label, setLabel] = useState<string>(appointement.latestAppointments.length === 0 ? "consultation_form" : "patient_history");
    const open = Boolean(anchorEl);
    const hasLatestAppointments = appointement.latestAppointments.length === 0;

    const [tabsData, setTabsData] = useState<any[]>([]);
    const {record, timer} = useAppSelector(consultationSelector);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const ginfo = (session?.data as UserDataResponse).general_information;
    let [time, setTime] = useState(timer);

    useEffect(() => {
        setTime(timer)
    }, [timer])

    const startRecord = () => {
        recorder.start().then(() => {
            //console.log(intervalref.current)
            /*if (intervalref.current !== null) window.clearInterval(intervalref.current);
            else {
                intervalref.current = window.setInterval(() => {
                    time = moment(time, 'mm:ss').add(1, 'second').format('mm:ss')
                    dispatch(SetTimer(time))
                    console.log(intervalref)
                }, 1000);
            }*/
            dispatch(SetRecord(true))
        }).catch((e: any) => {
            console.error(e);
        });
    }

    const stopRec = () => {
        const res = recorder.stop();
        // @ts-ignore
        res?.getMp3().then(([buffer, blob]) => {
            const file = new File(buffer, 'audio', {
                type: blob.type,
                lastModified: Date.now()
            });
            uploadRecord(file)

            /*const player = new Audio(URL.createObjectURL(file));
            player.play();*/

            /*if (intervalref.current) {
                window.clearInterval(intervalref.current);
                intervalref.current = null;
            }*/
            dispatch(SetRecord(false))
            dispatch(SetTimer('00:00'))
            mutateDoc();

        }).catch((e: any) => {
            alert('We could not retrieve your message');
            console.log(e);
        });
    }

    const uploadRecord = (file: File) => {
        trigger({
            method: "GET",
            url: `/api/private/document/types/${router.locale}`,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
        }).then((res) => {
            const audios = (res as any).data.data.filter((type: { name: string; }) => type.name === 'Audio')
            if (audios.length > 0) {
                const form = new FormData();
                form.append(`files[${audios[0].uuid}][]`, file, file.name);
                trigger({
                    method: "POST",
                    url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agenda}/appointments/${appuuid}/documents/${router.locale}`,
                    data: form,
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }).then(() => {
                    mutateDoc();
                });
            }
        });
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSaveDialog = () => {
        const form = new FormData();

        switch (info) {
            case "medical_prescription_cycle":
                form.append("globalNote", "");
                form.append("isOtherProfessional", "false");
                form.append("drugs", JSON.stringify(state));
                let method = "POST"
                let url = `/api/medical-entity/${medical_entity.uuid}/appointments/${appuuid}/prescriptions/${router.locale}`;
                if (selectedDialog && selectedDialog.action === "medical_prescription_cycle") {
                    method = "PUT"
                    url = `/api/medical-entity/${medical_entity.uuid}/appointments/${appuuid}/prescriptions/${selectedDialog.uuid}/${router.locale}`;
                }

                trigger({
                    method: method,
                    url: url,
                    data: form,
                    headers: {
                        ContentType: "application/x-www-form-urlencoded",
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }).then((r: any) => {
                    mutateDoc();
                    mutate();
                    setInfo("document_detail");
                    const res = r.data.data;
                    let type = "";
                    if (!(res[0].patient?.birthdate && moment().diff(moment(res[0].patient?.birthdate, "DD-MM-YYYY"), 'years') < 18))
                        type = res[0].patient?.gender === "F" ? "Mme " : res[0].patient?.gender === "U" ? "" : "Mr "

                    setState({
                        uri: res[1],
                        name: "prescription",
                        type: "prescription",
                        info: res[0].prescription_has_drugs,
                        uuid: res[0].uuid,
                        uuidDoc: res[0].uuid,
                        createdAt: moment().format('DD/MM/YYYY'),
                        description: "",
                        patient: `${type} ${res[0].patient.firstName} ${res[0].patient.lastName}`
                    });
                    setOpenDialog(true);
                    setactions(false);
                    setPrescription([]);

                    let pdoc = [...pendingDocuments];
                    pdoc = pdoc.filter((obj) => obj.id !== 2);
                    setPendingDocuments(pdoc);
                });
                break;
            case "balance_sheet_request":
                form.append("analyses", JSON.stringify(state));
                method = "POST"
                url = `/api/medical-entity/${medical_entity.uuid}/appointments/${appuuid}/requested-analysis/${router.locale}`;
                if (selectedDialog && selectedDialog.action === "balance_sheet_request") {
                    method = "PUT"
                    url = `/api/medical-entity/${medical_entity.uuid}/appointments/${appuuid}/requested-analysis/${selectedDialog.uuid}/edit/${router.locale}`;
                }

                trigger({
                    method:method,
                    url:url,
                    data: form,
                    headers: {
                        ContentType: "application/x-www-form-urlencoded",
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }).then((r: any) => {
                    mutateDoc();
                    mutate();
                    setCheckUp([]);
                    setInfo("document_detail");
                    const res = r.data.data;
                    let type = "";
                    if (!(res[0].patient?.birthdate && moment().diff(moment(res[0].patient?.birthdate, "DD-MM-YYYY"), 'years') < 18))
                        type = res[0].patient?.gender === "F" ? "Mme " : res[0].patient?.gender === "U" ? "" : "Mr "

                    setState({
                        uuid: res[0].uuid,
                        uri: res[1],
                        name: "requested-analysis",
                        type: "requested-analysis",
                        createdAt: moment().format('DD/MM/YYYY'),
                        description: "",
                        info: res[0].analyses,
                        patient: `${type} ${res[0].patient.firstName} ${res[0].patient.lastName}`
                    });
                    setOpenDialog(true);
                    setactions(false);

                    let pdoc = [...pendingDocuments];
                    pdoc = pdoc.filter((obj) => obj.id !== 1);
                    setPendingDocuments(pdoc);
                });
                break;
            case "medical_imagery":
                form.append("medical-imaging", JSON.stringify(state));

                method = "POST"
                url = `/api/medical-entity/${medical_entity.uuid}/appointment/${appuuid}/medical-imaging/${router.locale}`;
                if (selectedDialog && selectedDialog.action === "medical_imagery") {
                    method = "PUT"
                    url = `/api/medical-entity/${medical_entity.uuid}/appointments/${appuuid}/medical-imaging/${selectedDialog.uuid}/edit/${router.locale}`;
                }

                trigger({
                    method,
                    url,
                    data: form,
                    headers: {
                        ContentType: "application/x-www-form-urlencoded",
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }).then((r: any) => {
                    mutateDoc();
                    mutate();
                    setImagery([]);
                    setInfo("document_detail");
                    const res = r.data.data;
                    let type = "";
                    if (!(res[0].patient?.birthdate && moment().diff(moment(res[0].patient?.birthdate, "DD-MM-YYYY"), 'years') < 18))
                        type = res[0].patient?.gender === "F" ? "Mme " : res[0].patient?.gender === "U" ? "" : "Mr "
                    setState({
                        uuid: res[0].uuid,
                        uri: res[1],
                        name: "requested-medical-imaging",
                        type: "requested-medical-imaging",
                        info: res[0]["medical-imaging"],
                        createdAt: moment().format('DD/MM/YYYY'),
                        description: "",
                        patient: `${type} ${res[0].patient.firstName} ${res[0].patient.lastName}`,
                        mutate: mutateDoc
                    });
                    setOpenDialog(true);
                    setactions(false);

                    let pdoc = [...pendingDocuments];
                    pdoc = pdoc.filter((obj) => obj.id !== 1);
                    setPendingDocuments(pdoc);
                });
                break;
            case "add_a_document":
                //form.append("title", state.name);
                //form.append("description", state.description);
                state.files.map((file: { file: string | Blob; name: string | undefined; type: string | Blob; }) => {
                    form.append(`files[${file.type}][]`, file.file, file.name);
                });

                trigger({
                    method: "POST",
                    url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agenda}/appointments/${appuuid}/documents/${router.locale}`,
                    data: form,
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }).then(() => {
                    mutateDoc();
                });
                setOpenDialog(true);
                setactions(true);
                break;
            case "write_certif":
                form.append("content", state.content);
                form.append("title", state.title);

                method = "POST"
                url = `/api/medical-entity/${medical_entity.uuid}/appointments/${appuuid}/certificates/${router.locale}`;
                if (selectedDialog && selectedDialog.action === "write_certif") {
                    method = "PUT"
                    url = `/api/medical-entity/${medical_entity.uuid}/appointments/${appuuid}/certificates/${selectedDialog.state.certifUuid}/${router.locale}`;
                }

                trigger({
                    method: method,
                    url: url,
                    data: form,
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }).then(() => {
                    mutateDoc();
                    setInfo("document_detail");
                    setState({
                        content: state.content,
                        doctor: state.name,
                        patient: state.patient,
                        createdAt: moment().format('DD/MM/YYYY'),
                        description: "",
                        title: state.title,
                        days: state.days,
                        name: "certif",
                        type: "write_certif",
                    });
                    setOpenDialog(true);
                    setactions(false);
                });

                break;
        }

        setLabel("documents");
        setSelectedTab("documents");

        setOpenDialog(false);
        setInfo(null);
        dispatch(SetSelectedDialog(null))
    };

    const handleCloseDialog = () => {
        let pdoc = [...pendingDocuments];
        switch (info) {
            case "medical_prescription_cycle":
                if (state.length > 0) {
                    setPrescription(state)
                    if (pdoc.findIndex((pdc) => pdc.id === 2) === -1)
                        pdoc.push({
                            id: 2,
                            name: "Ordonnance médicale",
                            status: "in_progress",
                            icon: "ic-traitement",
                            state
                        });
                } else {
                    pdoc = pdoc.filter((obj) => obj.id !== 2);
                }
                break;
            case "balance_sheet_request":
                setCheckUp(state);
                if (state.length > 0) {
                    if (pdoc.findIndex((pdc) => pdc.id === 1) === -1)
                        pdoc.push({
                            id: 1,
                            name: "Demande bilan",
                            status: "in_progress",
                            icon: "ic-analyse",
                            state
                        });
                } else {
                    pdoc = pdoc.filter((obj) => obj.id !== 1);
                }
                break;
            case "medical_imagery":
                setImagery(state);
                break;
        }
        setOpenDialog(false);
        setInfo(null);
        setPendingDocuments(pdoc);
        dispatch(SetSelectedDialog(null))

    };

    const handleClose = (action: string) => {
        switch (action) {
            case "draw_up_an_order":
                setInfo("medical_prescription_cycle");
                setState(prescription);
                break;
            case "balance_sheet_request":
                setInfo("balance_sheet_request");
                setState(checkUp);
                break;
            case "medical_imagery":
                setInfo("medical_imagery");
                setState(imagery);
                break;
            case "write_certif":
                setInfo("write_certif");
                setState({
                    name: `${ginfo.firstName} ${ginfo.lastName}`,
                    days: '....',
                    content: '',
                    title: 'Rapport médical',
                    patient: `${appointement.patient.firstName} ${appointement.patient.lastName}`
                });
                break;
            case "upload_document":
                setInfo("add_a_document");
                setState({name: "", description: "", type: "", files: []});
                break;
            case "record":
                startRecord()
                break;
            case "RDV":
                handleOpen()
                break;
            default:
                setInfo(null);
                break;
        }
        setAnchorEl(null);
        setOpenDialog(true);
        setactions(true);
    };

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setSelectedTab(newValue);
    };

    useEffect(() => {
        if (selectedDialog) {
            switch (selectedDialog.action) {
                case "medical_prescription_cycle":
                    setInfo("medical_prescription_cycle");
                    setState(selectedDialog.state);
                    setAnchorEl(null);
                    setOpenDialog(true);
                    setactions(true);
                    break;
                case "balance_sheet_request":
                    setInfo("balance_sheet_request");
                    setState(selectedDialog.state);
                    setAnchorEl(null);
                    setOpenDialog(true);
                    setactions(true);
                    break;
                case "medical_imagery":
                    setInfo("medical_imagery");
                    setState(selectedDialog.state);
                    setAnchorEl(null);
                    setOpenDialog(true);
                    setactions(true);
                    break;
                case "write_certif":
                    setInfo("write_certif");
                    setState({
                        name: `${ginfo.firstName} ${ginfo.lastName}`,
                        days: '',
                        uuid:selectedDialog.state.uuid,
                        content: selectedDialog.state.content,
                        title: selectedDialog.state.title,
                        patient: `${selectedDialog.state.patient}`
                    });
                    setAnchorEl(null);
                    setOpenDialog(true);
                    setactions(true);
                    break;
            }
        }
    }, [selectedDialog])// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        switch (dialog) {
            case "draw_up_an_order":
                setInfo("medical_prescription_cycle");
                setState(prescription);
                break;
            case "balance_sheet_request":
                setInfo("balance_sheet_request");
                setState(checkUp);
                break;
        }
        setDialog("");
        setOpenDialog(true);
        setactions(true);
    }, [checkUp, dialog, prescription, setDialog]);

    useEffect(() => {
        if (lastTabs === "consultation_form") {
            const btn = document.getElementsByClassName("sub-btn")[1];
            const examBtn = document.getElementsByClassName("sub-exam")[0];

            (btn as HTMLElement)?.click();
            (examBtn as HTMLElement)?.click();
        }
        setLastTabs(selectedTab);
    }, [tabs]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        // setSelectedTab(appointement.latestAppointments.length === 0 ? "consultation_form" : "patient_history");
        //console.log(appointement)
        setTabsData(hasLatestAppointments ? [
            {
                label: "consultation_form",
                value: "consultation form"
            },
            {
                label: "documents",
                value: "documents"
            },
            {
                label: "medical_procedures",
                value: "medical procedures"
            }
        ] : [
            {
                label: "patient_history",
                value: "patient history"
            },
            {
                label: "consultation_form",
                value: "consultation form"
            },
            {
                label: "documents",
                value: "documents"
            },
            {
                label: "medical_procedures",
                value: "medical procedures"
            },
        ]);
    }, [tabs, appointement]); // eslint-disable-line react-hooks/exhaustive-deps


    const handleOpen = () => {
        dispatch(resetAppointment());
        dispatch(setAppointmentPatient(appointement?.patient));
        dispatch(openDrawer({type: "add", open: true}));
    };

    const {data: httpPatientPhotoResponse} = useRequest(patient?.hasPhoto ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/patients/${patient?.uuid}/documents/profile-photo/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    } : null, SWRNoValidateConfig);

    const patientPhoto = (httpPatientPhotoResponse as HttpResponse)?.data.photo;

    if (!ready) return <>toolbar loading..</>;

    return (
        <>
            <ConsultationIPToolbarStyled minHeight="inherit" width={1}>
                {isMobile && <Stack direction={"row"} mt={2} justifyContent={"space-between"} alignItems={"center"}>
                    {patient && <Stack onClick={() => setPatientShow()} direction={"row"} alignItems={"center"} mb={1}>
                        <Zoom>
                            <Avatar
                                src={patientPhoto ? patientPhoto : (patient?.gender === "M" ? "/static/icons/men-avatar.svg" : "/static/icons/women-avatar.svg")}
                                sx={{width: 40, height: 40, marginLeft: 2, marginRight: 2, borderRadius: 2}}>
                                <IconUrl width={"40"} height={"40"} path="men-avatar"/>
                            </Avatar>
                        </Zoom>
                        <Stack>
                            <Typography variant="body1" color='primary.main'
                                        sx={{fontFamily: 'Poppins'}}>{patient.firstName} {patient.lastName}</Typography>
                            <Typography variant="body2" color="text.secondary">{patient.fiche_id}</Typography>
                        </Stack>
                    </Stack>}
                    <Stack
                        direction="row"
                        spacing={1}
                        mb={1}
                        justifyContent="flex-end"
                        sx={{width: {xs: "30%", md: "30%"}}}>
                        {record && <Button
                            sx={{minWidth: 35}}
                            size={isMobile ? "small" : "medium"}
                            onClick={() => {
                                stopRec()
                            }}
                            variant="contained"
                            color="primary">
                            {t('stop')}
                        </Button>
                        }
                        <Button
                            sx={{minWidth: 35}}
                            size={isMobile ? "small" : "medium"}
                            onClick={handleClick}
                            variant="contained"
                            endIcon={!record && <KeyboardArrowDownIcon/>}
                            color="warning">
                            {
                                isMobile ? <AddIcon/> :
                                    <>
                                        <AddIcon style={{marginRight: 5, fontSize: 18}}/> {t("add")}
                                    </>
                            }
                        </Button>
                        <StyledMenu
                            id="basic-menu"
                            elevation={0}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                "aria-labelledby": "basic-button",
                            }}>
                            {documentButtonList.map((item, index) => (
                                <MenuItem
                                    key={`document-button-list-${index}`}
                                    onClick={() => handleClose(item.label)}>
                                    <Icon path={item.icon}/>
                                    {t(item.label)}
                                    {changes.find((ch: { index: number; }) => ch.index === index) && changes.find((ch: { index: number; }) => ch.index === index).checked &&
                                        <CheckCircleIcon color={"success"} sx={{width: 15, ml: 1}}/>}
                                </MenuItem>
                            ))}
                        </StyledMenu>
                    </Stack>
                </Stack>}
                <Stack
                    direction="row"
                    minHeight="inherit"
                    alignItems="flex-end"
                    width={1}>
                    <Tabs
                        value={selectedTab}
                        onChange={handleChange}
                        sx={
                            {
                                width: {xs: "100%", md: "70%"},
                                [`& .${tabsClasses.scrollButtons}`]: {
                                    '&.Mui-disabled': {opacity: 0.5},
                                }
                            }
                        }
                        variant={isMobile ? "scrollable" : "standard"}
                        allowScrollButtonsMobile={isMobile}
                        scrollButtons={true}
                        textColor="primary"
                        indicatorColor="primary"
                        aria-label="patient_history">
                        {tabsData.map((tab, index) => (
                            <Tab
                                onFocus={() => {
                                    setTabs(index);
                                    setLabel(tab.label);
                                }}
                                className="custom-tab"
                                key={tab.label}
                                value={tab.label}
                                label={t(tab.label)}
                            />
                        ))}
                    </Tabs>
                    {!isMobile && <Stack
                        direction="row"
                        spacing={1}
                        mb={1}
                        justifyContent="flex-end"
                        sx={{width: {xs: "30%", md: "30%"}}}>
                        {record && <RecondingBoxStyle id={"record"} onClick={() => {
                            stopRec()
                        }} style={{width: 130, padding: 10}}>
                            <StopCircleIcon style={{fontSize: 20, color: "white"}}/>
                            <div className={"recording-text"} id={'timer'} style={{fontSize: 14}}>{t('stop')}</div>
                            <div className="recording-circle"></div>
                        </RecondingBoxStyle>}

                        <Button
                            sx={{minWidth: 35}}
                            size={isMobile ? "small" : "medium"}
                            onClick={handleClick}
                            variant="contained"
                            endIcon={<KeyboardArrowDownIcon/>}
                            color="warning">
                            {
                                isMobile ? <AddIcon/> :
                                    <>
                                        <AddIcon style={{marginRight: 5, fontSize: 18}}/> {t("add")}
                                    </>
                            }
                        </Button>
                        <StyledMenu
                            id="basic-menu"
                            elevation={0}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                "aria-labelledby": "basic-button",
                            }}>
                            {documentButtonList.map((item, index) => (
                                <MenuItem
                                    key={`document-button-list-${index}`}
                                    onClick={() => handleClose(item.label)}>
                                    <Icon path={item.icon}/>
                                    {t(item.label)}
                                    {changes.find((ch: { index: number; }) => ch.index === index) && changes.find((ch: { index: number; }) => ch.index === index).checked &&
                                        <CheckCircleIcon color={"success"} sx={{width: 15, ml: 1}}/>}
                                </MenuItem>
                            ))}
                        </StyledMenu>
                    </Stack>}
                </Stack>
            </ConsultationIPToolbarStyled>

            {info && (
                <Dialog
                    action={info}
                    open={openDialog}
                    data={{state, setState, t, setOpenDialog}}
                    size={info === "add_vaccin" ? "sm" : "lg"}
                    direction={"ltr"}
                    sx={{height: 400}}
                    {...(info === "document_detail" && {
                        sx: {height: 400, p: 0},
                    })}
                    title={t(info === "document_detail" ? "doc_detail_title" : info)}
                    {...(info === "document_detail" && {
                        onClose: handleCloseDialog,
                    })}
                    dialogClose={handleCloseDialog}
                    actionDialog={
                        action ? (
                            <DialogActions>
                                <Button onClick={handleCloseDialog} startIcon={<CloseIcon/>}>
                                    {t("cancel")}
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSaveDialog}
                                    disabled={info === "medical_prescription_cycle" && state.length === 0}
                                    startIcon={<SaveRoundedIcon/>}>
                                    {t("save")}
                                </Button>
                            </DialogActions>
                        ) : null
                    }
                />
            )}
        </>
    );
}

export default ConsultationIPToolbar;
