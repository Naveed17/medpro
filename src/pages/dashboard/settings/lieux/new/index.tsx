import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useState} from "react";
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
    FormControlLabel, Switch, Collapse, Paper
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import {styled} from "@mui/material/styles";
import {RootStyled} from "@features/toolbar/components/calendarToolbar";
import {CountryCodeSelect} from "@features/countryCodeSelect";
import {useRouter} from "next/router";
import * as Yup from "yup";
import IconUrl from "@themes/urlIcon";
import TimePicker from "@themes/overrides/TimePicker"
import {DashLayout} from "@features/base";
import {Otable} from "@features/table";

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

    const {t, ready} = useTranslation("settings");

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, t('users.new.ntc'))
            .max(50, t('users.new.ntl'))
            .required(t('users.new.nameReq')),
        address: Yup.string().required(t('lieux.new.adreq'))
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
        onSubmit: async (values, {setErrors, setSubmitting}) => {
            alert(JSON.stringify(values, null, 2));
        },
    });
    const router = useRouter();
    const [horaires, setHoraires] = useState([
        {
            day: 'lundi',
            hours: [{start: '08:00', end: '14:00'}, {start: '16:00', end: '18:00'}],
            opened: true
        },
        {
            day: 'mardi',
            hours: [{start: '08:00', end: '14:00'}, {start: '16:00', end: '18:00'}],
            opened: true
        },
        {
            day: 'mercredi',
            hours: null,
            opened: false
        },
        {
            day: 'jeudi',
            hours: [{start: '08:00', end: '14:00'}, null],
            opened: true
        },
        {
            day: 'vendredi',
            hours: [null,{start: '08:00', end: '14:00'}],
            opened: true
        },
        {
            day: 'samedi',
            hours: null,
            opened: false
        },
        {
            day: 'dimanche',
            hours: [{start: '08:00', end: '14:00'}],
            opened: true
        }
    ])
    const [rows, setRows] = useState([
        {
            id: 1,
            name: 'Salma Bousaiid',
            type: 'Sécrétaire',
            access: 3
        },
        {
            id: 2,
            name: 'Rym Jablaoui',
            type: 'Sécrétaire',
            access: 1
        }
    ]);

    if (!ready) return (<>loading translations...</>);

    const headCells = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: t('lieux.new.user'),
            align: 'left',
            sortable: true,
        },
        {
            id: 'access',
            numeric: false,
            disablePadding: true,
            label: t('lieux.new.userPermission'),
            align: 'left',
            sortable: false,
        }
    ];

    const editPlaces = (props: any) => {
        console.log('edit', props);
    }
    const handleConfig = (props: any, event: string) => {
        console.log('handleConfig', event);
    }

    const handleChange = (props: any, event: any) => {
        props.access=event.target.value
        rows.filter(row => row.id === props.id)[0].access = event.target.value
        setRows([...rows])
    }

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
                                    <Grid container spacing={{lg: 2, xs: 1}} alignItems="center">
                                        <Grid item xs={12} lg={2}>
                                            <Typography textAlign={{lg: 'right', xs: 'left'}} color="text.secondary"
                                                        variant='body2' fontWeight={400}>
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
                                    <Grid container spacing={{lg: 2, xs: 1}} alignItems="center">
                                        <Grid item xs={12} lg={2}>
                                            <Typography textAlign={{lg: 'right', xs: 'left'}} color="text.secondary"
                                                        variant='body2' fontWeight={400}>
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
                                    <Grid container spacing={{lg: 2, xs: 1}} alignItems="center">
                                        <Grid item xs={12} lg={2}>
                                            <Typography textAlign={{lg: 'right', xs: 'left'}} color="text.secondary"
                                                        variant='body2' fontWeight={400}>
                                                {t('lieux.new.postal')}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} lg={10}>
                                            <Grid container spacing={{lg: 2, xs: 1}} alignItems="center"
                                                  justifyContent={{lg: 'space-between', xs: 'flex-start'}}>
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
                                                    <Stack spacing={{lg: 2, xs: 1}}
                                                           direction={{lg: 'row', xs: 'column'}}
                                                           alignItems={{lg: 'center', xs: 'flex-start'}}>
                                                        <Typography color="text.secondary" variant='body2'
                                                                    fontWeight={400}>
                                                            {t('lieux.new.ville')}
                                                        </Typography>
                                                        <FormControl size="small" fullWidth>
                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                id={"duration"}
                                                                {...getFieldProps("town")}
                                                                value={values.town}
                                                                displayEmpty={true}
                                                                sx={{color: "text.secondary"}}
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
                                    <Grid container spacing={{lg: 2, xs: 1}} alignItems="center">
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
                                                                        <CountryCodeSelect
                                                                            selected={(v: any) => setFieldValue(`phone[${index}].countryCode`, v?.phone)}/>
                                                                    </InputAdornment>
                                                                ),
                                                            }}/>
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={12} lg={5}>
                                                    <FormControlLabel
                                                        control={<Switch checked={values.phone[index]?.hidden}
                                                                         onChange={(e) => setFieldValue(`phone[${index}].hidden`, e.target.checked)}/>}
                                                        labelPlacement="start" label={t('lieux.new.hide')}/>
                                                </Grid>
                                            </React.Fragment>
                                        ))}
                                        <Grid item xs={12} lg={10} ml="auto">
                                            <Button onClick={handleAddPhone} startIcon={<AddIcon/>}>
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
                                    <Grid container spacing={{lg: 2, xs: 1}} alignItems="flex-start">
                                        <Grid item xs={12} lg={2}>
                                            <Typography color="text.secondary" variant='body2' fontWeight={400}>
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
                        </Card>

                        <Typography textTransform='uppercase' fontWeight={600} marginBottom={2} gutterBottom>
                            {t('lieux.new.horaire')}
                        </Typography>

                        {horaires.map((value: any, ind) => (
                            <Card key={ind}
                                  sx={{
                                      border: "1px solid #E4E4E4",
                                      boxShadow: "none",
                                      bgcolor: "#FCFCFC",
                                      mt: 2,
                                  }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        px: 1,
                                    }}>
                                    <Typography
                                        variant="body1"
                                        color="text.primary"
                                        fontWeight={600}
                                        sx={{textTransform: "uppercase", margin: '13px 15px'}}>
                                        {value.day}
                                    </Typography>

                                    <Switch
                                        onChange={(e) => {
                                            const day = horaires.findIndex(d => d.day === value.day)
                                            horaires[day].opened = e.target.checked
                                            if (horaires[day].hours === null)
                                                horaires[day].hours = [{start: '', end: ''}]
                                            setHoraires([...horaires])
                                        }
                                        }
                                        checked={value.opened}
                                    />
                                </Box>

                                <Collapse
                                    in={value.opened} sx={{bgcolor: "common.white", borderTop: "1px solid #C9C8C8"}}>
                                    <Paper sx={{borderRadius: 0, border: "none", px: 1, my: 2}}>
                                        {value.hours?.map((hour: any, i: number) => (
                                            <Grid container spacing={1} alignItems="center" sx={{mt: 1}} key={i}>
                                                {hour && <Grid item lg={3} md={3} sm={12} xs={4}>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            svg: {mr: 1},
                                                            justifyContent: "end",
                                                        }}>
                                                        <IconUrl path="ic-time"/>
                                                        <Typography variant="body2" color="text.primary">
                                                            {i + 1 > 1 ? i + 1 + 'em seance' : '1er seance'}
                                                        </Typography>
                                                    </Box>
                                                </Grid>}
                                                {hour && <Grid item lg={4} md={6} sm={12} xs={12}>
                                                    <TimePicker
                                                        defaultValue={[hour.start ? new Date("2013/1/16 " + hour.start) : '', hour.end ? new Date("2013/1/16 " + hour.end) : '']}
                                                        onChange={(s: any, e: any) => console.log(s, e)}
                                                    />
                                                </Grid>}
                                                {i > 0 && (
                                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                                        <Button
                                                            variant="text"
                                                            color="error"
                                                            size="small"
                                                            sx={{
                                                                svg: { width: 15 },
                                                                path: { fill: (theme) => theme.palette.error.main },
                                                            }}
                                                            startIcon={<IconUrl path="icdelete" />}
                                                            onClick={() =>{
                                                                value.hours.splice(i,1);
                                                                setHoraires([...horaires])
                                                                }}>
                                                            {t('lieux.new.remove')}
                                                        </Button>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        ))}

                                        <Grid container justifyContent="center">
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <Button
                                                    onClick={() => {
                                                        const day = horaires.findIndex(d => d.day === value.day)
                                                        horaires[day].hours?.push({start: '', end: ''});
                                                        setHoraires([...horaires])
                                                    }}
                                                    variant="contained"
                                                    color="success"
                                                    sx={{mt: 1}}>
                                                    {t('lieux.new.add')}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Collapse>
                            </Card>
                        ))}

                        <Typography textTransform='uppercase' fontWeight={600} marginBottom={2} gutterBottom>
                            {t('lieux.new.permissions')}
                        </Typography>

                        <Otable headers={headCells}
                                  rows={rows}
                                  state={null}
                                  from={'permission'}
                                  t={t}
                                  edit={editPlaces}
                                  handleConfig={handleConfig}
                                  handleChange={handleChange}/>
                        <div style={{paddingBottom: '50px'}}></div>

                        <Stack className='bottom-section' justifyContent='flex-end' spacing={2} direction={'row'}>
                            <Button onClick={() => router.back()}>
                                {t('motif.dialog.cancel')}
                            </Button>
                            <Button type='submit' variant="contained" color="primary">
                                {t('motif.dialog.save')}
                            </Button>
                        </Stack>
                    </FormStyled>
                </FormikProvider>
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
