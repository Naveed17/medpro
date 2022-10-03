import * as Yup from "yup";
import {useFormik, Form, FormikProvider} from "formik";
import {
    Typography,
    Card,
    CardContent,
    FormHelperText,
    Stack,
    Box,
    TextField,
    FormControl,
    Select,
    MenuItem,
    Button, ListItemText
} from '@mui/material'
import {styled} from '@mui/material/styles';
import ThemeColorPicker from "@themes/overrides/ThemeColorPicker"
import React, {useState} from "react";
import {useTranslation} from "next-i18next";
import {useRequestMutation} from "@app/axios";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {IconsTypes} from "@features/calendar";

const icons = [
    'ic-consultation',
    'ic-teleconsultation',
    'ic-control',
    'ic-clinique',
    'ic-at-home',
    'ic-personal'
]
const PaperStyled = styled(Form)(({theme}) => ({
    backgroundColor: theme.palette.background.default,
    borderRadius: 0,
    height: '100%',
    border: 'none',
    minWidth: '650px',
    [theme.breakpoints.down('md')]: {
        minWidth: 0,
        width: '100%'
    },
    boxShadow: theme.customShadows.motifDialog,
    display: 'flex',
    flexDirection: 'column',
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
    '.react-svg': {
        svg: {
            width: 20,
            height: 20
        }
    },
    '& .bottom-section': {
        background: theme.palette.background.paper,
        padding: theme.spacing(1),
        marginTop: 'auto',
        marginLeft: theme.spacing(-2),
        marginRight: theme.spacing(-2),
        borderTop: `3px solid ${theme.palette.grey['A700']}`,
    }
}));

function EditMotifDialog({...props}) {
    const {mutateEvent} = props
    const {data: session} = useSession();
    const {data: user} = session as Session;
    const router = useRouter();
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const initalData = Array.from(new Array(20));
    const [submit, setSubmit] = useState(false);
    const {trigger} = useRequestMutation(null, "/settings/type");
    const {t, ready} = useTranslation('settings');
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
            color: props.data ? props.data.color as string : "#0696D6",
            icon: props.data ? props.data.icon as string : icons[0]
        },
        validationSchema,

        onSubmit: async (values, {setErrors, setSubmitting}) => {
            props.closeDraw()
            const form = new FormData();
            form.append('color', values.color);
            form.append('name', JSON.stringify({
                "fr": values.name,
            }));
            form.append('icon', values.icon);
            if (props.data) {
                trigger({
                    method: "PUT",
                    url: "/api/medical-entity/" + medical_entity.uuid + '/appointments/types/' + props.data.uuid + '/' + router.locale,
                    data: form,
                    headers: {
                        ContentType: 'application/x-www-form-urlencoded',
                        Authorization: `Bearer ${session?.accessToken}`
                    }
                }, {revalidate: true, populateCache: true}).then(r => mutateEvent())
            } else {
                trigger({
                    method: "POST",
                    url: "/api/medical-entity/" + medical_entity.uuid + '/appointments/types/' + router.locale,
                    data: form,
                    headers: {
                        ContentType: 'application/x-www-form-urlencoded',
                        Authorization: `Bearer ${session?.accessToken}`
                    }
                }, {revalidate: true, populateCache: true}).then(r => mutateEvent())
            }

        },
    });

    if (!ready) return (<>loading translations...</>);
    const {values, errors, touched, handleSubmit, getFieldProps, setFieldValue} = formik;

    return (
        <FormikProvider value={formik}>
            <PaperStyled autoComplete="off"
                         noValidate
                         className='root'
                         onSubmit={handleSubmit}>

                <Typography variant="h6" gutterBottom>
                    {props.data ? t('motifType.dialog.update') : t('motifType.dialog.add')}
                </Typography>
                <Typography variant="body1" fontWeight={400} margin={'16px 0'} gutterBottom>
                    {t('motifType.dialog.info')}
                </Typography>
                <Card>
                    <CardContent>
                        <Stack spacing={2}>
                            <Stack spacing={2} direction="row">
                                <Box>
                                    <Typography display='flex' justifyContent="flex-start" variant="body2"
                                                color="text.secondary" gutterBottom>
                                        {t('motifType.dialog.color')}{" "}
                                        <Typography component="span" color="error" ml={.2}>
                                            *
                                        </Typography>
                                    </Typography>
                                    <ThemeColorPicker color={values.color}
                                                      onSellectColor={(v: string) => setFieldValue('color', v)}/>

                                    {touched.color && errors.color && (
                                        <FormHelperText error sx={{mx: 0}}>
                                            {Boolean(touched.color && errors.color)}
                                        </FormHelperText>
                                    )}
                                </Box>
                                <Box width={1}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {t('motifType.dialog.nom')}{" "}
                                        <Typography component="span" color="error">
                                            *
                                        </Typography>
                                    </Typography>
                                    <TextField
                                        variant="outlined"
                                        placeholder={t('motifType.dialog.tapez')}
                                        required
                                        fullWidth
                                        helperText={touched.name && errors.name}
                                        {...getFieldProps("name")}
                                        error={Boolean(touched.name && errors.name)}

                                    />
                                </Box>
                            </Stack>
                            <FormControl size="small" fullWidth>
                                <Typography gutterBottom variant="body2"
                                            color="text.secondary">{t("motifType.dialog.selectIcon")}</Typography>
                                <Select
                                    id="demo-select-small"
                                    {...getFieldProps("icon")}
                                    value={values.icon}>
                                    {
                                        icons.map((icon, idx) =>
                                            (<MenuItem key={idx} value={icon}>
                                                <Stack direction={"row"}>
                                                    {IconsTypes[icon]}
                                                    <Typography sx={{
                                                        textTransform: "capitalize",
                                                        ml: .5
                                                    }}>{icon.replace('ic-', ' ')}</Typography>
                                                </Stack>
                                            </MenuItem>))
                                    }
                                </Select>
                            </FormControl>
                        </Stack>
                    </CardContent>
                </Card>

                <Stack className='bottom-section' justifyContent='flex-end' spacing={2} direction={'row'}>
                    <Button onClick={props.closeDraw}>
                        {t('motifType.dialog.cancel')}
                    </Button>
                    <Button type='submit' variant="contained" color="primary">
                        {t('motifType.dialog.save')}
                    </Button>
                </Stack>

            </PaperStyled>
        </FormikProvider>
    )
}

export default EditMotifDialog;
