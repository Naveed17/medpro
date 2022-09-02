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
    Divider
} from '@mui/material'
import {useFormik, Form, FormikProvider} from "formik";
import MedicalPrescriptionDialogStyled from './overrides/medicalPrescriptionDialogStyle';
import {useTranslation} from 'next-i18next'
import {DrugListCard, drugListCardData} from '@features/card'
import AddIcon from '@mui/icons-material/Add';
import React, {useState} from 'react';
import {useRequest, useRequestMutation} from "@app/axios";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import Autocomplete from '@mui/material/Autocomplete';
import {MultiSelect} from "@features/multiSelect";

function MedicalPrescriptionDialog() {
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    const formik = useFormik({
        initialValues: {
            name: '',
            dosage: '',
            duration: '',
            date: "",
            note: ''
        },
        onSubmit: async (values) => {
        },
    });
    const {trigger} = useRequestMutation(null, "/drugs");
    const router = useRouter();
    const {data: session} = useSession();
    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const {data: httpDrugsResponse, error: errorHttpMedicalProfessional} = useRequest({
        method: "GET",
        url: "/api/drugs/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    const {values, getFieldProps, handleSubmit} = formik;
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

                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    freeSolo
                                    style={{paddingTop:0,paddingBottom: 0}}
                                    options={(httpDrugsResponse as HttpResponse)?.data}
                                    getOptionLabel={(option:any) => option['commercial_name']}
                                    isOptionEqualToValue={(option, value) => option['commercial_name'] === value['commercial_name']}
                                    renderInput={(params) => <TextField {...params}
                                                                        placeholder={t('placeholder_drug_name')}/>}
                                />
                            </Stack>
                            <Stack spacing={1}>
                                <Typography>{t('dosage')}</Typography>
                                <TextField
                                    fullWidth
                                    placeholder={t("enter_your_dosage")}
                                    {...getFieldProps("dosage")}
                                />
                            </Stack>
                            <Stack spacing={1}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={3}>
                                        <Select
                                            fullWidth
                                            labelId="demo-simple-select-label"
                                            id={"duration"}
                                            size="small"
                                            {...getFieldProps("duration")}
                                            value={values.duration}
                                            displayEmpty={true}
                                            sx={{color: "text.secondary"}}
                                            renderValue={(value) =>
                                                value?.length
                                                    ? Array.isArray(value)
                                                        ? value.join(",")
                                                        : value
                                                    : t("duration")
                                            }
                                        >
                                            <MenuItem value="1">1</MenuItem>
                                            <MenuItem value="2">2</MenuItem>
                                            <MenuItem value="3">3</MenuItem>
                                        </Select>
                                    </Grid>
                                    <Grid item xs={12} md={9}>
                                        <FormControl component="fieldset">
                                            <RadioGroup
                                                row
                                                aria-label="date"
                                                {...getFieldProps("date")}
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
                                    {...getFieldProps("note")}
                                />
                            </Stack>
                            <Button className='btn-add' size='small'
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
                        drugListCardData.map((item, index) => (
                            <React.Fragment key={index}>
                                <DrugListCard data={item} t={t}/>
                            </React.Fragment>
                        ))
                    }

                </Grid>
            </Grid>
        </MedicalPrescriptionDialogStyled>
    )
}

export default MedicalPrescriptionDialog