import React, {useEffect} from "react";
import {
    Avatar,
    Badge,
    Button,
    IconButton,
    MenuItem,
    Stack,
    Tab,
    Tabs,
    tabsClasses,
    Tooltip,
    Typography,
    Zoom,
} from "@mui/material";
import AppToolbarStyled from "./overrides/appToolbarStyle";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import StyledMenu from "./overrides/menuStyle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {documentButtonList} from "@features/toolbar/components/appToolbar/config";
import Icon from "@themes/urlIcon";
import IconUrl from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
import {useProfilePhoto, useSendNotification} from "@lib/hooks/rest";
import {consultationSelector, SetRecord, SetTimer} from "@features/toolbar";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {useRequestQueryMutation} from "@lib/axios";
import {useInvalidateQueries, useMedicalEntitySuffix} from "@lib/hooks";
import {useRouter} from "next/router";
import RecondingBoxStyle from "@features/card/components/consultationDetailCard/overrides/recordingBoxStyle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import {getPrescriptionUI} from "@lib/hooks/setPrescriptionUI";
import {resetAppointment, setAppointmentPatient} from "@features/tabPanel";
import {openDrawer} from "@features/calendar";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";

const MicRecorder = require('mic-recorder-to-mp3');
const recorder = new MicRecorder({
    bitRate: 128
});

