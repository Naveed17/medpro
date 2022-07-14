import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import { Typography, Card, CardContent, FormHelperText, Stack, Box, TextField, FormControl, Select, MenuItem, Grid, Button } from '@mui/material'
import { styled, Theme } from '@mui/material/styles';
import ListCheckbox from '@themes/overrides/ListCheckbox'
import ThemeColorPicker from "@themes/overrides/ThemeColorPicker"
import React from "react";
import RadioTextImage from "@themes/overrides/RadioTextImage";
import { useTranslation } from "next-i18next";

const  PaperStyled = styled(Form)(({ theme }) => ({

    backgroundColor: theme.palette.background.default,
    borderRadius: 0,
    border: 'none',
    boxShadow: theme.customShadows.motifDialog,
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(0),
    '& .container': {
        maxHeight: 680,
        overflowY: 'auto',
        '& .MuiCard-root': {
            border: 'none',
            '& .MuiCardContent-root': {
                padding: theme.spacing(2),
            }
        }
    },
    '& .bottom-section': {
        background: theme.palette.background.paper,
        padding: theme.spacing(1),
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(-2),
        marginRight: theme.spacing(-2),
        position: 'sticky',
        bottom: 0,
        borderTop: `3px solid ${theme.palette.grey['A700']}`,
    }
}));

