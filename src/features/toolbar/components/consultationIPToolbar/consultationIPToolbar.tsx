import React, {useEffect, useState} from 'react'
import {Tabs, Tab, Stack, Button, MenuItem, DialogActions} from '@mui/material'
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

function ConsultationIPToolbar({...props}) {
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [value, setValue] = useState('patient history');
    const [info, setInfo] = useState<null | string>('');
    const [state, setState] = useState<any>();
    const [prescription, setPrescription] = useState<PrespectionDrugModel[]>([]);
    const [checkUp, setCheckUp] = useState<AnalysisModel[]>([]);
    const [tabs, setTabs] = useState(0);
    const [lastTabs, setLastTabs] = useState(0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [action, setactions] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const open = Boolean(anchorEl);
    const {
        selected,
        appuuid,
        mutate,
        agenda,
        mutateDoc,
        setPendingDocuments,
        pendingDocuments,
        dialog,
        documents,
        setDialog,
        selectedAct,
        selectedModel,
        selectedExam
    } = props;


    const {trigger} = useRequestMutation(null, "/drugs");
    const router = useRouter();
    const {data: session} = useSession();
    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
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
        }
        setDialog('')
        setOpenDialog(true);
        setactions(true)

    }, [checkUp, dialog, prescription, setDialog])
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
            case "write_certif":
                setInfo('write_certif')
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
        }

        setOpenDialog(false);
        setInfo(null)
        setPendingDocuments(pdoc)

    }

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

    const handleSaveDialog = () => {
        const form = new FormData();
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
                }, {revalidate: true, populateCache: true}).then((r: any) => {
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
                }, {revalidate: true, populateCache: true}).then((r: any) => {
                    mutateDoc();
                    mutate();
                    setCheckUp([])
                    setInfo('document_detail')
                    const res = r.data.data;
                    setState({
                        uuid: res[0].uuid,
                        uri: res[1],
                        name: 'bilan',
                        type: 'analysis',
                        info: res[0].analyses,
                        patient: res[0].patient.firstName + ' ' + res[0].patient.lastName
                    })
                    setOpenDialog(true);
                    setactions(true)
                })
                break;
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
                }, {revalidate: true, populateCache: true}).then(() => {
                    mutateDoc()
                });
                setOpenDialog(true);
                setactions(true)
                break;
        }

        setOpenDialog(false);
        setInfo(null)
    }

    useEffect(() => {
        selected(tabs);
        if (lastTabs === 2) {
            const btn = document.getElementsByClassName('sub-btn')[1];
            (btn as HTMLElement)?.click();
        }
        setLastTabs(tabs)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabs]);

    if (!ready) return <>loading translations...</>;

    return (
        <>
            <ConsultationIPToolbarStyled minHeight="inherit" width={1}>
                <Stack direction="row" spacing={1} mt={1.2} justifyContent="flex-end">
                    <Button disabled variant="contained"
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
                    <Button disabled variant="contained">
                        {t("vaccine")}
                    </Button>
                    <Button disabled={true} variant="contained">
                        {t("report")}
                    </Button>
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
                        sx={{width: '80%'}}
                        variant="scrollable"
                        textColor="primary"
                        indicatorColor="primary"
                        aria-label="patient_history">
                        {tabsData.map(({label, value}, index) => (
                            <Tab onFocus={() => setTabs(index)} className='custom-tab' key={label} value={value}
                                 label={t(label)}/>
                        ))}
                    </Tabs>
                    <LoadingButton loading={loading} variant="outlined" color="primary" onClick={() => {
                        const btn = document.getElementsByClassName('sub-btn')[1];
                        (btn as HTMLElement)?.click();
                        setLoading(true)
                        setTimeout(() => {
                            console.log(selectedAct)
                            console.log(selectedModel)
                            console.log(selectedExam)
                            setLoading(false)
                        }, 3000)
                    }} className="action-button">
                        {!loading && <Icon path="ic-check"/>}
                        {t("end_of_consultation")}
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
