import { Grid, Stack, Typography, Select, MenuItem, TextField, FormControl, RadioGroup, FormControlLabel, Radio, Button, Divider } from '@mui/material'
import { useFormik, Form, FormikProvider } from "formik";
import AddTreatmentDialogStyled from './overrides/addTreatmentDialogStyle';
import { useTranslation } from 'next-i18next'
import { DrugListCard, drugListCardData } from '@features/card'
import AddIcon from '@mui/icons-material/Add';
import React from 'react';
function AddTreatmentDialog() {
    const { t, ready } = useTranslation("consultation", { keyPrefix: "consultationIP" })
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
    const { values, getFieldProps, handleSubmit } = formik;
    if (!ready) return <>loading translations...</>;
    return (
        <AddTreatmentDialogStyled>
            <Grid container spacing={5}>
                <Grid item xs={12} md={7}>
                    <FormikProvider value={formik}>
                        <Stack
                            spacing={2}
                            component={Form}
                            autoComplete="off"
                            noValidate
                            onSubmit={handleSubmit}
                        >
                            <Stack spacing={1}>
                                <Typography>{t('seeking_to_name_the_drug')}</Typography>
                                <Select
                                    fullWidth
                                    labelId="demo-simple-select-label"
                                    id={"name"}
                                    size="small"
                                    {...getFieldProps("name")}
                                    value={values.name}
                                    displayEmpty={true}
                                    sx={{ color: "text.secondary" }}
                                    renderValue={(value) =>
                                        value?.length
                                            ? Array.isArray(value)
                                                ? value.join(",")
                                                : value
                                            : t("placeholder_drug_name")
                                    }
                                >
                                    <MenuItem value="1">1</MenuItem>
                                    <MenuItem value="2">2</MenuItem>
                                    <MenuItem value="3">3</MenuItem>
                                </Select>
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
                                            sx={{ color: "text.secondary" }}
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
                                                    control={<Radio size="small" />}
                                                    label={t("day")}
                                                />
                                                <FormControlLabel
                                                    value="month"
                                                    control={<Radio size="small" />}
                                                    label={t("month")}
                                                />
                                                <FormControlLabel
                                                    value="year"
                                                    control={<Radio size="small" />}
                                                    label={t("year")}
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>

                                </Grid>
                            </Stack>
                            <Button className='btn-add' size='small'
                                startIcon={
                                    <AddIcon />
                                }
                            >

                                {t('add_a_drug')}
                            </Button>
                        </Stack>
                    </FormikProvider>
                    <Divider orientation="vertical" />
                </Grid>
                <Grid item xs={12} md={5}>
                    <Typography gutterBottom>{t('drug_list')}</Typography>
                    {
                        drugListCardData.map((item, index) => (
                            <React.Fragment key={index}>
                                <DrugListCard data={item} t={t} />
                            </React.Fragment>
                        ))
                    }

                </Grid>
            </Grid>
        </AddTreatmentDialogStyled>
    )
}

export default AddTreatmentDialog