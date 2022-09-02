// components
import {
    Typography,
    ListItem,
    List,
    Stack,
    ListItemIcon,
    CardContent,
    IconButton,
    Button,
    DialogActions
} from "@mui/material";
import Icon from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
import ContentStyled from "./overrides/contantStyle";
import CircleIcon from '@mui/icons-material/Circle';
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState} from "react";
import Add from "@mui/icons-material/Add";
import {data2} from './config'
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {openDrawer} from "@features/calendar";
import {pxToRem} from "@themes/formatFontSize";
import {consultationSelector} from "@features/toolbar/components/consultationIPToolbar/selectors";
import {useRequestMutation} from "@app/axios";
import {useRouter} from "next/router";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";


const Content = ({...props}) => {
    const {id, patient} = props;
    const {t, ready} = useTranslation('consultation', {keyPrefix: 'filter'});
    const dispatch = useAppDispatch();
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [info, setInfo] = useState<string>('');
    const [size, setSize] = useState<string>('sm');
    const [state, setState] = useState<AntecedentsModel[] | FamilyAntecedentsModel[]>([]);
    const {mutate} = useAppSelector(consultationSelector);
    const {trigger} = useRequestMutation(null, "/antecedent");
    const router = useRouter();
    const {data: session, status} = useSession();
    const codes: any = {
        way_of_life: '0',
        allergic: '1',
        treatment: '2',
        antecedents:'3',
        family_antecedents:'4',
        surgical_antecedents:'5',
        medical_antecedents: '6'
    }
    const handleClickDialog = () => {
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        const form = new FormData();
        form.append('antecedents', JSON.stringify(state));
        form.append('patient_uuid', patient.uuid);
        trigger({
            method: "POST",
            url: "/api/medical-entity/" + medical_entity.uuid + "/patients/" + patient.uuid + "/antecedents/" + codes[info] + '/' + router.locale,
            data: form,
            headers: {ContentType: 'multipart/form-data', Authorization: `Bearer ${session?.accessToken}`}
        }, {revalidate: true, populateCache: true}).then(r => console.log('edit qualification', r))

        mutate();
        setOpenDialog(false);
        setInfo('')
    }
    const handleOpen = (action: string) => {
        if (action === "consultation") {
            dispatch(openDrawer({type: "add", open: true}));
            return
        }
        setState(patient.antecedents[action])
        console.log(action)
        setInfo(action)
        action === 'add_treatment'? setSize('lg'):setSize('sm');

        handleClickDialog()
    };

    if (!ready || status === 'loading') return <>loading translations...</>;
    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    return (
        <React.Fragment>
            {
                id !== 4 ?
                    <ContentStyled>
                        <CardContent style={{paddingBottom: pxToRem(15)}}>
                            {id === 1 &&
                                <Stack spacing={1} alignItems="flex-start">
                                    <List dense>
                                        {
                                            [].map((list: any, index: number) =>
                                                <ListItem key={index}>
                                                    <ListItemIcon>
                                                        <CircleIcon/>
                                                    </ListItemIcon>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {list.name} / {list.duration} {t(list.dosage)}
                                                    </Typography>
                                                    <IconButton size="small" onClick={console.log} sx={{ml: 'auto'}}>
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
                            {id === 2 &&
                                <Stack spacing={2} alignItems="flex-start">
                                    <List dense>
                                        {
                                            data2.map((list, index) =>
                                                <ListItem key={index}>
                                                    <ListItemIcon>
                                                        <CircleIcon/>
                                                    </ListItemIcon>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {list.name}
                                                    </Typography>
                                                </ListItem>
                                            )
                                        }

                                    </List>
                                    <Stack direction="row" spacing={2}>
                                        <Button onClick={() => handleOpen("balance_sheet_pending")} size="small"
                                                startIcon={
                                                    <Add/>
                                                }>
                                            {t('add_result')}
                                        </Button>
                                        <Button color="error" size="small" onClick={console.log} startIcon={
                                            <Icon path="setting/icdelete"/>
                                        }>
                                            {t('ignore')}
                                        </Button>
                                    </Stack>
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
                    </ContentStyled> :
                    patient && Object.keys(patient.antecedents).map((antecedent, idx: number) =>
                        <ContentStyled key={`card-${idx}`} style={{paddingBottom: pxToRem(15)}}>
                            <CardContent style={{paddingBottom: pxToRem(0), paddingTop: '1rem'}}>
                                <Typography fontWeight={600}>
                                    {t(antecedent)}
                                </Typography>

                                <List dense>
                                    {
                                        patient.antecedents[antecedent].map((item: { uuid: string, name: string }, index: number) =>
                                            <ListItem key={`list-${index}`}>
                                                <ListItemIcon>
                                                    <CircleIcon/>
                                                </ListItemIcon>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.name}
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
                        dialogClose={handleCloseDialog}
                        actionDialog={
                            <DialogActions>
                                <Button onClick={handleCloseDialog}
                                        startIcon={<CloseIcon/>}>
                                    {t('cancel')}
                                </Button>
                                <Button variant="contained"
                                        onClick={handleCloseDialog}
                                        startIcon={<Icon
                                            path='ic-dowlaodfile'/>}>
                                    {t('save')}
                                </Button>
                            </DialogActions>
                        }/>
            }

        </React.Fragment>
    )
}
export default Content


