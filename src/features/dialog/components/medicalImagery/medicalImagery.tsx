import {
    Grid,
    Stack,
    Typography,
    Button,
    Card,
    IconButton,
    TextField, ListItemButton, ListItemText, List, ListItem, Skeleton, Box, DialogActions
} from '@mui/material'
import {useFormik, Form, FormikProvider} from "formik";
import BalanceSheetDialogStyled from '../balanceSheet/overrides/balanceSheetDialogStyle';
import {useTranslation} from 'next-i18next'
import AddIcon from '@mui/icons-material/Add';
import Icon from '@themes/urlIcon'
import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {useRequest, useRequestMutation} from "@app/axios";
import {Session} from "next-auth";
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";

function MedicalImageryDialog({...props}) {
    const {data} = props;

    const [model, setModel] = useState<string>('');
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [miList, setMiList] = useState<MIModel[]>([]);
    const [mi, setMi] = useState<MIModel[]>(data.state);
    const [loading, setLoading] = useState<boolean>(true);
    const {trigger} = useRequestMutation(null, "/medicalImagery");
    const [name, setName] = useState('');


    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    const formik = useFormik({
        initialValues: {
            name: ''
        },
        onSubmit: async () => {
            if (name.length > 0)
                addImage({uuid: '', name})
        },
    });
    const initalData = Array.from(new Array(20));

    const router = useRouter();
    const {data: session} = useSession();
    const {data: user} = session as Session;

    const {data: httpAnalysisResponse} = useRequest({
        method: "GET",
        url: "/api/private/medical-imaging/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    const addImage = (value: MIModel) => {
        setName('')
        setMiList((httpAnalysisResponse as HttpResponse)?.data);
        mi.unshift(value)
        setMi([...mi])
        data.setState([...mi])
    }

    const saveModel = () => {
        const form = new FormData();
        form.append('globalNote', "");
        form.append('name', model);
        form.append('analyses', JSON.stringify(mi));

        trigger({
            method: "POST",
            url: "/api/medical-entity/" + medical_entity.uuid + '/requested-analysis-modal/' + router.locale,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then(() => {
            setOpenDialog(false);
        })
    }

    const handleChange = (ev: any) => {
        setName(ev.target.value);

        if (ev.target.value.length >= 2) {
            trigger({
                method: "GET",
                url: "/api/private/medical-imaging/" + router.locale + '?name=' + ev.target.value,
                headers: {Authorization: `Bearer ${session?.accessToken}`}
            }).then((r) => {
                const res = (r?.data as HttpResponse).data
                if (res.length > 0)
                    setMiList(res)
                else
                    setMiList((httpAnalysisResponse as HttpResponse)?.data);

            })
        } else
            setMiList((httpAnalysisResponse as HttpResponse)?.data);
    }

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    useEffect(() => {
        setMiList((httpAnalysisResponse as HttpResponse)?.data);
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [httpAnalysisResponse])

    const {handleSubmit} = formik;

    if (!ready) return <>loading translations...</>;

    return (
        <BalanceSheetDialogStyled>
            <Grid container spacing={5}>
                <Grid item xs={12} md={7}>
                    <FormikProvider value={formik}>
                        <Stack
                            spacing={2}
                            component={Form}
                            autoComplete="off"
                            noValidate
                            onSubmit={handleSubmit}>
                            <Stack spacing={1}>
                                <Stack direction="row" alignItems="center">
                                    <Typography>{t('please_name_medical_imagery')}</Typography>
                                </Stack>
                                <TextField
                                    id="balance_sheet_name"
                                    value={name}
                                    placeholder={t('placeholder_medical_imagery')}
                                    onChange={handleChange}/>
                            </Stack>
                            <Button className='btn-add' type={"submit"} size='small'
                                    startIcon={
                                        <AddIcon/>
                                    }>
                                {t('add_medical_imagery')}
                            </Button>
                            {
                                !loading ?
                                    <List className='items-list'>
                                        {
                                            miList?.map(anaylis => (
                                                    <ListItemButton disabled={mi.find(an =>an.uuid ===anaylis.uuid) !== undefined}  key={anaylis.uuid} onClick={() => {
                                                        addImage(anaylis)
                                                    }}>
                                                        <ListItemText primary={anaylis.name}/>
                                                    </ListItemButton>
                                                )
                                            )
                                        }
                                    </List> : <List className='items-list'>
                                        {
                                            initalData.map((item, index) => (
                                                    <ListItemButton key={index}>
                                                        <Skeleton sx={{ml: 1}} width={130} height={8}
                                                                  variant="rectangular"/>
                                                    </ListItemButton>
                                                )
                                            )
                                        }
                                    </List>
                            }
                        </Stack>
                    </FormikProvider>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Stack direction="row" alignItems="center">
                        <Typography gutterBottom>{t('medical_imagery_list')}</Typography>
                        {/*{analysis.length > 0 && <Button className='btn-add'
                                                        sx={{ml: 'auto'}}
                                                        onClick={() => {
                                                            setOpenDialog(true)
                                                        }}
                                                        startIcon={
                                                            <AddIcon/>
                                                        }>
                            {t('save_template')}
                        </Button>}*/}
                    </Stack>
                    <Box className="list-container">
                        {
                            mi.length > 0 ?
                                mi.map((item, index) => (
                                    <Card key={index}>
                                        <Stack p={1} direction='row' alignItems="center" justifyContent='space-between'>
                                            <Typography>{item.name}</Typography>
                                            <IconButton size="small" onClick={() => {
                                                mi.splice(index, 1);
                                                setMi([...mi])
                                                data.setState([...mi])
                                            }}>
                                                <Icon path="setting/icdelete"/>
                                            </IconButton>
                                        </Stack>
                                    </Card>
                                ))
                                : <Card className='loading-card'>
                                    <Stack spacing={2}>
                                        <Typography alignSelf="center">
                                            {t("list_empty")}
                                        </Typography>
                                        <List>
                                            {
                                                Array.from({length: 4}).map((_, idx) =>
                                                    <ListItem key={idx} sx={{py: .5}}>
                                                        <Skeleton width={10} height={8} variant="rectangular"/>
                                                        <Skeleton sx={{ml: 1}} width={130} height={8}
                                                                  variant="rectangular"/>
                                                    </ListItem>
                                                )
                                            }

                                        </List>
                                    </Stack>
                                </Card>
                        }
                    </Box>
                </Grid>
            </Grid>

            <Dialog action={'modelName'}
                    open={openDialog}
                    data={{model, setModel}}
                    change={false}
                    max
                    size={"sm"}
                    direction={'ltr'}
                    actions={true}
                    title={t('Personaliser les modèles du bilan')}
                    dialogClose={handleCloseDialog}
                    actionDialog={
                        <DialogActions>
                            <Button onClick={handleCloseDialog}
                                    startIcon={<CloseIcon/>}>
                                {t('cancel')}
                            </Button>
                            <Button variant="contained"
                                    onClick={saveModel}
                                    startIcon={<Icon
                                        path='ic-dowlaodfile'/>}>
                                {t('save')}
                            </Button>
                        </DialogActions>
                    }/>
        </BalanceSheetDialogStyled>
    )
}

export default MedicalImageryDialog