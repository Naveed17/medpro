import {
    Grid,
    Stack,
    Typography,
    Select,
    MenuItem,
    TextField,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    Divider, Autocomplete, Input
} from '@mui/material'
import {useFormik, Form, FormikProvider} from "formik";
import MedicalPrescriptionDialogStyled from './overrides/medicalPrescriptionDialogStyle';
import {useTranslation} from 'next-i18next'
import {DrugListCard} from '@features/card'
import AddIcon from '@mui/icons-material/Add';
import React, {useEffect, useState} from 'react';
import {useRequest} from "@app/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import * as Yup from "yup";

function MedicalPrescriptionDialog({...props}) {
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})

    const {data} = props
    const [drugs, setDrugs] = useState<PrespectionDrugModel[]>(data.state);
    const [drugsList, setDrugsList] = useState<DrugModel[]>([]);
    const [drug, setDrug] = useState<DrugModel | null>(null);

    const validationSchema = Yup.object().shape({
        dosage: Yup.string().required(),
        duration: Yup.string().required(),
        durationType: Yup.string().required()
    });

    const formik = useFormik({
        initialValues: {
            drugUuid: '',
            name: '',
            dosage: '',
            duration: '',
            durationType: '',
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
            }
        },
    });
    const router = useRouter();
    const {data: session} = useSession();
    const {data: httpDrugsResponse} = useRequest({
        method: "GET",
        url: "/api/drugs/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });


    useEffect(() => {
        setDrugsList((httpDrugsResponse as HttpResponse)?.data)
    }, [httpDrugsResponse])

    const {
        values,
        handleSubmit,
        getFieldProps,
        setFieldValue,
        resetForm
    } = formik;

    const remove = (ev: PrespectionDrugModel) => {
        const selected = drugs.findIndex(drug => drug.drugUuid === ev.drugUuid)
        drugs.splice(selected, 1);
        setDrugs([...drugs])
        data.setState([...drugs]);

        //console.log(selected);
    }

    const edit = (ev: PrespectionDrugModel) => {

        const selected = drugs.findIndex(drug => drug.drugUuid === ev.drugUuid)
        setDrug({uuid: ev.drugUuid, commercial_name: ev.name, isVerified: true})
        setFieldValue('dosage', drugs[selected].dosage)
        setFieldValue('duration', drugs[selected].duration)
        setFieldValue('durationType', drugs[selected].durationType)
        setFieldValue('note', drugs[selected].note)

    }

    function handleInputChange(value: string) {
        console.log('handle input change')
        const drg = drugsList.find(drug => drug.commercial_name === value)
        if (drg !== undefined)
            setDrug(drg);
        else setDrug({uuid: '', commercial_name: value, isVerified: false});
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
                                <Typography>{t('seeking_to_name_the_drug')}</Typography>
                                {drugsList && <Autocomplete
                                    id="cmo"
                                    value={drug}
                                    options={drugsList}
                                    getOptionLabel={(option: DrugModel) => option?.commercial_name}
                                    isOptionEqualToValue={(option, value) => option?.commercial_name === value?.commercial_name}
                                    renderInput={(params) => <TextField {...params}
                                                                        onBlur={(ev) => handleInputChange(ev.target.value)}
                                                                        placeholder={t('placeholder_drug_name')}/>}
                                />
                                }
                            </Stack>
                            <Stack spacing={1}>
                                <Typography>{t('dosage')}</Typography>
                                <TextField
                                    fullWidth
                                    placeholder={t("enter_your_dosage")}
                                    {...getFieldProps("dosage")}/>
                            </Stack>
                            <Stack spacing={1}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            fullWidth
                                            id={"duration"}
                                            size="small"
                                            type={"number"}
                                            {...getFieldProps("duration")}
                                            value={values.duration}
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
                                                    value="days"
                                                    control={<Radio size="small"/>}
                                                    label={t("day")}
                                                />
                                                <FormControlLabel
                                                    value="months"
                                                    control={<Radio size="small"/>}
                                                    label={t("month")}
                                                />
                                                <FormControlLabel
                                                    value="years"
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
                                    {...getFieldProps("note")}
                                />
                            </Stack>
                            <Button className='btn-add' size='small' type={"submit"}
                                    startIcon={
                                        <AddIcon/>
                                    }
                            >

                                {t('add_a_drug')}
                            </Button>
                        </Stack>
                    </FormikProvider>
                    <Divider orientation="vertical"/>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Typography gutterBottom>{t('drug_list')}</Typography>
                    {
                        drugs.map((item, index) => (
                            <React.Fragment key={index}>
                                <DrugListCard data={item}
                                              remove={remove}
                                              edit={edit}
                                              t={t}/>
                            </React.Fragment>
                        ))
                    }

                </Grid>
            </Grid>
        </MedicalPrescriptionDialogStyled>
    )
}

export default MedicalPrescriptionDialog