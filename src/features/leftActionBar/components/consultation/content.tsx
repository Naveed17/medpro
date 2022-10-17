// components
import {
    Button,
    CardContent,
    DialogActions,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    Stack,
    Typography
} from "@mui/material";
import Icon from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
import ContentStyled from "./overrides/contantStyle";
import CircleIcon from '@mui/icons-material/Circle';
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import React, {useState} from "react";
import Add from "@mui/icons-material/Add";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {openDrawer} from "@features/calendar";
import {pxToRem} from "@themes/formatFontSize";
import {consultationSelector} from "@features/toolbar/components/consultationIPToolbar/selectors";
import {useRequestMutation} from "@app/axios";
import {useRouter} from "next/router";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {setAppointmentPatient} from "@features/tabPanel";
import moment from "moment/moment";

const Content = ({...props}) => {
    const {id, patient} = props;
    const {t, ready} = useTranslation('consultation', {keyPrefix: 'filter'});
    const dispatch = useAppDispatch();
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [info, setInfo] = useState<string>('');
    const [size, setSize] = useState<string>('sm');
    const bigDialogs = ['add_treatment'];
    const [state, setState] = useState<AntecedentsModel[] | FamilyAntecedentsModel[]>([]);
    const {mutate} = useAppSelector(consultationSelector);
    const {trigger} = useRequestMutation(null, "/antecedent");
    const router = useRouter();
    const {data: session, status} = useSession();
    const codes: any = {
        way_of_life: '0',
        allergic: '1',
        treatment: '2',
        antecedents: '3',
        family_antecedents: '4',
        surgical_antecedents: '5',
        medical_antecedents: '6'
    }
    const handleClickDialog = () => {
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        console.log(info)
        const form = new FormData();
        if (codes[info]) {
            form.append('antecedents', JSON.stringify(state));
            form.append('patient_uuid', patient.uuid);
            trigger({
                method: "POST",
                url: "/api/medical-entity/" + medical_entity.uuid + "/patients/" + patient.uuid + "/antecedents/" + codes[info] + '/' + router.locale,
                data: form,
                headers: {ContentType: 'multipart/form-data', Authorization: `Bearer ${session?.accessToken}`}
            }, {revalidate: true, populateCache: true}).then(() => {
                mutate()
            });

        } else if (info === 'add_treatment') {
            form.append('globalNote', "");
            form.append('isOtherProfessional', "true");
            form.append('drugs', JSON.stringify(state));

            trigger({
                method: "POST",
                url: "/api/medical-entity/" + medical_entity.uuid + '/appointments/' + router.query['uuid-consultation'] + '/prescriptions/' + router.locale,
                data: form,
                headers: {
                    ContentType: 'application/x-www-form-urlencoded',
                    Authorization: `Bearer ${session?.accessToken}`
                }
            }, {revalidate: true, populateCache: true}).then(() => {
                mutate()
            });
        } else if (info === 'balance_sheet_pending') {
            form.append('analysesResult', JSON.stringify((state as any).hasAnalysis));

            trigger({
                method: "PUT",
                url: "/api/medical-entity/" + medical_entity.uuid + '/appointments/' + router.query['uuid-consultation'] + '/requested-analysis/' + (state as any).uuid + '/' + router.locale,
                data: form,
                headers: {
                    ContentType: 'application/x-www-form-urlencoded',
                    Authorization: `Bearer ${session?.accessToken}`
                }
            }, {revalidate: true, populateCache: true}).then(() => {
                mutate()
            });
        } else if (info === 'medical_imaging_pending') {
            form.append('files', JSON.stringify((state as any).files));
            console.log(JSON.stringify((state as any).files))
            trigger({
                method: "PUT",
                url: "/api/medical-entity/" + medical_entity.uuid + '/appointment/' + router.query['uuid-consultation'] + '/medical-imaging/' + (state as any).uuid + '/' + router.locale,
                data: form,
                headers: {
                    ContentType: 'application/x-www-form-urlencoded',
                    Authorization: `Bearer ${session?.accessToken}`
                }
            }, {revalidate: true, populateCache: true}).then(() => {
                mutate()
            });
        }

        setOpenDialog(false);
        setInfo('');
    }

    const handleOpen = (action: string) => {
        if (action === "consultation") {
            dispatch(setAppointmentPatient(patient));
            dispatch(openDrawer({type: "add", open: true}));
            return
        }

        if (patient.antecedents[action])
            setState(patient.antecedents[action])

        setInfo(action);
        bigDialogs.includes(action) ? setSize('lg') : setSize('sm');

        handleClickDialog()
    };

    if (!ready || status === 'loading') return <>loading translations...</>;
    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    return (
        <React.Fragment>
            {
                id !== 4 && id !== 2 && id !== 5 ?
                    <ContentStyled>
                        <CardContent style={{paddingBottom: pxToRem(15)}}>
                            {id === 1 &&
                                <Stack spacing={1} alignItems="flex-start">
                                    <List dense>
                                        {
                                            patient?.treatment.map((list: any, index: number) =>
                                                <ListItem key={index}>
                                                    <ListItemIcon>
                                                        <CircleIcon/>
                                                    </ListItemIcon>
                                                    <Typography variant="body2"
                                                                color={list.isOtherProfessional ? 'text.secondary' : ''}>
                                                        {list.name} / {list.duration} {list.durationType} {list.isOtherProfessional ? '' : '( ordonnance )'}
                                                    </Typography>
                                                    <IconButton size="small" onClick={() => {
                                                        trigger({
                                                            method: "PATCH",
                                                            url: "/api/medical-entity/" + medical_entity.uuid + '/appointments/' + router.query['uuid-consultation'] + '/prescription-has-drugs/' + list.uuid + '/' + router.locale,
                                                            headers: {
                                                                ContentType: 'application/x-www-form-urlencoded',
                                                                Authorization: `Bearer ${session?.accessToken}`
                                                            }
                                                        }, {revalidate: true, populateCache: true}).then(() => {
                                                            mutate()
                                                        });


                                                    }} sx={{ml: 'auto'}}>
                                                        <Icon path="setting/icdelete"/>
                                                    </IconButton>
                                                </ListItem>
                                            )
                                        }

                                    </List>
                                    <Button onClick={() => handleOpen("add_treatment")} size="small"
                                            style={{paddingBottom: pxToRem(0)}}
                                            startIcon={<Add/>}>
                                        {t('add')}
                                    </Button>
                                </Stack>
                            }
                            {
                                id === 3 &&
                                <Stack spacing={1} alignItems="flex-start">
                                    {<List dense>
                                        {patient &&
                                            patient?.previousAppointments.map((list: { dayDate: string }, index: number) =>
                                                <ListItem key={index}>
                                                    <ListItemIcon>
                                                        <CircleIcon/>
                                                    </ListItemIcon>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {list.dayDate}
                                                    </Typography>
                                                </ListItem>
                                            )
                                        }

                                    </List>}
                                    <Stack mt={2}>
                                        <Button onClick={() => handleOpen("consultation")} size="small" startIcon={
                                            <Add/>
                                        }>
                                            {t('add')}
                                        </Button>
                                    </Stack>
                                </Stack>
                            }

                        </CardContent>
                    </ContentStyled> : id === 2 ?
                        <>
                            {
                                patient?.requestedAnalyses.length === 0 &&
                                <ContentStyled>
                                    <CardContent style={{
                                        paddingBottom: '15px',
                                        fontSize: '0.75rem',
                                        color: '#7C878E',
                                        textAlign: 'center',
                                        paddingTop: '15px'
                                    }}>
                                        {t('emptyBalance')}
                                    </CardContent>
                                </ContentStyled>
                            }
                            {
                                patient?.requestedAnalyses.map((ra: any, index: number) =>
                                    <ContentStyled key={index}>
                                        <CardContent style={{paddingBottom: 5}}>
                                            <p style={{
                                                textAlign: "right",
                                                textTransform: "capitalize",
                                                margin: '5px 15px',
                                                fontSize: 12,
                                                color: '#7C878E'
                                            }}>{moment(ra?.appointment, 'DD-MM-YYYY').format('MMM DD/YYYY')}</p>
                                            <Stack spacing={2} alignItems="flex-start">
                                                <List dense>
                                                    {
                                                        ra.hasAnalysis.map((list: any, index: number) =>
                                                            <ListItem key={index}>
                                                                <ListItemIcon>
                                                                    <CircleIcon/>
                                                                </ListItemIcon>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {list.analysis.name}
                                                                </Typography>
                                                            </ListItem>
                                                        )
                                                    }

                                                </List>
                                                <Stack direction="row" spacing={2}>
                                                    <Button onClick={() => {
                                                        setState(ra)
                                                        handleOpen("balance_sheet_pending")
                                                    }} size="small"
                                                            startIcon={
                                                                <Add/>
                                                            }>
                                                        {t('add_result')}
                                                    </Button>
                                                    {patient?.requestedAnalyses.length > 0 &&
                                                        <Button color="error"
                                                                size="small"
                                                                onClick={() => {
                                                                    console.log(ra.uuid)
                                                                    trigger({
                                                                        method: "DELETE",
                                                                        url: "/api/medical-entity/" + medical_entity.uuid + '/appointments/' + router.query['uuid-consultation'] + '/requested-analysis/' + ra.uuid + '/' + router.locale,
                                                                        headers: {
                                                                            ContentType: 'application/x-www-form-urlencoded',
                                                                            Authorization: `Bearer ${session?.accessToken}`
                                                                        }
                                                                    }, {revalidate: true, populateCache: true}).then(() => {
                                                                        mutate();
                                                                    })
                                                                }}
                                                                startIcon={
                                                                    <Icon path="setting/icdelete"/>
                                                                }>
                                                            {t('ignore')}
                                                        </Button>}
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </ContentStyled>
                                )
                            }
                        </> : id === 5 ?
                            <>

                                {
                                    patient?.requestedImaging.map((ri: any, index: number) =>
                                        <ContentStyled key={index}>
                                            <CardContent style={{paddingBottom: 5}}>
                                                <p style={{
                                                    textAlign: "right",
                                                    textTransform: "capitalize",
                                                    margin: '5px 15px',
                                                    fontSize: 12,
                                                    color: '#7C878E'
                                                }}>{moment(ri?.appointment.dayDate, 'DD-MM-YYYY').format('MMM DD/YYYY')}</p>
                                                <Stack spacing={2} alignItems="flex-start">
                                                    <List dense>
                                                        {
                                                            ri['medical-imaging'].map((list: any, index: number) =>
                                                                <ListItem key={index}>
                                                                    <ListItemIcon>
                                                                        <CircleIcon/>
                                                                    </ListItemIcon>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {list['medical-imaging'].name}
                                                                    </Typography>
                                                                </ListItem>
                                                            )
                                                        }

                                                    </List>
                                                    <Stack direction="row" spacing={2}>
                                                        <Button onClick={() => {
                                                            setState(ri)
                                                            handleOpen("medical_imaging_pending")
                                                        }} size="small"
                                                                startIcon={
                                                                    <Add/>
                                                                }>
                                                            {t('add_result')}
                                                        </Button>
                                                        {patient?.requestedImaging.length > 0 &&
                                                            <Button color="error"
                                                                    size="small"
                                                                    onClick={() => {
                                                                        console.log(ri.uuid)
                                                                        trigger({
                                                                            method: "DELETE",
                                                                            // url: "/api/medical-entity/" + medical_entity.uuid + '/appointments/' + router.query['uuid-consultation'] + '/requested-analysis/' + ra.uuid + '/' + router.locale,
                                                                            headers: {
                                                                                ContentType: 'application/x-www-form-urlencoded',
                                                                                Authorization: `Bearer ${session?.accessToken}`
                                                                            }
                                                                        }, {
                                                                            revalidate: true,
                                                                            populateCache: true
                                                                        }).then(() => {
                                                                            mutate();
                                                                        })
                                                                    }}
                                                                    startIcon={
                                                                        <Icon path="setting/icdelete"/>
                                                                    }>
                                                                {t('ignore')}
                                                            </Button>}
                                                    </Stack>
                                                </Stack>
                                            </CardContent>
                                        </ContentStyled>
                                    )
                                }
                                <Button onClick={() => {
                                    //setState(ra)
                                    handleOpen("medical_imaging_pending")
                                }
                                }>Images</Button>
                            </> :
                            patient && Object.keys(patient.antecedents).map((antecedent, idx: number) =>
                                <ContentStyled key={`card-${idx}`} style={{paddingBottom: pxToRem(15)}}>
                                    <CardContent style={{paddingBottom: pxToRem(0), paddingTop: '1rem'}}>
                                        <Typography fontWeight={600}>
                                            {t(antecedent)}
                                        </Typography>

                                        <List dense>
                                            {
                                                patient.antecedents[antecedent].map((item: { uuid: string, name: string, startDate: string, endDate: string }, index: number) =>
                                                    <ListItem key={`list-${index}`}>
                                                        <ListItemIcon>
                                                            <CircleIcon/>
                                                        </ListItemIcon>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {item.name} {item.startDate ? ' / ' + item.startDate : ''} {item.endDate ? ' - ' + item.endDate : ''}
                                                        </Typography>
                                                        <IconButton size="small" onClick={() => {
                                                            console.log(antecedent, item)

                                                            trigger({
                                                                    method: "DELETE",
                                                                    url: "/api/medical-entity/" + medical_entity.uuid + "/patients/" + patient.uuid + "/antecedents/" + item.uuid + '/' + router.locale,
                                                                    headers: {
                                                                        ContentType: 'multipart/form-data',
                                                                        Authorization: `Bearer ${session?.accessToken}`
                                                                    }
                                                                }, {
                                                                    revalidate: true,
                                                                    populateCache: true
                                                                }
                                                            ).then(r => console.log('edit qualification', r))
                                                            mutate();
                                                        }} sx={{ml: 'auto'}}>
                                                            <Icon path="setting/icdelete"/>
                                                        </IconButton>
                                                    </ListItem>
                                                )
                                            }

                                        </List>
                                        <Stack mt={2} alignItems="flex-start">
                                            <Button onClick={() => handleOpen(antecedent)} size="small" startIcon={
                                                <Add/>
                                            }>
                                                {antecedent === "way_of_life" ? t('add') : t("add_history")}
                                            </Button>
                                        </Stack>

                                    </CardContent>
                                </ContentStyled>
                            )
            }

            {
                info &&
                <Dialog action={info}
                        open={openDialog}
                        data={{state: state, setState: setState, patient_uuid: patient.uuid, action: info}}
                        change={false}
                        max
                        size={size}
                        direction={'ltr'}
                        actions={true}
                        title={t(info)}
                        dialogClose={() => {
                            setOpenDialog(false);
                            setInfo('');
                        }}
                        actionDialog={
                            <DialogActions>
                                <Button onClick={() => {
                                    setOpenDialog(false);
                                    setInfo('');
                                }}
                                        startIcon={<CloseIcon/>}>
                                    {t('cancel')}
                                </Button>
                                <Button variant="contained"
                                        onClick={handleCloseDialog}
                                        startIcon={<Icon path='ic-dowlaodfile'/>}>
                                    {t('save')}
                                </Button>
                            </DialogActions>
                        }/>
            }

        </React.Fragment>
    )
}
export default Content

