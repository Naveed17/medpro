import {
    Grid,
    Stack,
    Typography,
    Button,
    Card,
    IconButton,
    TextField, ListItemButton, ListItemText, List, ListItem, Skeleton,
    Menu, MenuItem, Box, DialogActions
} from '@mui/material'
import {useFormik, Form, FormikProvider} from "formik";
import BalanceSheetDialogStyled from './overrides/balanceSheetDialogStyle';
import {useTranslation} from 'next-i18next'
import AddIcon from '@mui/icons-material/Add';
import Icon from '@themes/urlIcon'
import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {useRequest, useRequestMutation} from "@app/axios";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {Session} from "next-auth";
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";

function BalanceSheetDialog({...props}) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const {data} = props;

    const [model, setModel] = useState<string>('');
    const [modals, setModels] = useState<any[]>([]);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [analysisList, setAnalysisList] = useState<AnalysisModel[]>([]);
    const [analysis, setAnalysis] = useState<AnalysisModel[]>(data.state);
    const [loading, setLoading] = useState<boolean>(true);
    const {trigger} = useRequestMutation(null, "/balanceSheet");
    const [name, setName] = useState('');

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (item: { uuid: string, analyses: AnalysisModel[] }) => {
        setAnalysis(item.analyses)
        data.setState(item.analyses)
        setAnchorEl(null);
    };

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
                addAnalysis({uuid: '', name})
        },
    });
    const initalData = Array.from(new Array(20));

    const router = useRouter();
    const {data: session} = useSession();
    const {data: user} = session as Session;

    const {data: httpAnalysisResponse} = useRequest({
        method: "GET",
        url: "/api/private/analysis/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    const addAnalysis = (value: AnalysisModel) => {
        setName('')
        analysis.push(value)
        setAnalysis([...analysis])
        data.setState([...analysis])
    }

    const saveModel = () => {
        const form = new FormData();
        form.append('globalNote', "");
        form.append('name', model);
        form.append('analyses', JSON.stringify(analysis));

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
                url: "/api/private/analysis/" + router.locale + '?name=' + ev.target.value,
                headers: {Authorization: `Bearer ${session?.accessToken}`}
            }).then((r) => {
                const res = (r?.data as HttpResponse).data
                if (res.length > 0)
                    setAnalysisList(res)
                else
                    setAnalysisList((httpAnalysisResponse as HttpResponse)?.data);

            })
        } else
            setAnalysisList((httpAnalysisResponse as HttpResponse)?.data);
    }

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpModelResponse} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + '/requested-analysis-modal/' + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    useEffect(() => {
        if (httpModelResponse)
            setModels((httpModelResponse as HttpResponse).data);
    }, [httpModelResponse])

    useEffect(() => {
        setAnalysisList((httpAnalysisResponse as HttpResponse)?.data);
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
                                    <Typography>{t('please_name_the_balance_sheet')}</Typography>
                                    <Button
                                        sx={{ml: 'auto'}}
                                        endIcon={
                                            <KeyboardArrowDownIcon/>
                                        }
                                        id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick}
                                    >
                                        {t('balance_sheet_model')}
                                    </Button>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={() => {
                                            setAnchorEl(null);
                                        }}
                                        sx={{
                                            '& .MuiPaper-root': {
                                                borderRadius: 0,
                                                borderBottomLeftRadius: 8,
                                                borderBottomRightRadius: 8,
                                                marginTop: theme => theme.spacing(1),
                                                minWidth: 150,
                                                backgroundColor: theme => theme.palette.text.primary

                                            }
                                        }}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        {
                                            modals.map((item, idx) =>
                                                <MenuItem key={idx} sx={{color: theme => theme.palette.grey[0]}}
                                                          onClick={() => {
                                                              handleClose(item)
                                                          }}>{item.name}</MenuItem>
                                            )
                                        }


                                    </Menu>
                                </Stack>
                                <TextField
                                    id="balance_sheet_name"
                                    value={name}
                                    placeholder={t('placeholder_balance_sheet_name')}
                                    onChange={handleChange}/>
                            </Stack>
                            <Button className='btn-add' type={"submit"} size='small'
                                    startIcon={
                                        <AddIcon/>
                                    }>
                                {t('add_balance_sheet')}
                            </Button>
                            {
                                !loading ?
                                    <List className='items-list'>
                                        {
                                            analysisList?.map(anaylis => (
                                                    <ListItemButton key={anaylis.uuid} onClick={() => {
                                                        addAnalysis(anaylis)
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
                        <Typography gutterBottom>{t('balance_sheet_list')}</Typography>
                        {analysis.length > 0 && <Button className='btn-add'
                                                        sx={{ml: 'auto'}}
                                                        onClick={() => {
                                                            setOpenDialog(true)
                                                        }}
                                                        startIcon={
                                                            <AddIcon/>
                                                        }>
                            {t('save_template')}
                        </Button>}
                    </Stack>
                    <Box className="list-container">
                        {
                            analysis.length > 0 ?
                                analysis.map((item, index) => (
                                    <Card key={index}>
                                        <Stack p={1} direction='row' alignItems="center" justifyContent='space-between'>
                                            <Typography>{item.name}</Typography>
                                            <IconButton size="small" onClick={() => {
                                                analysis.splice(index, 1);
                                                setAnalysis([...analysis])
                                                data.setState([...analysis])
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

export default BalanceSheetDialog