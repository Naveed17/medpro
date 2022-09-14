import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";
import * as Yup from "yup";
import {Form, FormikProvider, useFormik} from "formik";
import React, {ReactElement, useCallback, useEffect, useState} from "react";
import {SubHeader} from "@features/subHeader";
import {RootStyled} from "@features/toolbar";
import {
    Box,
    Button,
    Card,
    CardContent, Collapse,
    FormControl, FormControlLabel,
    Grid,
    InputAdornment, MenuItem,
    Paper,
    Select, SelectChangeEvent,
    Stack,
    Switch,
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
import dynamic from "next/dynamic";
import {LatLngBoundsExpression} from "leaflet";
import {useRequest, useRequestMutation} from "@app/axios";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {styled} from "@mui/material/styles";
import moment from "moment-timezone";
import {DateTime} from "next-auth/providers/kakao";
import {LoadingButton} from "@mui/lab";

const Maps = dynamic(() => import("@features/maps/components/maps"), {
    ssr: false,
});

const FormStyled = styled(Form)(({theme}) => ({
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
        left: 0,
        zIndex: 999,
        width: '100%',
        borderTop: '3px solid #f0fafe'
    }
}));

function PlacesDetail() {
    const router = useRouter();
    const uuind = router.query.uuid;
    const {t, ready} = useTranslation("settings");
    const [check, setCheck] = useState(true);

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, t('users.new.ntc'))
            .max(50, t('users.new.ntl'))
            .required(t('users.new.nameReq')),
        address: Yup.string().required(t('lieux.new.adreq'))
    });


    const {data: session} = useSession();
    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const [row, setRow] = useState<any>();
    const [outerBounds, setOuterBounds] = useState<LatLngBoundsExpression>([]);
    const [cords, setCords] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [contacts, setContacts] = useState<any[]>([{
        countryCode: '',
        phone: '',
        hidden: false
    }]);
    const [cities, setCities] = useState<LocationModel[]>([]);

    const [horaires, setHoraires] = useState<OpeningHoursModel[]>([
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


    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: row ? (row.address.location.name) as string : '',
            address: row ? (row.address.street) as string : '',
            postalCode: row ? row.address.postalCode : '',
            town: row ? row.address.state.uuid : '',
            city: '',
            phone: contacts,
            information: ''
        },
        validationSchema,
        onSubmit: async (values, {setErrors, setSubmitting}) => {
            cleanData();
            setLoading(true);
            let method = '';
            let url = '';
            let phones: {
                value: string,
                type: string,
                contact_type: string,
                is_public: boolean,
                is_support: boolean
            }[] = []
            values.phone.map(value => {
                if (value.phone)
                    phones.push({
                        value: value.phone,
                        type: "phone",
                        contact_type: "uuid",
                        is_public: !value.hidden,
                        is_support: false
                    })
            })
            const form = new FormData();
            form.append('postal_code', values.postalCode);
            form.append('access_data', JSON.stringify({}));
            form.append('opening_hours', JSON.stringify(horaires[0].openingHours));
            form.append('city', values.city);
            form.append('name', JSON.stringify({fr: values.name}));
            form.append('latitude', cords[0].points[0]);
            form.append('longitude', cords[0].points[1]);
            form.append('address', JSON.stringify({fr: values.address}));
            form.append('contacts', JSON.stringify(phones));

            if (data) {
                method = 'PUT';
                url = "/api/medical-entity/" + medical_entity.uuid + "/locations/" + (data as HttpResponse).data.uuid + '/' + router.locale;
            } else {
                method = 'POST'
                url = "/api/medical-entity/" + medical_entity.uuid + "/locations/" + router.locale;
            }

            trigger({
                method,
                data: form,
                url,
                headers: {
                    ContentType: 'application/x-www-form-urlencoded',
                    Authorization: `Bearer ${session?.accessToken}`
                }
            }, {revalidate: true, populateCache: true}).then((r: any) => {
                if (r.status === 200 || r.status === 201) {
                    router.back();
                    setLoading(false);
                }
            });
        },
    });

    const {values, errors, touched, handleSubmit, getFieldProps, setFieldValue} = formik;


    const {data} = useRequest(uuind !== 'new' ? {
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/locations/" + uuind + '/' + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null);

    const {data: httpStateResponse} = useRequest({
        method: "GET",
        url: "/api/public/places/countries/" + medical_entity.country.uuid + "/state/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    const {trigger} = useRequestMutation(null, "/settings/place");


    useEffect(() => {
        if (data !== undefined) {
            setRow((data as HttpResponse).data)
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

    const getCities = (state: string) => {
        trigger({
            method: "GET",
            url: "/api/public/places/state/" + state + "/cities/" + router.locale,
            headers: {
                ContentType: 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${session?.accessToken}`
            }
        }, {revalidate: true, populateCache: true}).then((r: any) => {
            setCities(r.data.data);
        });
    }


    const initialCites = useCallback((adr: any) => {
        trigger({
            method: "GET",
            url: "/api/public/places/state/" + adr.address.state.uuid + "/cities/" + router.locale,
            headers: {
                ContentType: 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${session?.accessToken}`
            }
        }, {revalidate: true, populateCache: true}).then((r: any) => {
            setCities(r.data.data);
            setFieldValue('city', adr.address.city.uuid);
        });
    }, [router, session, setFieldValue, trigger])

    useEffect(() => {
        if (row !== undefined && check) {
            setOuterBounds([row.address.location.point]);
            setCords([{name: "name", points: row.address.location.point}]);


            const cnts: any[] = [{
                countryCode: '',
                phone: '',
                hidden: false
            }];
            row.contacts.map((contact: ContactModel) => {
                cnts.push({
                    countryCode: '',
                    phone: contact.value,
                    hidden: !contact.isPublic
                });
            });
            setContacts([...cnts])
            initialCites(row)

            const hours = [
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
            ];
            row.openingHours.map((ohours: any, index: number) => {
                hours[index].isMain = ohours.isMain;
                hours[index].isVisible = ohours.isVisible;
                Object.keys(hours[index].openingHours).map(day => {
                    // @ts-ignore
                    hours[index].openingHours[day] = ohours.openingHours[day]
                });
            });
            setHoraires([...hours]);
            setCheck(false)
        }
    }, [check, initialCites, row])

    // useEffect(() => {
    //     if (row !== undefined && check) {
    //         /*row.openingHours.map((ohours: any, index: number) => {
    //             horaires[index].isMain = ohours.isMain;
    //             horaires[index].isVisible = ohours.isVisible;
    //             Object.keys(horaires[index].openingHours).map(day => {
    //                 horaires[index].openingHours[day] = ohours.openingHours[day]
    //             });
    //         });
    //         setHoraires([...horaires]);*/
    //         setHoraires(row.openingHours)
    //         setOuterBounds([row.address.location.point]);
    //         setCords([{name: "name", points: row.address.location.point}]);
    //         //initialCites();
    //         setCheck(false);
    //         row.contacts.map((contact: ContactModel) => {
    //             contacts.push({
    //                 countryCode: '',
    //                 phone: contact.value,
    //                 hidden: !contact.isPublic
    //             });
    //         });
    //         setContacts([...contacts])
    //         console.log('loop')
    //
    //     }
    // }, [check, contacts, row])


    /*    const [rows, setRows] = useState([
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
        ]);*/

    if (!ready) return (<>loading translations...</>);

    /*
        // access array not exit in backend
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
    */

    const apply = () => {
        const h = horaires[0].openingHours['MON'];
        Object.keys(horaires[0].openingHours).map(day => {
            if (day !== 'MON') {
                horaires[0].openingHours[day] = [];
                h.map((hour: any, index: number) => {
                    horaires[0].openingHours[day] = [...horaires[0].openingHours[day], {
                        start_time: h[index].start_time,
                        end_time: h[index].end_time
                    }];
                })
            }

        });
        setHoraires([...horaires]);
    }
    const cleanData = () => {
        Object.keys(horaires[0].openingHours).map(day => {
            horaires[0].openingHours[day] = horaires[0].openingHours[day].filter((hour: { start_time: string, end_time: string }) => hour.start_time !== 'Invalid date' && hour.end_time !== 'Invalid date');
        });
        setHoraires([...horaires]);
    }

    const onChangeState = (event: SelectChangeEvent) => {
        setFieldValue('town', event.target.value);
        setFieldValue('city', '');
        getCities(event.target.value);
    };

    const handleAddPhone = () => {
        const phones = [...values.phone, {
            countryCode: '',
            phone: '',
            hidden: false
        }];
        setFieldValue('phone', phones);
    }

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{uuind === 'new' ? t('lieux.new.path') : t('lieux.config.path') + (row ? ' > ' + row.address.location.name : '')}</p>
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
                                        <Grid item xs={12} lg={6}>
                                            <TextField
                                                variant="outlined"
                                                placeholder={t('lieux.new.writeAdress')}
                                                fullWidth
                                                required
                                                helperText={touched.address && errors.address}
                                                error={Boolean(touched.address && errors.address)}
                                                {...getFieldProps("address")}/>
                                        </Grid>
                                        <Grid item xs={12} lg={1}>
                                            <Typography textAlign={{lg: 'right', xs: 'left'}} color="text.secondary"
                                                        variant='body2' fontWeight={400}>
                                                {t('lieux.new.postal')}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} lg={3}>
                                            <TextField
                                                variant="outlined"
                                                placeholder={t('lieux.new.writePostal')}
                                                fullWidth
                                                type={'number'}
                                                required
                                                {...getFieldProps("postalCode")}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box mb={2}>
                                    <Grid container spacing={{lg: 2, xs: 1}} alignItems="center">
                                        <Grid item xs={12} lg={2}>
                                            <Typography textAlign={{lg: 'right', xs: 'left'}} color="text.secondary"
                                                        variant='body2' fontWeight={400}>
                                                {t('lieux.new.ville')}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} lg={10}>
                                            <Grid container spacing={{lg: 2, xs: 1}} alignItems="center"
                                                  justifyContent={{lg: 'space-between', xs: 'flex-start'}}>
                                                <Grid item xs={12} lg={6}>
                                                    <FormControl size="small" fullWidth>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id={"duration"}
                                                            {...getFieldProps("town")}
                                                            value={values.town}
                                                            onChange={onChangeState}
                                                            displayEmpty={true}
                                                            sx={{color: "text.secondary"}}
                                                            placeholder={t('lieux.new.selectCity')}>
                                                            {
                                                                httpStateResponse && (httpStateResponse as HttpResponse).data.map((state: LocationModel) =>
                                                                    (<MenuItem key={state.uuid} value={state.uuid}>
                                                                        {state.name}
                                                                    </MenuItem>))
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12} lg={6}>
                                                    <Stack spacing={{lg: 2, xs: 1}}
                                                           direction={{lg: 'row', xs: 'column'}}
                                                           alignItems={{lg: 'center', xs: 'flex-start'}}>
                                                        <Typography color="text.secondary" variant='body2'
                                                                    fontWeight={400}>
                                                            {t('lieux.new.city')}
                                                        </Typography>
                                                        <FormControl size="small" fullWidth>
                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                id={"duration"}
                                                                {...getFieldProps("city")}
                                                                value={values.city}
                                                                displayEmpty={true}
                                                                sx={{color: "text.secondary"}}>
                                                                {
                                                                    cities.map((state: LocationModel) =>
                                                                        (<MenuItem key={state.uuid} value={state.uuid}>
                                                                            {state.name}
                                                                        </MenuItem>))
                                                                }
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
                              editCords={(c: { lat: number, lng: number }) => {
                                  setCords([{name: values.name, points: [c.lat, c.lng]}]);
                              }}
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
                            {t('lieux.new.timeshedule')}
                        </Typography>

                        {
                            horaires.map((value: any, index) =>
                                <div key={index}>
                                    <p>{value.uuid}</p>
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
                                                                        start_time: '08:00',
                                                                        end_time: '12:00'
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
                                                                                    {i + 1 > 1 ? (router.locale !== 'ar' ? i + 1 : '') + t('lieux.new.emsc') + (router.locale == 'ar' ? ' ' + (i + 1) : '') : t('lieux.new.firstsc')}
                                                                                </Typography>
                                                                            </Box>
                                                                        </Grid>}
                                                                    {hour &&
                                                                        <Grid item lg={4} md={6} sm={12} xs={12}>
                                                                            <TimePicker
                                                                                defaultValue={[hour.start_time ? new Date("2013/1/16 " + hour.start_time) : '', hour.end_time ? new Date("2013/1/16 " + hour.end_time) : '']}
                                                                                onChange={(start: DateTime, end: DateTime) => {
                                                                                    if (hour.start_time !== moment(start).format('HH:mm') || hour.end_time !== moment(end).format('HH:mm')) {
                                                                                        hour.start_time = moment(start).format('HH:mm');
                                                                                        hour.end_time = moment(end).format('HH:mm');
                                                                                        console.log(hour)
                                                                                        setHoraires([...horaires]);
                                                                                    }

                                                                                }}/>
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

                                                            {day == "MON" &&
                                                                <Button onClick={apply}>Apply for the whole
                                                                    week</Button>}

                                                        </Paper>
                                                    </Collapse>
                                                </Card>
                                            )
                                        )
                                    }
                                </div>
                            )
                        }

                        <div style={{paddingBottom: '50px'}}></div>

                        <Stack className='bottom-section' justifyContent='flex-end' spacing={2} direction={'row'}>
                            <Button onClick={() => router.back()}>
                                {t('motif.dialog.cancel')}
                            </Button>
                            <LoadingButton loading={loading} type='submit' variant="contained" color="primary">
                                {t('motif.dialog.save')}
                            </LoadingButton>
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
