import * as Yup from "yup";
import {useFormik, Form, FormikProvider} from "formik";
import {
    Typography,
    Card,
    CardContent,
    Stack,
    Box,
    TextField,
    Button
} from '@mui/material'
import {styled} from '@mui/material/styles';
import React from "react";
import {useTranslation} from "next-i18next";
import {useRequestMutation} from "@app/axios";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";

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
    const medical_professional = (user as UserDataResponse).medical_professional as MedicalProfessionalModel;
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
            name: props.data.act.name as string,
            fees: props.data.fees as number,

        },
        validationSchema,

        onSubmit: async (values, {setErrors, setSubmitting}) => {
            const form = new FormData();
            form.append("attribute", "price");
            form.append("value", `${values.fees}`);

            trigger({
                method: "PATCH",
                url: "/api/medical-entity/" + medical_entity.uuid + "/professionals/" + medical_professional.uuid + "/acts/" + props.data.act.uuid + '/' + router.locale,
                data: form,
                headers: {
                    ContentType: 'multipart/form-data',
                    Authorization: `Bearer ${session?.accessToken}`
                }
            }, {revalidate: true, populateCache: true}).then((r) => mutateEvent());
            props.closeDraw()
        },
    });

    if (!ready) return (<>loading translations...</>);
    const {errors, touched, handleSubmit, getFieldProps} = formik;
    return (
        <FormikProvider value={formik}>
            <PaperStyled autoComplete="off"
                         noValidate
                         className='root'
                         onSubmit={handleSubmit}>

                <Typography variant="h6" gutterBottom>
                    {t('actfees.dialog.editAct')}
                </Typography>
                <Typography variant="body1" fontWeight={400} margin={'16px 0'} gutterBottom>
                    {t('actfees.dialog.info')}
                </Typography>
                <Card>
                    <CardContent>
                        <Stack spacing={2}>
                            <Box width={1}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {t('motifType.dialog.nom')}{" "}
                                    <Typography component="span" color="error">
                                        *
                                    </Typography>
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    placeholder={t('actfees.dialog.name')}
                                    required
                                    fullWidth
                                    helperText={touched.name && errors.name}
                                    {...getFieldProps("name")}
                                    error={Boolean(touched.name && errors.name)}

                                />
                            </Box>
                            <Box width={1}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {t('actfees.dialog.price')}{" "}
                                    <Typography component="span" color="error">
                                        *
                                    </Typography>
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    placeholder={t('motifType.dialog.tapez')}
                                    required
                                    fullWidth
                                    InputProps={{inputProps: {min: 0}}}
                                    helperText={touched.fees && errors.fees}
                                    {...getFieldProps("fees")}
                                    type="number"
                                    error={Boolean(touched.fees && errors.fees)}

                                />
                            </Box>
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
