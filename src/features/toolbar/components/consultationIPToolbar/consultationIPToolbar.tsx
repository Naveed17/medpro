import React, {useEffect, useState} from 'react'
import {Button, DialogActions, MenuItem, Stack, Tab, Tabs, useMediaQuery} from '@mui/material'
import ConsultationIPToolbarStyled from './overrides/consultationIPToolbarStyle'
import StyledMenu from './overrides/menuStyle'
import {useTranslation} from 'next-i18next'
import {documentButtonList} from './config'
import {Dialog} from '@features/dialog';
import CloseIcon from "@mui/icons-material/Close";
import Icon from '@themes/urlIcon'
import {useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRouter} from "next/router";
import {LoadingButton} from "@mui/lab";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {consultationSelector} from "@features/toolbar";
import {setTimer} from "@features/card";
import {Theme} from '@mui/material/styles'

function ConsultationIPToolbar({...props}) {
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [value, setValue] = useState('patient history');
    const [info, setInfo] = useState<null | string>('');
    const [state, setState] = useState<any>();
    const [prescription, setPrescription] = useState<PrespectionDrugModel[]>([]);
    const [checkUp, setCheckUp] = useState<AnalysisModel[]>([]);
    const [imagery, setImagery] = useState<AnalysisModel[]>([]);
    const [tabs, setTabs] = useState(0);
    const [label, setlabel] = useState<string>('patient_history')
    const [lastTabs, setLastTabs] = useState<string>('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [action, setactions] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [end, setEnd] = useState(false);
    const {exam} = useAppSelector(consultationSelector);
    const open = Boolean(anchorEl);
    const dispatch = useAppDispatch();


    const {
        selected,
        appuuid,
        mutate,
        agenda,
        mutateDoc,
        setPendingDocuments,
        pendingDocuments,
        dialog,
        setDialog,
        appointement,
        selectedAct,
        selectedModel
    } = props;
    const tabsData = [
        {
            label: "patient_history",
            value: 'patient history',

        },
        {
            label: "mediktor_report",
            value: 'mediktor report',
        },
        {
            label: "consultation_form",
            value: 'consultation form',
        },
        {
            label: "medical_procedures",
            value: 'medical procedures',
        },
        {
            label: "documents",
            value: 'documents',
        }
    ];
    const {trigger} = useRequestMutation(null, "/drugs");
    const router = useRouter();
    const {data: session} = useSession();
    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const ginfo = (session?.data as UserDataResponse).general_information

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSaveDialog = () => {
        const form = new FormData();
        console.log(info)
        switch (info) {
            case 'medical_prescription':
                form.append('globalNote', "");
                form.append('isOtherProfessional', "false");
                form.append('drugs', JSON.stringify(state));

                trigger({
                    method: "POST",
                    url: "/api/medical-entity/" + medical_entity.uuid + '/appointments/' + appuuid + '/prescriptions/' + router.locale,
                    data: form,
                    headers: {
                        ContentType: 'application/x-www-form-urlencoded',
                        Authorization: `Bearer ${session?.accessToken}`
                    }
                }).then((r: any) => {
                    mutateDoc();
                    mutate();
                    setInfo('document_detail')
                    const res = r.data.data

                    setState({
                        uri: res[1],
                        name: 'prescription',
                        type: 'prescription',
                        info: res[0].prescription_has_drugs,
                        uuid: res[0].uuid,
                        patient: res[0].patient.firstName + ' ' + res[0].patient.lastName
                    })
                    setOpenDialog(true)
                    setactions(true)
                    setPrescription([])

                    let pdoc = [...pendingDocuments]
                    pdoc = pdoc.filter(obj => obj.id !== 2);
                    setPendingDocuments(pdoc)
                })
                break;
            case 'balance_sheet_request':
                form.append('analyses', JSON.stringify(state));

                trigger({
                    method: "POST",
                    url: "/api/medical-entity/" + medical_entity.uuid + '/appointments/' + appuuid + '/requested-analysis/' + router.locale,
                    data: form,
                    headers: {
                        ContentType: 'application/x-www-form-urlencoded',
                        Authorization: `Bearer ${session?.accessToken}`
                    }
                }).then((r: any) => {
                    mutateDoc();
                    mutate();
                    setCheckUp([])
                    setInfo('document_detail')
                    const res = r.data.data;
                    console.log(res)
                    setState({
                        uuid: res[0].uuid,
                        uri: res[1],
                        name: 'requested-analysis',
                        type: 'requested-analysis',
                        info: res[0].analyses,
                        patient: res[0].patient.firstName + ' ' + res[0].patient.lastName
                    })
                    setOpenDialog(true);
                    setactions(true)

                    let pdoc = [...pendingDocuments]
                    pdoc = pdoc.filter(obj => obj.id !== 1);
                    setPendingDocuments(pdoc)
                })
                break;
            case 'medical_imagery':
                console.log(state)
                break
            case 'add_a_document':
                form.append('title', state.name);
                form.append('description', state.description);
                form.append('type', state.type);
                state.files.map((file: File) => {
                    form.append('files[]', file, file.name)
                })

                trigger({
                    method: "POST",
                    url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agenda}/appointments/${appuuid}/documents/${router.locale}`,
                    data: form,
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`
                    }
                }).then(() => {
                    mutateDoc()
                });
                setOpenDialog(true);
                setactions(true)
                break;
            case 'write_certif':
                console.log('write_certif', state)
                form.append("content", state.content)
                trigger({
                    method: "POST",
                    url: `/api/medical-entity/${medical_entity.uuid}/appointments/${appuuid}/certificates/${router.locale}`,
                    data: form,
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`
                    }
                }).then(() => {
                    mutateDoc()
                    setInfo('document_detail')
                    setState({
                        content: state.content,
                        doctor: state.name,
                        patient: state.patient,
                        days: state.days,
                        name: 'certif',
                        type: 'write_certif'
                    })
                    setOpenDialog(true);
                    setactions(true)
                });


                break;
        }

        setOpenDialog(false);
        setInfo(null)
    }

    const handleCloseDialog = () => {
        let pdoc = [...pendingDocuments]
        switch (info) {
            case 'medical_prescription':
                if (state.length > 0) {
                    if (pdoc.findIndex(pdc => pdc.id === 2) === -1)
                        pdoc.push({
                            id: 2,
                            name: "Ordonnance médicale",
                            status: "in_progress",
                            icon: 'ic-traitement'
                        })
                } else {
                    pdoc = pdoc.filter(obj => obj.id !== 2);
                }
                break
            case 'balance_sheet_request':
                setCheckUp(state)
                if (state.length > 0) {
                    if (pdoc.findIndex(pdc => pdc.id === 1) === -1)
                        pdoc.push({
                            id: 1,
                            name: "Demande bilan",
                            status: "in_progress",
                            icon: 'ic-analyse'
                        })
                } else {
                    pdoc = pdoc.filter(obj => obj.id !== 1);
                }
                break
            case 'medical_imagery':
                setImagery(state)
                /*if (state.length > 0) {
                    if (pdoc.findIndex(pdc => pdc.id === 1) === -1)
                        pdoc.push({
                            id: 1,
                            name: "Demande bilan",
                            status: "in_progress",
                            icon: 'ic-analyse'
                        })
                } else {
                    pdoc = pdoc.filter(obj => obj.id !== 1);
                }*/
                break
        }
        setOpenDialog(false);
        setInfo(null)
        setPendingDocuments(pdoc)
    }

    const handleClose = (action: string) => {
        switch (action) {
            case "draw_up_an_order":
                setInfo('medical_prescription')
                setState(prescription)
                break;
            case "balance_sheet_request":
                setInfo('balance_sheet_request')
                setState(checkUp)
                break;
            case "medical_imagery":
                setInfo('medical_imagery')
                setState(imagery)
                break;
            case "write_certif":
                console.log(appointement)
                setInfo('write_certif')
                setState({
                    name: ginfo.firstName + ' ' + ginfo.lastName,
                    days: 19,
                    content: '',
                    patient: appointement.patient.firstName + ' ' + appointement.patient.lastName
                })
                break;
            case "upload_document":
                setInfo('add_a_document')
                setState({name: '', description: '', type: '', files: []})
                break;
            default:
                setInfo(null)
                break;

        }
        setAnchorEl(null);
        setOpenDialog(true);
        setactions(true)

    };

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    useEffect(() => {
        switch (dialog) {
            case "draw_up_an_order":
                setInfo('medical_prescription')
                break;
            case "balance_sheet_request":
                setInfo('balance_sheet_request')
                setState(checkUp)
                break;
            /*case "medical_imagery":
                setInfo('medical_imagery')
                setState(imagery)
                break;*/
        }
        setDialog('')
        setOpenDialog(true);
        setactions(true)

    }, [checkUp, dialog, prescription, setDialog])

    useEffect(() => {
        const acts: { act_uuid: string, price: string }[] = []
        if (end) {
            selectedAct.map((act: { uuid: string, fees: string }) => {
                acts.push({act_uuid: act.uuid, price: act.fees})
            })
            const form = new FormData();
            form.append("acts", JSON.stringify(acts))
            form.append("modal_uuid", selectedModel.default_modal.uuid)
            form.append("modal_data", (localStorage.getItem('Modeldata') as string))
            form.append("notes", exam.notes)
            form.append("diagnostic", exam.diagnosis)
            form.append("treatment", exam.treatment)
            form.append("consultation_reason", exam.motif)
            form.append("status", "5")

            trigger({
                method: "PUT",
                url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agenda}/appointments/${appuuid}/data/${router.locale}`,
                data: form,
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`
                }
            }).then(r => {
                console.log('end consultation', r)
                router.push('/dashboard/agenda').then(r => {
                    console.log(r)
                    dispatch(setTimer({isActive: false}))
                    localStorage.removeItem('Modeldata');
                    console.log(localStorage.getItem('Modeldata'))
                    mutate();
                })
            });
        }
        setEnd(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [end])

    useEffect(() => {

        if (appointement && appointement.latestAppointments.length === 0) {
            setValue('consultation form');
            setlabel('consultation_form');
            setLastTabs('consultation_form')
            setTabs(2)
        }
    }, [appointement]);
    useEffect(() => {
        selected(label);
        if (lastTabs === 'consultation_form') {
            const btn = document.getElementsByClassName('sub-btn')[1];
            const examBtn = document.getElementsByClassName('sub-exam')[0];

            (btn as HTMLElement)?.click();
            (examBtn as HTMLElement)?.click();
        }
        setLastTabs(label)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabs]);

    if (!ready) return <>toolbar loading..</>;

    return (
        <>
            <ConsultationIPToolbarStyled minHeight="inherit" width={1}>
                <Stack direction="row" spacing={1} mt={1.2} justifyContent="flex-end">
                    {/*<Button disabled variant="contained"
                            onClick={
                                () => {
                                    setInfo("document_detail");
                                    setOpenDialog(true);
                                    setState('/static/files/sample.pdf')
                                    setactions(false)
                                }
                            }
                    >
                        {t("RDV")}
                    </Button>
                    <Button variant="contained">
                        {t("vaccine")}
                    </Button>
                    <Button disabled={true} variant="contained">
                        {t("report")}
                    </Button>*/}
                    <Button onClick={handleClick} variant="contained" color="warning">
                        {t('document')}
                    </Button>
                    <StyledMenu
                        id="basic-menu"
                        elevation={0}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        {documentButtonList.map((item, index) => (
                            <MenuItem key={`document-button-list-${index}`} onClick={() => handleClose(item.label)}>
                                <Icon path={item.icon}/>
                                {t(item.label)}
                            </MenuItem>
                        ))}
                    </StyledMenu>
                </Stack>
                <Stack direction='row' minHeight="inherit" alignItems="flex-end" width={1}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        sx={{width: {xs: '70%', md: '70%'}}}
                        variant={isMobile ? "scrollable" : 'standard'}
                        allowScrollButtonsMobile={isMobile}
                        textColor="primary"
                        indicatorColor="primary"
                        aria-label="patient_history">
                        {tabsData.map(({label, value}, index) => (
                            <Tab onFocus={() => {
                                setTabs(index);
                                setlabel(label)
                            }} className='custom-tab' key={label} value={value}
                                 label={t(label)}/>
                        ))}
                    </Tabs>
                    <LoadingButton loading={loading} variant="outlined" color="primary" onClick={() => {
                        const btn = document.getElementsByClassName('sub-btn')[1];
                        const examBtn = document.getElementsByClassName('sub-exam')[0];


                        (btn as HTMLElement)?.click();
                        (examBtn as HTMLElement)?.click();

                        setLoading(true)


                        setTimeout(() => {
                            setEnd(true)
                            setLoading(false)
                        }, 3000)


                    }} className="action-button">
                        {!loading && appointement?.status == 5 ? <Icon path="ic-edit"/> : <Icon path="ic-check"/>}
                        {appointement?.status == 5 ? t("edit_of_consultation") : t("end_of_consultation")}
                    </LoadingButton>
                </Stack>
            </ConsultationIPToolbarStyled>
            {
                info &&
                <Dialog action={info}
                        open={openDialog}
                        data={{state, setState}}
                        size={"lg"}
                        direction={'ltr'}
                        sx={{height: 400}}
                        {...(info === "document_detail") && {
                            sx: {height: 400, p: 0}
                        }}
                        title={t(info === "document_detail" ? "doc_detail_title" : info)}
                        {
                            ...(info === "document_detail" && {
                                onClose: handleCloseDialog
                            })
                        }
                        dialogClose={handleCloseDialog}
                        actionDialog={
                            action ? <DialogActions>
                                    <Button onClick={handleCloseDialog}
                                            startIcon={<CloseIcon/>}>
                                        {t('cancel')}
                                    </Button>
                                    <Button variant="contained"
                                            onClick={handleSaveDialog}

                                            startIcon={<Icon
                                                path='ic-dowlaodfile'/>}>
                                        {t('save')}
                                    </Button>
                                </DialogActions>
                                : null

                        }/>
            }

        </>
    )
}

export default ConsultationIPToolbar
