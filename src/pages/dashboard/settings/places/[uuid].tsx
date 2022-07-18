import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";
import * as Yup from "yup";
import {FormikProvider, useFormik} from "formik";
import React, {ReactElement, useEffect, useState} from "react";
import {SubHeader} from "@features/subHeader";
import {RootStyled} from "@features/toolbar";
import {
    Box, Button,
    Card,
    CardContent, Collapse,
    FormControl, FormControlLabel,
    Grid,
    InputAdornment,
    MenuItem, Paper,
    Select,
    Stack, Switch,
    TextField,
    Typography
} from "@mui/material";
import {CountryCodeSelect} from "@features/countryCodeSelect";
import AddIcon from "@mui/icons-material/Add";
import IconUrl from "@themes/urlIcon";
import TimePicker from "@themes/overrides/TimePicker";
import {GetStaticPaths, GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {DashLayout} from "@features/base";
import FormStyled from "./overrides/formStyled";
import dynamic from "next/dynamic";
import {LatLngBoundsExpression} from "leaflet";
import useRequest from "@app/axios/axiosServiceApi";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";

const Maps = dynamic(() => import("@features/maps/components/maps"), {
    ssr: false,
});

function PlacesDetail() {
    const router = useRouter();
    const uuind = router.query.uuid;
    const {t, ready} = useTranslation("settings");

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, t('users.new.ntc'))
            .max(50, t('users.new.ntl'))
            .required(t('users.new.nameReq')),
        address: Yup.string().required(t('lieux.new.adreq'))
    });

    const [outerBounds, setOuterBounds] = useState<LatLngBoundsExpression>([]);
    const [cords, setCords] = useState<any[]>([]);

    const {data: session} = useSession();
    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const [row, setRow] = useState<any>()

    const {data} = useRequest(uuind !== 'new' ? {
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/locations/" + uuind + '/' + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null);


    useEffect(() => {
        if (data !== undefined) {
            setRow((data as any).data)
        } else {
            navigator.geolocation.getCurrentPosition(function (position) {
                setOuterBounds([[position.coords.latitude, position.coords.longitude]]);
            });
            setHoraires([
                {
                    isMain: false,
                    isVisible: false,
                    openingHours: {
                        MON: [],
                        THU: [],
                        WED: [],
                        TUE: [],
                        FRI: [],
                        SUN: [],
                        SAT: [],
                    }
                }
            ])
        }

    }, [data]);

    useEffect(() => {
        if (row !== undefined) {
            setHoraires(row.openingHours)
            formik.setFieldValue('name', row.name);
            formik.setFieldValue('address', row.address.street);
            formik.setFieldValue('postalCode', row.address.postalCode);
            setOuterBounds([row.address.location.point]);
            setCords([{name: "name", points: row.address.location.point}])
        }
    }, [row])

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
    const [horaires, setHoraires] = useState<any[]>([])
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
        props.access = event.target.value
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
                    <p style={{margin: 0}}>{uuind === 'new' ? t('lieux.new.path') : t('lieux.config.path') + ' > name'}</p>
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

                        <Maps data={uuind === 'new' ? null : cords}
                              outerBounds={outerBounds}
                              draggable={true}></Maps>

                        <Typography textTransform='uppercase' fontWeight={600} marginBottom={2} marginTop={2}
                                    gutterBottom>
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

                        {
                            horaires.map((value: any, index) =>
                                (
                                    <div key={index}>
                                        <p>{value.uuid}</p>
                                        <p>Is main {value.isMain ? 'Yes' : 'No'}</p>
                                        <p>Is visible{value.isVisible ? 'Yes' : 'No'}</p>

                                        {
                                            Object.keys(value.openingHours).map((day: any, index) =>
                                                (
                                                    <Card key={index}
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
                                                                {t('days.' + day)}
                                                            </Typography>

                                                            <Switch
                                                                onChange={(e) => {
                                                                    if (e.target.checked)
                                                                        value.openingHours[day].push({
                                                                            start_time: '',
                                                                            end_time: ''
                                                                        });
                                                                    else
                                                                        value.openingHours[day] = [];
                                                                    setHoraires([...horaires]);
                                                                }
                                                                }
                                                                checked={value.openingHours[day].length > 0}
                                                            />
                                                        </Box>

                                                        <Collapse
                                                            in={value.openingHours[day].length > 0} sx={{
                                                            bgcolor: "common.white",
                                                            borderTop: "1px solid #C9C8C8"
                                                        }}>
                                                            <Paper sx={{borderRadius: 0, border: "none", px: 1, my: 2}}>
                                                                {value.openingHours[day]?.map((hour: any, i: number) => (
                                                                    <Grid container spacing={1} alignItems="center"
                                                                          sx={{mt: 1}} key={i}>
                                                                        {hour &&
                                                                            <Grid item lg={3} md={3} sm={12} xs={4}>
                                                                                <Box
                                                                                    sx={{
                                                                                        display: "flex",
                                                                                        alignItems: "center",
                                                                                        svg: {mr: 1},
                                                                                        justifyContent: "end",
                                                                                    }}>
                                                                                    <IconUrl path="ic-time"/>
                                                                                    <Typography variant="body2"
                                                                                                color="text.primary">
                                                                                        {i + 1 > 1 ? i + 1 + 'em seance' : '1er seance'}
                                                                                    </Typography>
                                                                                </Box>
                                                                            </Grid>}
                                                                        {hour &&
                                                                            <Grid item lg={4} md={6} sm={12} xs={12}>
                                                                                <TimePicker
                                                                                    defaultValue={[hour.start_time ? new Date("2013/1/16 " + hour.start_time) : '', hour.end_time ? new Date("2013/1/16 " + hour.end_time) : '']}
                                                                                    onChange={(s: any, e: any) => {
                                                                                    }}
                                                                                />
                                                                            </Grid>}
                                                                        {i > 0 && hour && (
                                                                            <Grid item lg={3} md={3} sm={12} xs={12}>
                                                                                <Button
                                                                                    variant="text"
                                                                                    color="error"
                                                                                    size="small"
                                                                                    sx={{
                                                                                        svg: {width: 15},
                                                                                        path: {fill: (theme) => theme.palette.error.main},
                                                                                    }}
                                                                                    startIcon={<IconUrl
                                                                                        path="icdelete"/>}
                                                                                    onClick={() => {
                                                                                        value.openingHours[day].splice(i, 1);
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
                                                                                value.openingHours[day].push({
                                                                                    start_time: '',
                                                                                    end_time: ''
                                                                                });
                                                                                setHoraires([...horaires]);
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
                                                )
                                            )
                                        }
                                    </div>
                                )
                            )
                        }

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

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, ['common', 'menu', 'settings']))
    }
})
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {

    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}
export default PlacesDetail

PlacesDetail.auth = true;

PlacesDetail.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}
