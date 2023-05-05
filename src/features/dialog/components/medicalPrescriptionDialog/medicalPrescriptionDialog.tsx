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
    Typography, useMediaQuery
} from '@mui/material';
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
import {useSnackbar} from "notistack";
import {useAppSelector} from "@app/redux/hooks";
import {consultationSelector} from "@features/toolbar";
import {LoadingScreen} from "@features/loadingScreen";
import {Theme} from "@mui/material/styles";
import RedoIcon from '@mui/icons-material/Redo';
import {SwitchPrescriptionUI} from "@features/buttons";

function MedicalPrescriptionDialog({...props}) {
    const {data} = props;
    const {handleSwitchUI = null} = data;
    const {data: session} = useSession();
    const {enqueueSnackbar} = useSnackbar();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
    const router = useRouter();

    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    const {appointement} = useAppSelector(consultationSelector);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [drugs, setDrugs] = useState<any[]>([...data.state]);
    const [drugsList, setDrugsList] = useState<DrugModel[]>([]);
    const [drug, setDrug] = useState<DrugModel | null>(null);
    const [update, setUpdate] = useState<number>(-1);
    const [model, setModel] = useState<string>('');
    const [parentModels, setParentModels] = useState<any[]>([]);
    const [models, setModels] = useState<any[]>([]);
    const [selectedModel, setSelectedModel] = useState<PrescriptionModalModel | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [lastPrescriptions, setLastPrescriptions] = useState<any[]>([]);
    const [touchedFileds, setTouchedFileds] = useState({name: false, duration: false});

    const validationSchema = Yup.object().shape({
        /*dosage: Yup.string().required(),
        duration: Yup.string().required(),
        durationType: Yup.string().required()*/
    });

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const open = Boolean(anchorEl);

    const {trigger} = useRequestMutation(null, "/drugs");

    const {data: httpDrugsResponse} = useRequest({
        method: "GET",
        url: `/api/drugs/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });


    const {data: httpModelResponse, mutate} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/prescriptions/modals/parents/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    const handleSaveDialog = () => {
        const form = new FormData();
        form.append('globalNote', "");
        form.append('name', model);
        form.append('drugs', JSON.stringify(drugs));
        trigger({
            method: "POST",
            url: `/api/medical-entity/${medical_entity.uuid}/prescriptions/modals/${router.locale}`,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }, {
            revalidate: true,
            populateCache: true
        }).then((cnx) => {
            mutate().then(() => {
                setDrugsList((cnx?.data as HttpResponse)?.data)
            });
        })
        setOpenDialog(false);
    }

    const editModel = () => {
        if (selectedModel) {
            const form = new FormData();
            form.append('drugs', JSON.stringify(drugs));
            form.append('name', selectedModel.name);
            form.append('parent', parentModels.find(parent => parent.prescriptionModels.some((drug: any) => drug.uuid === selectedModel?.uuid))?.uuid);

            trigger({
                method: "PUT",
                url: `/api/medical-entity/${medical_entity.uuid}/prescriptions/modals/${selectedModel?.uuid}/${router.locale}`,
                data: form,
                headers: {Authorization: `Bearer ${session?.accessToken}`}
            }, {
                revalidate: true,
                populateCache: true
            }).then((cnx) => {
                mutate().then(() => {
                    setDrugsList((cnx?.data as HttpResponse)?.data)
                    setSelectedModel(null)
                    enqueueSnackbar(t("editWithsuccess"), {variant: 'success'})
                });
            })
            setOpenDialog(false);
        }
    }

    const removeModel = () => {
        if (selectedModel) {
            trigger({
                method: "DELETE",
                url: `/api/medical-entity/${medical_entity.uuid}/prescriptions/modals/${selectedModel?.uuid}/${router.locale}`,
                headers: {Authorization: `Bearer ${session?.accessToken}`}
            }, {
                revalidate: true,
                populateCache: true
            }).then((cnx) => {
                mutate().then(() => {
                    setDrugsList((cnx?.data as HttpResponse)?.data)
                    setDrugs([]);
                    setSelectedModel(null)
                    enqueueSnackbar(t("removeWithsuccess"), {variant: 'success'})
                });
            })
            setOpenDialog(false);
        }
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

    const remove = (ev: PrespectionDrugModel) => {

        const selected = drugs.findIndex(drug => drug.drugUuid === ev.drugUuid)
        drugs.splice(selected, 1);
        setDrugs([...drugs])
        data.setState([...drugs]);
    }

    const importLast = () => {
        const last: any[] = [];
        lastPrescriptions[0].prescription[0].prescription_has_drugs.map((drug: any) => {
            last.push({
                drugUuid: drug.standard_drug.uuid,
                name: drug.standard_drug.commercial_name,
                dosage: drug.cycles[0].dosage,
                duration: drug.cycles[0].duration,
                durationType: drug.cycles[0].durationType,
                note: drug.cycles[0].note
            });
        })
        setDrugs([...last])
        data.setState([...last])
        setAnchorEl(null);
    }

    const edit = (ev: PrespectionDrugModel) => {
        const selected = drugs.findIndex(drug => drug.drugUuid === ev.drugUuid)
        setUpdate(selected);
        setDrug({uuid: ev.drugUuid, commercial_name: ev.name, isVerified: true})
        setFieldValue('cycles[0].dosage', drugs[selected].cycles[0].dosage)
        setFieldValue('cycles[0].duration', drugs[selected].cycles[0].duration)
        setFieldValue('cycles[0].durationType', drugs[selected].cycles[0].durationType)
        setFieldValue('cycles[0].note', drugs[selected].cycles[0].note)
    }

    const handleInputChange = (value: string) => {
        touchedFileds.name = true;
        setTouchedFileds({...touchedFileds});
        const drg = drugsList.find(drug => drug.commercial_name === value)
        if (drg !== undefined) {
            setDrug(drg);
        } else setDrug({uuid: '', commercial_name: value, isVerified: false});
    }

    const formik = useFormik({
        initialValues: {
            drugUuid: '',
            name: '',
            cycles: [{
                dosage: '',
                duration: '',
                durationType: 'day',
                note: '',
                isOtherDosage: true
            }]
        },
        onSubmit: async (values) => {
            if (drug) {
                drugs.push({...values, drugUuid: drug.uuid, name: drug.commercial_name})
                setDrugs([...drugs])
                data.setState([...drugs])
                setDrug(null)
                resetForm();

                setTimeout(() => {
                    setTouchedFileds({name: false, duration: false})
                }, 0)
            } else {
                touchedFileds.name = true;
                setTouchedFileds({...touchedFileds});
            }
        },
    });

    const {
        values,
        errors,
        touched,
        setFieldTouched,
        handleSubmit,
        getFieldProps,
        setFieldValue,
        resetForm
    } = formik;


    useEffect(() => {
        if (httpModelResponse) {
            const parentModelsData = (httpModelResponse as HttpResponse).data;
            setParentModels(parentModelsData);
            let models: any[] = []
            parentModelsData.map((parent: any) => {
                models = [...models, ...parent.prescriptionModels];
            });
            setModels(models);
        }
    }, [httpModelResponse])

    useEffect(() => {
        let lastPrescription: any[] = []
        appointement.latestAppointments.map((la: { documents: any[]; }) => {
            const prescriptions = la.documents.filter(doc => doc.documentType === "prescription");
            if (prescriptions.length > 0) {
                lastPrescription = [...lastPrescription, ...prescriptions]
            }
        })
        setLastPrescriptions(lastPrescription)
    }, [appointement])

    useEffect(() => {
        if (Object.keys(errors).length > 0)
            setTouchedFileds({name: true, duration: true})
    }, [errors]);

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <MedicalPrescriptionDialogStyled>
            <SwitchPrescriptionUI {...{t, handleSwitchUI}} />
            <Grid container spacing={5}>
                <Grid className={"grid-container"} item xs={12} md={7}>
                    <FormikProvider value={formik}>
                        <Stack
                            spacing={2}
                            component={Form}
                            autoComplete="off"
                            noValidate
                            onSubmit={handleSubmit}>
                            <Stack spacing={1}>
                                <Stack direction={"row"} alignItems="center">
                                    {!isMobile && <Typography>{t('seeking_to_name_the_drug')}
                                        <Typography component="span" color="error">
                                            *
                                        </Typography>
                                    </Typography>}


                                    {(models.length > 0 || lastPrescriptions.length > 0) && <Button
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
                                    </Button>}
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
                                            lastPrescriptions.length > 0 &&
                                            <MenuItem sx={{color: theme => theme.palette.grey[0]}}
                                                      onClick={importLast}>{t('last_prescription')}</MenuItem>
                                        }
                                        {
                                            models.map((item, idx) =>
                                                <MenuItem key={idx} sx={{color: theme => theme.palette.grey[0]}}
                                                          onClick={() => {
                                                              setSelectedModel(item);
                                                              setDrugs(item.prescriptionModalHasDrugs);
                                                              data.setState(item.prescriptionModalHasDrugs);
                                                              setAnchorEl(null);
                                                          }}>{item.name}</MenuItem>
                                            )
                                        }
                                    </Menu>
                                </Stack>
                                {drugsList && <Autocomplete
                                    id="cmo"
                                    value={drug}
                                    size='small'
                                    options={drugsList}
                                    noOptionsText={t('startWriting')}
                                    getOptionLabel={(option: DrugModel) => option?.commercial_name}
                                    isOptionEqualToValue={(option, value) => option?.commercial_name === value?.commercial_name}
                                    renderInput={(params) => <TextField {...params}
                                                                        error={touchedFileds.name && drug === null}
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
                                                                        placeholder={t('placeholder_drug_name')}/>}/>
                                }
                            </Stack>
                            <Stack spacing={1}>
                                <Typography>{t('dosage')}
                                    {/*<Typography component="span" color="error">
                                        *
                                    </Typography>*/}
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder={t("enter_your_dosage")}
                                    //helperText={touched.dosage && errors.dosage}
                                    error={Boolean(touched.cycles && touched.cycles[0].dosage && errors.cycles && (errors.cycles[0] as any).dosage)}
                                    {...getFieldProps("cycles[0].dosage")} />

                            </Stack>

                            <Stack spacing={1}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            fullWidth
                                            id={"duration"}
                                            size="small"
                                            type={"number"}
                                            error={touchedFileds.duration && values.cycles[0].duration === ''}
                                            {...getFieldProps("cycles[0].duration")}
                                            value={values.cycles[0].duration}
                                            InputProps={{inputProps: {min: 1}}}
                                            onBlur={() => {
                                                touchedFileds.duration = true;
                                                setTouchedFileds({...touchedFileds});
                                            }}
                                            placeholder={t("duration")}
                                            sx={{color: "text.secondary"}}/>
                                    </Grid>
                                    <Grid item xs={12} md={9}>
                                        <FormControl component="fieldset">
                                            <RadioGroup
                                                row
                                                aria-label="date"
                                                {...getFieldProps("cycles[0].durationType")}
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
                            </Stack>
                            <Stack spacing={1}>
                                <Typography>{t('cautionary_note')}</Typography>
                                <TextField
                                    fullWidth
                                    placeholder={t("cautionary_note")}
                                    {...getFieldProps("cycles[0].note")}
                                />
                            </Stack>
                            <Grid container justifyContent={"flex-end"}>
                                {
                                    update > -1 ? <Button variant="contained" color={"warning"}
                                                          onClick={() => {
                                                              if (drug) {
                                                                  values.drugUuid = drug.uuid as string
                                                                  values.name = drug.commercial_name
                                                                  drugs[update] = values
                                                                  setDrugs([...drugs])
                                                                  data.setState([...drugs])
                                                                  setDrug(null)
                                                                  resetForm()

                                                                  setTimeout(() => {
                                                                      setFieldTouched("cycles[0].dosage", false, true)
                                                                      setTouchedFileds({name: false, duration: false})
                                                                  }, 0)

                                                                  setUpdate(-1)
                                                              }
                                                          }}>
                                            {t('updateDrug')}
                                        </Button> :
                                        <Button variant="contained" endIcon={<RedoIcon/>} type={"submit"}>
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
                        <Typography gutterBottom>{t('drug_list')} {selectedModel && selectedModel.name}</Typography>
                        {
                            drugs.length > 0 && selectedModel === null &&
                            <Button className='btn-add' sx={{ml: 'auto'}} size='small' onClick={() => {
                                setOpenDialog(true)
                            }}
                                    startIcon={<AddIcon/>}>
                                {t('createAsModel')}
                            </Button>
                        }
                        {
                            drugs.length > 0 && selectedModel !== null &&
                            <Box sx={{ml: "auto"}}>
                                <Button className='btn-add'
                                        size='small'
                                        onClick={() => {
                                            editModel()
                                        }}
                                        endIcon={<ModeEditIcon/>}>
                                    {t('editModel')}
                                </Button>
                                <Button className='btn-add'
                                        size='small'
                                        color={"error"}
                                        onClick={() => {
                                            removeModel()
                                        }}
                                        endIcon={<Icon path="setting/icdelete"/>}>
                                    {t('removeModel')}
                                </Button>

                            </Box>
                        }
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
