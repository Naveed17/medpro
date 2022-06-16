import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement} from "react";
import DashLayout from "@features/base/dashLayout";
import {SubHeader} from "@features/subHeader";
import {useTranslation} from "next-i18next";
import { useFormik, Form, FormikProvider } from "formik";
import {
    Typography,
    Card,
    CardContent,
    InputAdornment,
    Stack,
    Box,
    TextField,
    FormControl,
    Select,
    MenuItem,
    Grid,
    Button,
    FormControlLabel, Switch
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import {styled} from "@mui/material/styles";
import {RootStyled} from "@features/calendarToolbar";
import {CountryCodeSelect} from "@features/countryCodeSelect";
import {useRouter} from "next/router";
import * as Yup from "yup";

const FormStyled = styled(Form)(({ theme }) => ({
    '& .MuiCard-root': {
        border: 'none',
        marginBottom: theme.spacing(2),
        '& .MuiCardContent-root': {
            padding: theme.spacing(3, 2),
            paddingRight: theme.spacing(5),
        }
    },
    '& .form-control': {
        '& .MuiInputBase-root': {
            paddingLeft: theme.spacing(0.5),
            "& .MuiInputBase-input": {
                paddingLeft: 0
            },
            '& .MuiInputAdornment-root': {
                "& .MuiOutlinedInput-root": {
                    border: 'none',
                    fieldset: {
                        border: "1px solid transparent",
                        boxShadow: "none",
                    },
                    background: "transparent",
                    "&:hover": {
                        fieldset: {
                            border: "1px solid transparent",
                            boxShadow: "none",
                        },
                    },
                    "&.Mui-focused": {
                        background: "transparent",
                        fieldset: {
                            border: "1px solid transparent",
                            boxShadow: "none",
                            outline: "none",
                        },
                    },
                },
            },
        },
    },
    '& .bottom-section': {
        background: theme.palette.background.paper,
        padding: theme.spacing(1),
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(0),
        marginRight: theme.spacing(-2),
        position: 'fixed',
        bottom: 0,
        left:0,
        zIndex: 1,
        width:'100%',
        borderTop:'3px solid #f0fafe'
    }
}));

function NewPlace() {

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, "Nom est trop court")
            .max(50, "Nom est trop long")
            .required("Nom est requis"),
        address: Yup.string().required("adresse est obligatoire")
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: '',
            address: '',
            postalCode: '',
            town: '',
            phone: [
                {
                    countryCode: '',
                    phone: '',
                    hidden: false
                }
            ],
            information: ''
        },
        validationSchema,
        onSubmit: async (values, { setErrors, setSubmitting }) => {
            alert(JSON.stringify(values, null, 2));
        },
    });
    const router = useRouter();

    const {t, ready} = useTranslation("settings");
    if (!ready) return (<>loading translations...</>);
    const handleAddPhone = () => {
        const phones = [...values.phone, {
            countryCode: '',
            phone: '',
            hidden: false
        }];
        formik.setFieldValue('phone', phones);
    }
    const {values, errors, touched, handleSubmit, getFieldProps, setFieldValue} = formik;

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t('lieux.new.path')}</p>
                </RootStyled>
            </SubHeader>

            <Box bgcolor="#F0FAFF" sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>
                <FormikProvider value={formik}>
                    <FormStyled
                                autoComplete="off"
                                noValidate
                                onSubmit={handleSubmit}>
                        <Typography textTransform='uppercase' fontWeight={600} marginBottom={2} gutterBottom>
                            {t('lieux.new.lieu')}
                        </Typography>
                        <Card className='venue-card'>
                            <CardContent>
                                <Box mb={2}>
                                    <Grid container spacing={{ lg: 2, xs: 1 }} alignItems="center">
                                        <Grid item xs={12} lg={2}>
                                            <Typography textAlign={{ lg: 'right', xs: 'left' }} color="text.secondary" variant='body2' fontWeight={400}>
                                                {t('lieux.new.name')}{" "}
                                                <Typography component="span" color="error">
                                                    *
                                                </Typography>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} lg={10}>
                                            <TextField
                                                variant="outlined"
                                                placeholder={t('lieux.new.wirteName')}
                                                fullWidth
                                                helperText={touched.name && errors.name}
                                                error={Boolean(touched.name && errors.name)}
                                                required
                                                {...getFieldProps("name")}/>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box mb={2}>
                                    <Grid container spacing={{ lg: 2, xs: 1 }} alignItems="center">
                                        <Grid item xs={12} lg={2}>
                                            <Typography textAlign={{ lg: 'right', xs: 'left' }} color="text.secondary" variant='body2' fontWeight={400}>
                                                {t('lieux.new.adress')}{" "}
                                                <Typography component="span" color="error">
                                                    *
                                                </Typography>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} lg={10}>
                                            <TextField
                                                variant="outlined"
                                                placeholder={t('lieux.new.writeAdress')}
                                                fullWidth
                                                required
                                                helperText={touched.address && errors.address}
                                                error={Boolean(touched.address && errors.address)}
                                                {...getFieldProps("address")}/>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box mb={2}>
                                    <Grid container spacing={{ lg: 2, xs: 1 }} alignItems="center">
                                        <Grid item xs={12} lg={2}>
                                            <Typography textAlign={{ lg: 'right', xs: 'left' }} color="text.secondary" variant='body2' fontWeight={400}>
                                                {t('lieux.new.postal')}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} lg={10}>
                                            <Grid container spacing={{ lg: 2, xs: 1 }} alignItems="center" justifyContent={{ lg: 'space-between', xs: 'flex-start' }}>
                                                <Grid item xs={12} lg={5}>
                                                    <TextField
                                                        variant="outlined"
                                                        placeholder={t('lieux.new.writePostal')}
                                                        fullWidth
                                                        type={'number'}
                                                        required

                                                        {...getFieldProps("postalCode")}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} lg={6}>
                                                    <Stack spacing={{ lg: 2, xs: 1 }} direction={{ lg: 'row', xs: 'column' }} alignItems={{ lg: 'center', xs: 'flex-start' }}>
                                                        <Typography color="text.secondary" variant='body2' fontWeight={400}>
                                                            {t('lieux.new.ville')}
                                                        </Typography>
                                                        <FormControl size="small" fullWidth>
                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                id={"duration"}
                                                                {...getFieldProps("town")}
                                                                value={values.town}
                                                                displayEmpty={true}
                                                                sx={{ color: "text.secondary" }}
                                                                renderValue={(value) =>
                                                                    value?.length
                                                                        ? Array.isArray(value)
                                                                            ? value.join(", ")
                                                                            : value
                                                                        : t('lieux.new.selectCity')
                                                                }>
                                                                <MenuItem value="1">1</MenuItem>
                                                                <MenuItem value="2">2</MenuItem>
                                                                <MenuItem value="3">3</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Stack>

                                                </Grid>
                                            </Grid>

                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                        </Card>
                        <Typography textTransform='uppercase' fontWeight={600} marginBottom={2} gutterBottom>
                            {t('lieux.new.info')}
                        </Typography>
                        <Card>
                            <CardContent>
                                <Box mb={2}>
                                    <Grid container spacing={{ lg: 2, xs: 1 }} alignItems="center">
                                        {values.phone.map((_, index) => (
                                            <React.Fragment key={index}>
                                                <Grid item xs={12} lg={2}>
                                                    <Typography color="text.secondary" variant='body2' fontWeight={400}>
                                                        {t('lieux.new.number')}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} lg={5}>
                                                    <Stack direction='row' alignItems='center'>
                                                        <TextField
                                                            variant="outlined"
                                                            placeholder="00 000 000"
                                                            className='form-control'
                                                            fullWidth
                                                            required
                                                            {...getFieldProps(`phone[${index}].phone`)}
                                                            value={values.phone[index]?.phone}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <CountryCodeSelect selected={(v:any) => setFieldValue(`phone[${index}].countryCode`, v?.phone)} />
                                                                    </InputAdornment>
                                                                ),
                                                            }}/>
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={12} lg={5}>
                                                    <FormControlLabel control={<Switch checked={values.phone[index]?.hidden} onChange={(e)=> setFieldValue(`phone[${index}].hidden`, e.target.checked)} />} labelPlacement="start" label={t('lieux.new.hide')} />
                                                </Grid>
                                            </React.Fragment>
                                        ))}
                                        <Grid item xs={12} lg={10} ml="auto">
                                            <Button onClick={handleAddPhone} startIcon={<AddIcon />}>
                                                {t('lieux.new.addNumber')}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                        </Card>
                        <Typography textTransform='uppercase' fontWeight={600} marginBottom={2} gutterBottom>
                            {t('lieux.new.info')}
                        </Typography>
                        <Card>
                            <CardContent>
                                <Box mb={2}>
                                    <Grid container spacing={{ lg: 2, xs: 1 }} alignItems="flex-start">
                                        <Grid item xs={12} lg={2}>
                                            <Typography  color="text.secondary" variant='body2' fontWeight={400}>
                                                {t('lieux.new.access')}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} lg={9}>
                                            <TextField
                                                variant="outlined"
                                                placeholder={t('lieux.new.writeHere')}
                                                multiline
                                                rows={4}
                                                fullWidth
                                                required
                                                {...getFieldProps("information")}/>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>

                            <Stack className='bottom-section' justifyContent='flex-end' spacing={2} direction={'row'}>
                                <Button onClick={() =>router.back()}>
                                    {t('motif.dialog.cancel')}
                                </Button>
                                <Button type='submit' variant="contained" color="primary">
                                    {t('motif.dialog.save')}
                                </Button>
                            </Stack>
                        </Card>
                    </FormStyled>
                </FormikProvider>
                <Stack className='bottom-section' justifyContent='flex-end' spacing={2} direction={'row'}>
                    <Button>
                        {t('motif.dialog.cancel')}
                    </Button>
                    <Button >
                        {t('motif.dialog.save')}
                    </Button>
                </Stack>
            </Box>
        </>
    )
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu','settings']))
    }
})
export default NewPlace

NewPlace.auth = true;

NewPlace.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}
