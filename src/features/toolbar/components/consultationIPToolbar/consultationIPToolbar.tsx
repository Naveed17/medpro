import React, { useEffect, useState } from 'react'
import { Tabs, Tab, Stack, Button, MenuItem, DialogActions } from '@mui/material'
import ConsultationIPToolbarStyled from './overrides/consultationIPToolbarStyle'
import StyledMenu from './overrides/menuStyle'
import { useTranslation } from 'next-i18next'
import { tabsData, documentButtonList } from './config'
import { Dialog } from '@features/dialog';
import CloseIcon from "@mui/icons-material/Close";
import Icon from '@themes/urlIcon'
import { useAppDispatch } from "@app/redux/hooks";
import { SetEnd } from "@features/toolbar/components/consultationIPToolbar/actions";
import { useRequestMutation } from "@app/axios";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";

function ConsultationIPToolbar({ ...props }) {
    const { t, ready } = useTranslation("consultation", { keyPrefix: "consultationIP" })
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [value, setValue] = useState(tabsData[0].value);
    const [info, setInfo] = useState<null | string>('');
    const [state, setState] = useState<any>();
    const [prescription, setPrescription] = useState<PrespectionDrugModel[]>([]);
    const [checkUp, setCheckUp] = useState<AnalysisModel[]>([]);
    const [tabs, setTabs] = useState(0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [action, setactions] = useState<boolean>(false);
    const open = Boolean(anchorEl);
    const dispatch = useAppDispatch();
    const { selected, appuuid, mutate, setPendingDocuments, pendingDocuments, dialog, setDialog } = props;


    const { trigger } = useRequestMutation(null, "/drugs");
    const router = useRouter();
    const { data: session } = useSession();
    const { data: user } = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    useEffect(() => {
        switch (dialog) {
            case "draw_up_an_order":
                setInfo('medical_prescription')
                setState(prescription)
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
                }, { revalidate: true, populateCache: true }).then((r: any) => {
                    mutate();
                    setInfo('document_detail')
                    const res = r.data.data
                    console.log(res)

                    setState({
                        uri: res[1],
                        name: 'ordonnance',
                        type: 'Ordonnance',
                        info: res[0].prescription_has_drugs,
                        uuid: res[0].uuid,
                        patient: res[0].patient.firstName + ' ' + res[0].patient.lastName
                    })
                    setOpenDialog(true);
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
                }, { revalidate: true, populateCache: true }).then((r: any) => {
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
        }

        setOpenDialog(false);
        setInfo(null)
    }
    useEffect(() => {
        selected(tabs);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabs]);
    if (!ready) return <>loading translations...</>;
    return (
        <>
            <ConsultationIPToolbarStyled minHeight="inherit" width={1}>
                <Stack direction="row" spacing={1} mt={1.2} justifyContent="flex-end">
                    <Button variant="contained"
                        onClick={() => {
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
                    <Button variant="contained">
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
                                <Icon path={item.icon} />
                                {t(item.label)}
                            </MenuItem>
                        ))}
                    </StyledMenu>
                </Stack>
                <Stack direction='row' minHeight="inherit" alignItems="flex-end" width={1}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        sx={{ width: '80%' }}
                        variant="scrollable"
                        textColor="primary"
                        indicatorColor="primary"
                        aria-label="patient_history">
                        {tabsData.map(({ label, value }, index) => (
                            <Tab onFocus={() => setTabs(index)} className='custom-tab' key={label} value={value}
                                label={t(label)} />
                        ))}
                    </Tabs>
                    <Button variant="outlined" color="primary" onClick={() => {
                        const btn = document.getElementsByClassName('sub-btn')[1];
                        (btn as HTMLElement)?.click();
                        dispatch(SetEnd(true))
                    }} className="action-button">
                        <Icon path="ic-check" />
                        {t("end_of_consultation")}
                    </Button>
                </Stack>
            </ConsultationIPToolbarStyled>
            {
                info &&
                <Dialog action={info}
                    open={openDialog}
                    data={{ state, setState }}
                    size={"lg"}
                    direction={'ltr'}
                    sx={{ height: 400 }}
                    {...(info === "document_detail") && {
                        sx: { height: 400, p: 0 }
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
                                startIcon={<CloseIcon />}>
                                {t('cancel')}
                            </Button>
                            <Button variant="contained"
                                onClick={handleSaveDialog}

                                startIcon={<Icon
                                    path='ic-dowlaodfile' />}>
                                {t('save')}
                            </Button>
                        </DialogActions>
                            : null

                    } />
            }

        </>
    )
}

export default ConsultationIPToolbar
