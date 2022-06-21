import {Form, FormikProvider, useFormik} from "formik";
import {useTranslation} from "next-i18next";
import React, {useState} from "react";
import * as Yup from "yup";
import {
    Button,
    CardContent,
    Grid, Stack,
    TextField,
    Typography
} from "@mui/material";
import {styled} from "@mui/material/styles";
import RadioTextImage from "@themes/overrides/RadioTextImage";
import {TimePicker as MuiTimePicker} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {Otable} from "@features/table";


const  StackStyled = styled(Stack)(({ theme }) => ({
        background: theme.palette.background.paper,
        padding: theme.spacing(1),
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(-2),
        position: 'sticky',
        bottom: 0,
}));
const  BoxStyled = styled(Form)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),

}));
const  PaperStyled = styled(Form)(({ theme }) => ({
    borderRadius: 0,
    border: 'none',
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
    }
}));

function HolidayDetails() {

    let doctors = [
        {id: '1', name: 'Dr Anas LAOUINI', speciality: 'sexologist', img: '/static/img/men.png', selected: false},
        {id: '2', name: 'Dr Omar LAOUINI', speciality: 'Gynecologist', img: '/static/img/men.png', selected: false},
        {id: '3', name: 'Dr Anouar ABDELKAFI', speciality: 'ORL', img: '/static/img/men.png', selected: false},
    ];
    const [rows, setRows] = useState([
        {
            id: 1,
            name: 'Congés',
            start: 'Fri April 10',
            time_start: '14:30',
            end: 'Fri April 10',
            time_end: '14:30',
            praticien: "Dr Omar OUNELLI"
        },
    ]);

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .min(3, "Nom est trop court")
            .max(50, "Nom est trop long")
            .required("Nom est requis")
    });


    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: "",
            start: '',
            time_start: '',
            end: '',
            time_end: '',
            doctor: doctors
        },
        validationSchema,
        onSubmit: async (values, {setErrors, setSubmitting}) => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    const {t, ready} = useTranslation('settings');
    if (!ready) return (<>loading translations...</>);

    const {values, errors, touched, handleSubmit, getFieldProps, setFieldValue} = formik;

    return (
        <FormikProvider value={formik}>
            <PaperStyled autoComplete="off"
                         noValidate
                         className='root'
                         onSubmit={handleSubmit}>

                <Typography variant="h6" gutterBottom>
                    {t('holidays.dialog.add')}
                </Typography>
                <CardContent>
                    <Typography variant="body1" textTransform={"uppercase"} fontWeight={600} margin={'16px 0'}
                                gutterBottom>
                        {t('holidays.praticien')}
                    </Typography>

                    <Typography gutterBottom margin={'16px 0'}>
                        {t('holidays.dialog.selectOne')}
                    </Typography>
                    <Grid container spacing={2}>
                        {values.doctor.map((doctor, index) => (
                            <Grid key={index} item xs={12} lg={6}>
                                <RadioTextImage
                                    doctor={doctor}
                                    onChange={(v: any) => {
                                        const newArr = values.doctor.map(obj => {
                                            if (obj.id === v.id) {
                                                return {...obj, selected: !v.selected};
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

                    <Typography variant="body2" color="text.primary" marginTop={3} marginBottom={1} gutterBottom>
                        {t('holidays.dialog.title')}{" "}
                        <Typography component="span" color="error">
                            *
                        </Typography>
                    </Typography>
                    <TextField
                        variant="outlined"
                        placeholder={t('holidays.dialog.writeTitle')}
                        required
                        fullWidth
                        helperText={touched.title && errors.title}
                        {...getFieldProps("name")}
                        error={Boolean(touched.title && errors.title)}/>

                    <Typography variant="body2" color="text.primary" marginTop={3} marginBottom={1} gutterBottom>
                        {t('holidays.start')}{" "}
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid key={'date'} item xs={12} lg={5}>
                            <TextField
                                id="date"
                                type="date"
                                sx={{width: '100%'}}
                                defaultValue=""
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid key={'at'} item xs={12} lg={1}>
                            <Typography gutterBottom textAlign={"center"} alignItems={"center"} margin={1}>
                                {t('holidays.dialog.at')}
                            </Typography>
                        </Grid>
                        <Grid key={'time'} item xs={12} lg={5}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>

                                <MuiTimePicker
                                    ampm={false}
                                    openTo="hours"
                                    views={["hours", "minutes"]}
                                    inputFormat="HH:mm"
                                    mask="__:__"
                                    value={undefined}
                                    onChange={(newValue) => {

                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />

                            </LocalizationProvider>
                        </Grid>
                    </Grid>

                    <Typography variant="body2" color="text.primary" marginTop={3} marginBottom={1} gutterBottom>
                        {t('holidays.end')}{" "}
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid key={'date'} item xs={12} lg={5}>
                            <TextField
                                id="date"
                                type="date"
                                sx={{width: '100%'}}
                                defaultValue=""
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid key={'at'} item xs={12} lg={1}>
                            <Typography gutterBottom textAlign={"center"} alignItems={"center"} margin={1}>
                                {t('holidays.dialog.at')}
                            </Typography>
                        </Grid>
                        <Grid key={'time'} item xs={12} lg={5}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <MuiTimePicker
                                    ampm={false}
                                    openTo="hours"
                                    views={["hours", "minutes"]}
                                    inputFormat="HH:mm"
                                    mask="__:__"
                                    value={undefined}
                                    onChange={(newValue) => {

                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />

                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                </CardContent>
            </PaperStyled>
            <BoxStyled>
                <Typography variant="body1" fontWeight={600} margin={0} gutterBottom>
                    {t('holidays.dialog.list')}
                </Typography>

                <Otable headers={[]}
                        rows={rows}
                        state={null}
                        from={'holidays'}
                        t={t}
                        edit={null}
                        handleConfig={null}
                        handleChange={null}/>
            </BoxStyled>
            <StackStyled className='bottom-section' justifyContent='flex-end' spacing={2} direction={'row'}>
                <Button onClick={() => close()}>
                    {t('motif.dialog.cancel')}
                </Button>
                <Button type='submit' variant="contained" color="primary">
                    {t('motif.dialog.save')}
                </Button>
            </StackStyled>
        </FormikProvider>
    )
}
export default HolidayDetails