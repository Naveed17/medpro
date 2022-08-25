import { Grid, Stack, Typography, Select, MenuItem, Button, Card, IconButton, Autocomplete, TextField } from '@mui/material'
import { useFormik, Form, FormikProvider } from "formik";
import BalanceSheetDialogStyled from './overrides/balanceSheetDialogStyle';
import { useTranslation } from 'next-i18next'
import AddIcon from '@mui/icons-material/Add';
import Icon from '@themes/urlIcon'
import React, { useState } from 'react';
const data = [
    { label: 'lable-1', year: 2021 },
    { label: 'lable-2', year: 2021 },
    { label: 'lable-3', year: 2021 },
]
function MedicalPrescriptionDialog() {
    const { t, ready } = useTranslation("consultation", { keyPrefix: "consultationIP" })
    const formik = useFormik({
        initialValues: {
            name: '',
        },
        onSubmit: async (values) => {
        },
    });
    console.log(formik.values)
    const { values, handleSubmit, setFieldValue } = formik;
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
                            onSubmit={handleSubmit}
                        >
                            <Stack spacing={1}>
                                <Typography>{t('please_name_the_balance_sheet')}</Typography>
                                <Autocomplete
                                    disablePortal
                                    id="name_balance_sheet"
                                    disableClearable
                                    size='small'
                                    onChange={(object, value) => setFieldValue('name', value?.label)}
                                    isOptionEqualToValue={(option, value) => option.label === value.label}
                                    options={data}
                                    renderInput={(params) => <TextField {...params} placeholder={
                                        t('placeholder_balance_sheet_name')
                                    } />}
                                />
                            </Stack>
                            <Button className='btn-add' size='small'
                                startIcon={
                                    <AddIcon />
                                }
                            >

                                {t('add_balance_sheet')}
                            </Button>
                        </Stack>
                    </FormikProvider>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Typography gutterBottom>{t('balance_sheet_list')}</Typography>
                    {
                        [1, 2, 3].map((item, index) => (
                            <Card key={index}>
                                <Stack p={1} direction='row' alignItems="center" justifyContent='space-between'>
                                    <Typography>Anticorps anti-nucléares</Typography>
                                    <IconButton size="small">
                                        <Icon path="setting/icdelete" />
                                    </IconButton>
                                </Stack>
                            </Card>
                        ))}
                </Grid>
            </Grid>
        </BalanceSheetDialogStyled>
    )
}

export default MedicalPrescriptionDialog