function EditMotifDialog({ ...props }) {

    let doctors = [
        { id: '1', name: 'Dr Anas LAOUINI', speciality: 'sexologist', img: '/static/img/men.png', selected: false },
        { id: '2', name: 'Dr Omar LAOUINI', speciality: 'Gynecologist', img: '/static/img/men.png', selected: false },
        { id: '3', name: 'Dr Anouar ABDELKAFI', speciality: 'ORL', img: '/static/img/men.png', selected: false },
    ];
    const { t, ready } = useTranslation('settings');

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, t('users.new.ntc'))
            .max(50, t('users.new.ntl'))
            .required(t('users.new.nameReq'))
    });


    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {

            name: props.data ? props.data.name as string : "",
            color: (theme: Theme) => theme.palette.primary.main,
            duration: props.data ? props.data.duration : "",
            minimumDelay: props.data ? props.data.minimumDelay : "",
            maximumDelay: props.data ? props.data.maximumDelay : "",
            typeOfMotif: {},
            doctor: doctors
        },
        validationSchema,
        onSubmit: async (values, {setErrors, setSubmitting}) => {
            alert(JSON.stringify(values, null, 2));
        },
    });
    if (!ready) return (<>loading translations...</>);

    const types = [
        { id: 1, text: t('motif.dialog.enligne'), name: 'teleconsult' },
        { id: 2, text: t('motif.dialog.cabinet'), name: 'cabinet' },
        { id: 3, text: t('motif.dialog.domicile'), name: 'domicile' },
        { id: 4, text: t('motif.dialog.pro'), name: 'professionnels' },
    ]

    const { values, errors, touched, handleSubmit, getFieldProps, setFieldValue } = formik;

    return (
        <FormikProvider value={formik}>
            <PaperStyled autoComplete="off"
                noValidate
                className='root'
                onSubmit={handleSubmit}>

                <Typography variant="h6" gutterBottom>
                    {props.data ? t('motif.dialog.update') : t('motif.dialog.add')}
                </Typography>
                <Typography variant="body1" fontWeight={400} margin={'16px 0'} gutterBottom>
                    {t('motif.dialog.info')}
                </Typography>
                <Card>
                    <CardContent>
                        <Stack spacing={2}>
                            <Stack spacing={2} direction="row">
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Color{" "}
                                        <Typography component="span" color="error">
                                            *
                                        </Typography>
                                    </Typography>
                                    <ThemeColorPicker onSellectColor={(v: string) => setFieldValue('color', v)} />

                                    {touched.color && errors.color && (
                                        <FormHelperText error sx={{ mx: 0 }}>
                                            {Boolean(touched.color && errors.color)}
                                        </FormHelperText>
                                    )}
                                </Box>
                                <Box width={1}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {t('motif.dialog.nom')}{" "}
                                        <Typography component="span" color="error">
                                            *
                                        </Typography>
                                    </Typography>
                                    <TextField
                                        variant="outlined"
                                        placeholder={t('motif.dialog.tapez')}
                                        required
                                        fullWidth
                                        helperText={touched.name && errors.name}
                                        {...getFieldProps("name")}
                                        error={Boolean(touched.name && errors.name)}

                                    />
                                </Box>
                            </Stack>
                            <FormControl size="small" fullWidth>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {t('motif.dialog.duree')}
                                </Typography>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id={"duration"}
                                    {...getFieldProps("duration")}
                                    value={values.duration}
                                    displayEmpty={true}
                                    sx={{color: "text.secondary"}}
                                    /*
                                     renderValue={(value) =>
                                                              value?.length
                                                                                ? Array.isArray(value)
                                                                                    ? value.join(", ")
                                                                                    : value
                                                                                : t('motif.dialog.selectGroupe')
                                                                        }
                                                                        */
                                >
                                    {
                                        props.durations.map((duration: DurationModel) =>
                                            (<MenuItem key={duration.value} value={duration.value}>
                                                {duration.date + ' ' + t('common:times.' + duration.unity)}
                                            </MenuItem>))
                                    }
                                </Select>
                            </FormControl>
                            <Stack spacing={2} direction={{ xs: 'column', lg: 'row' }}>
                                <Box width={1}>
                                    <FormControl size="small" fullWidth>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {t('motif.dialog.delaiMin')}
                                        </Typography>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id={"minimumDelay"}
                                            {...getFieldProps("minimumDelay")}
                                            value={values.minimumDelay}
                                            displayEmpty={true}
                                            sx={{color: "text.secondary"}}
                                           /* renderValue={(value) =>
                                                value?.length
                                                    ? Array.isArray(value)
                                                        ? value.join(", ")
                                                        : value
                                                    : t('motif.dialog.selectGroupe')
                                            }*/
                                        >
                                            {
                                                props.delay.map((duration: DurationModel) =>
                                                    (<MenuItem key={duration.value} value={duration.value}>
                                                        {duration.date + ' ' + t('common:times.' + duration.unity)}
                                                    </MenuItem>))
                                            }
                                        </Select>
                                    </FormControl>

                                </Box>
                                <Box width={1}>
                                    <FormControl size="small" fullWidth>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {t('motif.dialog.delaiMax')}
                                        </Typography>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id={"maximumDelay"}
                                            {...getFieldProps("maximumDelay")}
                                            value={values.maximumDelay}
                                            displayEmpty={true}
                                            sx={{color: "text.secondary"}}
                                            /*                                            renderValue={(value) =>
                                                                                            value?.length
                                                                                                ? Array.isArray(value)
                                                                                                    ? value.join(", ")
                                                                                                    : value
                                                                                                : t('motif.dialog.selectGroupe')
                                                                                        }*/
                                        >
                                            {
                                                props.delay.map((duration: DurationModel) =>
                                                    (<MenuItem key={duration.value} value={duration.value}>
                                                        {duration.date + ' ' + t('common:times.' + duration.unity)}
                                                    </MenuItem>))
                                            }
                                        </Select>
                                    </FormControl>

                                </Box>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
                <Box mt={2}>
                    <Typography variant="body1" fontWeight={400} margin={'16px 0'} gutterBottom>
                        {t('motif.dialog.type')}
                    </Typography>
                    <Card>
                        <CardContent>
                            {types.map((item, index) => (
                                <ListCheckbox key={index} data={item} onChange={(v: any) => {
                                    setFieldValue('typeOfMotif', { ...values.typeOfMotif, [item.name]: v })
                                }} />
                            ))}
                        </CardContent>
                    </Card>
                </Box>
                <Box mt={2}>
                    <Typography variant="body1" fontWeight={400} margin={'16px 0'} gutterBottom>
                        {t('motif.dialog.medecin')}
                    </Typography>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom margin={'16px 0'}>{t('motif.dialog.selectCalander')}</Typography>
                            <Grid container spacing={2}>
                                {values.doctor.map((doctor, index) => (
                                    <Grid key={index} item xs={12} lg={6}>
                                        <RadioTextImage
                                            doctor={doctor}
                                            onChange={(v: any) => {
                                                const newArr = values.doctor.map(obj => {
                                                    if (obj.id === v.id) {
                                                        return { ...obj, selected: !v.selected };
                                                    }
                                                    return obj;
                                                });
                                                setFieldValue('doctor', newArr)
                                            }}
                                            fullWidth
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>

                <Stack className='bottom-section' justifyContent='flex-end' spacing={2} direction={'row'}>
                    <Button onClick={props.closeDraw}>
                        {t('motif.dialog.cancel')}
                    </Button>
                    <Button type='submit' variant="contained" color="primary">
                        {t('motif.dialog.save')}
                    </Button>
                </Stack>

            </PaperStyled>
        </FormikProvider>
    )
}

export default EditMotifDialog;
