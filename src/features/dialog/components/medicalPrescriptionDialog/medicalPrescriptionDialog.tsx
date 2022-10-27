import {
    Autocomplete,
    Box,
    Button,
    Card,
    DialogActions,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    List,
    ListItem,
    Menu,
    MenuItem,
    Radio,
    RadioGroup,
    Skeleton,
    Stack,
    TextField,
    Typography
} from '@mui/material'
import {Form, FormikProvider, useFormik} from "formik";
import MedicalPrescriptionDialogStyled from './overrides/medicalPrescriptionDialogStyle';
import {useTranslation} from 'next-i18next'
import {DrugListCard} from '@features/card'
import AddIcon from '@mui/icons-material/Add';
import React, {useEffect, useState} from 'react';
import {useRequest, useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import * as Yup from "yup";
import {Session} from "next-auth";
import CloseIcon from "@mui/icons-material/Close";
import Icon from "@themes/urlIcon";
import {Dialog} from "@features/dialog";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

function MedicalPrescriptionDialog({...props}) {
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const {data} = props
    const [drugs, setDrugs] = useState<PrespectionDrugModel[]>(data.state);
    const [drugsList, setDrugsList] = useState<DrugModel[]>([]);
    const [drug, setDrug] = useState<DrugModel | null>(null);
    const [update, setUpdate] = useState<number>(-1);
    const [model, setModel] = useState<string>('');
    const [models, setModels] = useState<any[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [errorDrug, setErrorDrug] = useState(false);
    const [errorDuration, setErrorDuration] = useState(false);

    const {data: session} = useSession();
    const {data: user} = session as Session;

    const validationSchema = Yup.object().shape({
        dosage: Yup.string().required(t('doseReq')),
        duration: Yup.string().required(),
        durationType: Yup.string().required()
    });

    const handleSaveDialog = () => {

        const form = new FormData();

        form.append('globalNote', "");
        form.append('name', model);
        form.append('drugs', JSON.stringify(drugs));
        trigger({
            method: "POST",
            url: "/api/medical-entity/" + medical_entity.uuid + '/prescriptions/modals/' + router.locale,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }, {
            revalidate: true,
            populateCache: true
        }).then((cnx) => {
            mutate();
            setDrugsList((cnx?.data as HttpResponse)?.data)
        })
        setOpenDialog(false);
    }

    const editModel = () => {

        const form = new FormData();
        form.append('drugs', JSON.stringify(drugs));

        trigger({
            method: "PUT",
            url: "/api/medical-entity/" + medical_entity.uuid + '/prescriptions/modals/'+selectedModel+'/'+ router.locale,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }, {
            revalidate: true,
            populateCache: true
        }).then((cnx) => {
            mutate();
            setDrugsList((cnx?.data as HttpResponse)?.data)
            setSelectedModel('')
        })
        setOpenDialog(false);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const {trigger} = useRequestMutation(null, "/drugs");

    const formik = useFormik({
        initialValues: {
            drugUuid: '',
            name: '',
            dosage: '',
            duration: '',
            durationType: 'day',
            note: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            if (drug) {
                values.drugUuid = drug.uuid
                values.name = drug.commercial_name

                drugs.push(values)
                setDrugs([...drugs])
                data.setState([...drugs])
                setDrug(null)
                resetForm()
                setErrorDuration(false)
            } else {
                setErrorDrug(true)
            }
        },
    });

    const router = useRouter();

    const {data: httpDrugsResponse} = useRequest({
        method: "GET",
        url: "/api/drugs/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpModelResponse, mutate} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + '/prescriptions/modals/' + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    useEffect(() => {
        if (httpModelResponse)
            setModels((httpModelResponse as HttpResponse).data)
    }, [httpModelResponse])

    useEffect(() => {
        setDrugsList((httpDrugsResponse as HttpResponse)?.data)
    }, [httpDrugsResponse])

    const {
        values,
        errors,
        touched,
        handleSubmit,
        getFieldProps,
        setFieldValue,
        resetForm
    } = formik;

    useEffect(() => {
        if (drug === null && Object.keys(errors).length !== 0)
            setErrorDrug(true)
        if (Object.keys(errors).includes('durationType') || Object.keys(errors).includes('duration'))
            setErrorDuration(true)
        else setErrorDuration(false)
    }, [drug, errors]);

    const remove = (ev: PrespectionDrugModel) => {
        const selected = drugs.findIndex(drug => drug.drugUuid === ev.drugUuid)
        drugs.splice(selected, 1);
        setDrugs([...drugs])
        data.setState([...drugs]);
    }

    const edit = (ev: PrespectionDrugModel) => {
        const selected = drugs.findIndex(drug => drug.drugUuid === ev.drugUuid)
        setUpdate(selected)
        setDrug({uuid: ev.drugUuid, commercial_name: ev.name, isVerified: true})
        setFieldValue('dosage', drugs[selected].dosage)
        setFieldValue('duration', drugs[selected].duration)
        setFieldValue('durationType', drugs[selected].durationType)
        setFieldValue('note', drugs[selected].note)
    }

    function handleInputChange(value: string) {
        const drg = drugsList.find(drug => drug.commercial_name === value)
        if (drg !== undefined) {
            setDrug(drg);
            setErrorDrug(false)
        } else setDrug({uuid: '', commercial_name: value, isVerified: false});
    }

    if (!ready) return <>loading translations...</>;
    return (
        <MedicalPrescriptionDialogStyled>
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
                                <Stack direction={"row"} alignItems="center">
                                    <Typography>{t('seeking_to_name_the_drug')}
                                        <Typography component="span" color="error">
                                            *
                                        </Typography>
                                    </Typography>
                                    <Button
                                        sx={{ml: 'auto'}}
                                        endIcon={
                                            <KeyboardArrowDownIcon/>
                                        }
                                        id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick}>
                                        {t('model_prescription')}
                                    </Button>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
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
                                            models.map((item, idx) =>
                                                <MenuItem key={idx} sx={{color: theme => theme.palette.grey[0]}}
                                                          onClick={() => {
                                                              console.log(item)
                                                              setSelectedModel(item.uuid)
                                                              setDrugs(item.prescription_modal_has_drugs)
                                                              data.setState(item.prescription_modal_has_drugs)
                                                              setAnchorEl(null);
                                                          }}>{item.name}</MenuItem>
                                            )
                                        }
                                    </Menu>
                                </Stack>
                                {drugsList ? <Autocomplete
                                        id="cmo"
                                        value={drug}
                                        size='small'
                                        options={drugsList}
                                        getOptionLabel={(option: DrugModel) => option?.commercial_name}
                                        isOptionEqualToValue={(option, value) => option?.commercial_name === value?.commercial_name}
                                        renderInput={(params) => <TextField {...params}
                                                                            error={errorDrug}
                                                                            onChange={(ev) => {
                                                                                if (ev.target.value.length >= 2) {
                                                                                    trigger({
                                                                                        method: "GET",
                                                                                        url: "/api/drugs/" + router.locale + '?name=' + ev.target.value,
                                                                                        headers: {Authorization: `Bearer ${session?.accessToken}`}
                                                                                    }, {
                                                                                        revalidate: true,
                                                                                        populateCache: true
                                                                                    }).then((cnx) => {
                                                                                        if (cnx?.data as HttpResponse)
                                                                                            setDrugsList((cnx?.data as HttpResponse).data)
                                                                                    })
                                                                                }
                                                                            }}
                                                                            onBlur={(ev) => handleInputChange(ev.target.value)}
                                                                            placeholder={t('placeholder_drug_name')}/>}/> :
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={[]}
                                        size='small'
                                        renderInput={(params) => <TextField {...params}
                                                                            placeholder={t('placeholder_drug_name')}/>}
                                    />
                                }

                                {/*
                                {errorDrug && <Typography fontSize={12}
                                                          style={{marginLeft: 20}}
                                                          color={"error"}>{t('nameReq')}</Typography>}
*/}
                            </Stack>
                            <Stack spacing={1}>
                                <Typography>{t('dosage')}
                                    <Typography component="span" color="error">
                                        *
                                    </Typography>
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder={t("enter_your_dosage")}
                                    helperText={touched.dosage && errors.dosage}
                                    error={Boolean(touched.dosage && errors.dosage)}
                                    {...getFieldProps("dosage")} />

                            </Stack>

                            <Stack spacing={1}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            fullWidth
                                            id={"duration"}
                                            size="small"
                                            type={"number"}
                                            error={errorDuration}
                                            {...getFieldProps("duration")}
                                            value={values.duration}
                                            InputProps={{inputProps: {min: 1}}}
                                            placeholder={t("duration")}
                                            sx={{color: "text.secondary"}}/>
                                    </Grid>
                                    <Grid item xs={12} md={9}>
                                        <FormControl component="fieldset">
                                            <RadioGroup
                                                row
                                                aria-label="date"
                                                {...getFieldProps("durationType")}
                                            >
                                                <FormControlLabel
                                                    value="day"
                                                    control={<Radio size="small"/>}
                                                    label={t("day")}
                                                />
                                                <FormControlLabel
                                                    value="month"
                                                    control={<Radio size="small"/>}
                                                    label={t("month")}
                                                />
                                                <FormControlLabel
                                                    value="year"
                                                    control={<Radio size="small"/>}
                                                    label={t("year")}
                                                />
                                            </RadioGroup>
                                        </FormControl>

                                    </Grid>
                                </Grid>
                                {/*
                                {errorDuration && <Typography fontSize={12}
                                                              style={{marginLeft: 20}}
                                                              color={"error"}>{t('durationReq')}</Typography>}
*/}
                            </Stack>
                            <Stack spacing={1}>
                                <Typography>{t('cautionary_note')}</Typography>
                                <TextField
                                    fullWidth
                                    placeholder={t("cautionary_note")}
                                    {...getFieldProps("note")}
                                />
                            </Stack>
                            <Grid container justifyContent={"flex-end"}>
                                {
                                    update > -1 ? <Button variant="contained" color={"warning"}
                                                          onClick={() => {
                                                              if (drug) {
                                                                  values.drugUuid = drug.uuid
                                                                  values.name = drug.commercial_name

                                                                  drugs[update] = values
                                                                  setDrugs([...drugs])
                                                                  data.setState([...drugs])
                                                                  setDrug(null)
                                                                  resetForm()
                                                                  setUpdate(-1)
                                                              }
                                                          }}>
                                            {t('updateDrug')}
                                        </Button> :
                                        <Button variant="contained" type={"submit"}>
                                            {t('add_a_drug')}
                                        </Button>
                                }
                            </Grid>
                        </Stack>
                    </FormikProvider>
                    <Divider orientation="vertical"/>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Stack direction={'row'} alignItems="center" mb={1}>
                        <Typography gutterBottom>{t('drug_list')}</Typography>
                        {
                            drugs.length > 0 && selectedModel === '' &&
                            <Button className='btn-add' sx={{ml: 'auto'}} size='small' onClick={() => {
                                setOpenDialog(true)
                            }}
                                    startIcon={<AddIcon/>}>
                                {t('createAsModel')}
                            </Button>
                        }

                        {drugs.length > 0 && selectedModel !== '' &&
                            <Button className='btn-add'
                                    sx={{ml: 'auto'}}
                                    size='small'
                                    onClick={() => {
                                        //setOpenDialog(true)
                                        editModel()
                                    }}
                                    startIcon={<ModeEditIcon/>}>
                                {t('editModel')}
                            </Button>}
                    </Stack>
                    <Box className="list-container">
                        {
                            drugs.length > 0 ?
                                drugs.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <DrugListCard data={item}
                                                      remove={remove}
                                                      disabled={update > -1}
                                                      edit={edit}
                                                      t={t}/>
                                    </React.Fragment>
                                )) :
                                <Card className='loading-card'>
                                    <Stack spacing={2}>
                                        <Typography alignSelf="center">
                                            {t("list_empty")}
                                        </Typography>
                                        <List>
                                            {
                                                Array.from({length: 3}).map((_, idx) =>
                                                    idx === 0 ? <ListItem key={idx} sx={{py: .5}}>
                                                            <Skeleton width={300} height={8} variant="rectangular"/>
                                                        </ListItem> :
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
                    title={t('modelName')}
                    dialogClose={handleCloseDialog}
                    actionDialog={
                        <DialogActions>
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
                    }/>

        </MedicalPrescriptionDialogStyled>
    )
}

export default MedicalPrescriptionDialog