function AppToolbar({...props}) {

    const {
        selectedTab,
        setInfo,
        setState,
        setOpenDialog,
        setOpenDialogSave,
        tabsData,
        selectedDialog,
        agenda,
        app_uuid,
        patient,
        handleChangeTab,
        isMobile,
        changes,
        anchorEl,
        loading,
        setAnchorEl,
        setPatientShow,
        dialog, setDialog,
        setFilterDrawer,
        nbDoc,
        prescription, checkUp, imagery,
        showDocument, setShowDocument
    } = props;
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {data: session} = useSession();
    const {patientPhoto} = useProfilePhoto({patientId: patient?.uuid, hasPhoto: patient?.hasPhoto});
    const {trigger: invalidateQueries} = useInvalidateQueries();
    const {trigger: triggerNotificationPush} = useSendNotification();

    const {t} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    const {record} = useAppSelector(consultationSelector);

    const {trigger: triggerDrugsCreate} = useRequestQueryMutation("/drugs/create");
    const {trigger: triggerDrugsGet} = useRequestQueryMutation("/drugs/get");

    const docUrl = `${urlMedicalEntitySuffix}/agendas/${agenda}/appointments/${app_uuid}/documents/${router.locale}`;
    const open = Boolean(anchorEl);

    const {data: user} = session as Session;
    const general_information = (user as UserDataResponse).general_information;
    const {jti} = session?.user as any;

    const mutateDoc = async () => {
        await invalidateQueries([docUrl]);
        refreshDocSession();
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const startRecord = () => {
        recorder.start().then(() => {
            dispatch(SetRecord(true))
        }).catch((e: any) => {
            console.log(e);
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

            dispatch(SetRecord(false))
            dispatch(SetTimer('00:00'))
            mutateDoc();
        }).catch((e: any) => {
            alert('We could not retrieve your message');
            console.log(e);
        });
    }

    const uploadRecord = (file: File) => {
        triggerDrugsGet({
            method: "GET",
            url: `/api/private/document/types/${router.locale}`
        }, {
            onSuccess: (res: any) => {
                const audios = (res as any).data.data.filter((type: { name: string; }) => type.name === 'Audio')
                if (audios.length > 0) {
                    const form = new FormData();
                    form.append(`files[${audios[0].uuid}][]`, file, file.name);
                    triggerDrugsCreate({
                        method: "POST",
                        url: docUrl,
                        data: form
                    }, {
                        onSuccess: () => mutateDoc()
                    });
                }
            }
        });
    }

    const handleOpen = () => {
        dispatch(resetAppointment());
        dispatch(setAppointmentPatient(patient));
        dispatch(openDrawer({type: "add", open: true}));
    }

    const refreshDocSession = () => {
        triggerNotificationPush({
            action: "push",
            root: "all",
            message: " ",
            content: JSON.stringify({
                mutate: docUrl,
                fcm_session: jti
            })
        });
    }

    const handleClose = (action: string) => {
        setOpenDialogSave(true);
        setAnchorEl(null);
        switch (action) {
            case "draw_up_an_order":
                setInfo(getPrescriptionUI());
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
                    name: `${general_information.firstName} ${general_information.lastName}`,
                    days: '....',
                    content: '',
                    title: 'Rapport médical',
                    patient: `${patient.firstName} ${patient.lastName}`,
                    brithdate: `${patient.birthdate}`,
                    cin: patient.idCard ? `${patient.idCard}` : ""
                });
                break;
            case "upload_document":
                setInfo("add_a_document");
                setState({name: "", description: "", type: "", files: []});
                break;
            case "insurance_document_print":
                setInfo("insurance_document_print");
                setState(patient);
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
        setOpenDialog(true);
    };

    useEffect(() => {
        switch (dialog) {
            case "draw_up_an_order":
                setInfo(getPrescriptionUI());
                setState(prescription);
                break;
            case "balance_sheet_request":
                setInfo("balance_sheet_request");
                setState(checkUp);
                break;
        }
        setDialog("");
        setOpenDialog(true);
    }, [checkUp, dialog, prescription, setDialog]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (selectedDialog) {
            setOpenDialogSave(true);
            switch (selectedDialog.action) {
                case "medical_prescription":
                case "medical_prescription_cycle":
                    setInfo(getPrescriptionUI());
                    setState(selectedDialog.state);
                    setAnchorEl(null);
                    setOpenDialog(true);
                    break;
                case "balance_sheet_request":
                    setInfo("balance_sheet_request");
                    setState(selectedDialog.state);
                    setAnchorEl(null);
                    setOpenDialog(true);
                    break;
                case "medical_imagery":
                    setInfo("medical_imagery");
                    setState(selectedDialog.state);
                    setAnchorEl(null);
                    setOpenDialog(true);
                    break;
                case "write_certif":
                    setInfo("write_certif");
                    setState({
                        name: `${general_information.firstName} ${general_information.lastName}`,
                        days: 'x',
                        uuid: selectedDialog.state.uuid,
                        content: selectedDialog.state.content,
                        title: selectedDialog.state.title,
                        patient: `${selectedDialog.state.patient}`,
                        documentHeader: selectedDialog.state.documentHeader,
                    });
                    setAnchorEl(null);
                    setOpenDialog(true);
                    break;
                case "document_detail":
                    setInfo("document_detail");
                    setState(selectedDialog.state);
                    setAnchorEl(null);
                    setOpenDialogSave(false);
                    setOpenDialog(true);
            }
        }
    }, [selectedDialog])// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <AppToolbarStyled minHeight="inherit" width={1}>
                {isMobile && <Stack direction={"row"} mt={2} justifyContent={"space-between"} alignItems={"center"}>
                    {patient && <Stack onClick={() => setPatientShow()} direction={"row"} alignItems={"center"} mb={1}>
                        <Avatar
                            src={
                                patientPhoto
                                    ? patientPhoto.thumbnails.length > 0 ? patientPhoto.thumbnails.thumbnail_128 : patientPhoto.url
                                    : patient?.gender === "M"
                                        ? "/static/icons/men-avatar.svg"
                                        : "/static/icons/women-avatar.svg"
                            }
                            sx={{
                                width: 40,
                                height: 40,
                                marginLeft: 2,
                                marginRight: 2,
                                borderRadius: 2,
                            }}>
                            <IconUrl width={"40"} height={"40"} path="men-avatar"/>
                        </Avatar>
                        <Stack onClick={() => {
                            setFilterDrawer(true)
                        }}>
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
                                    {changes.find((ch: { index: number; }) => ch.index === index) && changes.find((ch: {
                                            index: number;
                                        }) => ch.index === index).checked &&
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
                        onChange={handleChangeTab}
                        sx={{
                            width: {xs: "100%", md: "70%"},
                            [`& .${tabsClasses.scrollButtons}`]: {
                                '&.Mui-disabled': {opacity: 0.5},
                            }
                        }}
                        variant={isMobile ? "scrollable" : "standard"}
                        allowScrollButtonsMobile={isMobile}
                        scrollButtons={true}
                        textColor="primary"
                        disabled={loading}
                        indicatorColor="primary"
                        aria-label="patient_history">
                        {
                            tabsData.map((tab: { label: string; }) => (
                                <Tab
                                    className="custom-tab"
                                    key={tab.label}
                                    value={tab.label}
                                    disabled={loading}
                                    label={t(tab.label)}
                                />
                            ))
                        }
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
                            onClick={(event) => {
                                setAnchorEl(event.currentTarget);
                            }}
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

                        {selectedTab === 'consultation_form' && <Zoom in={selectedTab === 'consultation_form'}
                                                                      style={{transitionDelay: selectedTab === 'consultation_form' ? '500ms' : '0ms'}}>
                            <Tooltip title={t("documents")}>
                                <Badge badgeContent={nbDoc} showZero={true} color="primary">
                                    <IconButton onClick={() => setShowDocument(!showDocument)}
                                                style={{
                                                    borderRadius: "0.625rem",
                                                    border: "1px solid var(--secondaire-gris-claire, #DDD)",
                                                    width: 40
                                                }}>
                                        <IconUrl path={"doc"}/>
                                    </IconButton>
                                </Badge>
                            </Tooltip>
                        </Zoom>}

                        <StyledMenu
                            {...{open, anchorEl}}
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
                            slotProps={{
                                paper: {
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: (theme) => `drop-shadow(${theme.customShadows.popover})`,
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        '&:before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: 'text.primary',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                }
                            }}
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
                                    {changes.find((ch: {
                                            index: number;
                                        }) => ch.index === index) && changes.find((ch: {
                                            index: number;
                                        }) => ch.index === index).checked &&
                                        <CheckCircleIcon color={"success"} sx={{width: 15, ml: 1}}/>}
                                </MenuItem>
                            ))}
                        </StyledMenu>
                    </Stack>}
                </Stack>
            </AppToolbarStyled>
        </>
    );
}

export default AppToolbar;
