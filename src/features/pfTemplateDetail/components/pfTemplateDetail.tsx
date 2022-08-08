import * as Yup from "yup";
import {useFormik, Form, FormikProvider} from "formik";
import {
    Typography,
    Card,
    CardContent,
    Stack,
    Box,
    TextField,
    FormControl,
    Button, ListItemText, ListItem, Checkbox
} from '@mui/material'
import {styled} from '@mui/material/styles';
import React, {useState} from "react";
import {useTranslation} from "next-i18next";
import {ModelDot} from "@features/modelDot";
import IconUrl from "@themes/urlIcon";

const PaperStyled = styled(Form)(({theme}) => ({
    backgroundColor: '#F0F7FA',
    borderRadius: 0,
    minWidth: '650px',
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

function PfTemplateDetail({...props}) {

    const {t, ready} = useTranslation('settings', {
        keyPrefix: "templates.config.dialog",
    });
    const colors = ['#FEBD15', '#FF9070', '#DF607B', '#9A5E8A', '#526686', '#96B9E8', '#72D0BE', '#56A97F'];
    const types = ['Général', 'Grosse', 'Prescription ophtalmique', 'Cardio', 'Autre'];
    const [modelColor, setModelColor] = useState(props.data ? props.data.color :'#FEBD15');
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, t('users.new.ntc'))
            .max(50, t('users.new.ntl'))
            .required(t('users.new.nameReq'))
    });
    console.log(props.data);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: props.data ? (props.data.name as string) : "",
            color: props.data ? props.data.color : ""
        },
        validationSchema,
        onSubmit: async (values, {setErrors, setSubmitting}) => {
            alert(JSON.stringify(values, null, 2));
        },
    });
    const {values, errors, touched, handleSubmit, getFieldProps, setFieldValue} = formik;

    if (!ready) return (<>loading translations...</>);

    return (
        <Box style={{background: "black"}}>
            {
                props.action === 'see' &&
                <FormikProvider value={formik}>
                    <PaperStyled autoComplete="off"
                                 noValidate
                                 className='root'
                                 onSubmit={handleSubmit}>
                        <Stack spacing={2} direction="row">
                            <ModelDot key={modelColor}
                                      color={modelColor}
                                      selected={false}></ModelDot>
                            <Typography variant="h6" gutterBottom>
                                { t('title')+ props.data.name}
                            </Typography>
                        </Stack>

                        <Typography variant="body2" marginTop={2} marginBottom={1} gutterBottom>
                            Grosses
                        </Typography>

                        <Card>
                            <CardContent>
                            </CardContent>
                        </Card>

                        <Typography variant="body2" marginTop={2} marginBottom={1} gutterBottom>
                            Ophtalmologue
                        </Typography>

                        <Card>
                            <CardContent>
                            </CardContent>
                        </Card>
                    </PaperStyled>
                </FormikProvider>
            }
            {
                props.action !== 'see' && <FormikProvider value={formik}>
                    <PaperStyled autoComplete="off"
                                 noValidate
                                 className='root'
                                 onSubmit={handleSubmit}>
                        <Typography variant="h6" gutterBottom>
                            {props.data ? t('titleEdit'):t('titleAdd')}
                        </Typography>
                        <Typography variant="body1" fontWeight={400} margin={'16px 0'} gutterBottom>
                            {t('info')}
                        </Typography>

                        <Card>
                            <CardContent>
                                <Stack spacing={2}>
                                    <FormControl size="small" fullWidth>
                                        <Typography variant="body2" marginTop={2} marginBottom={1} gutterBottom>
                                            {t('named')}
                                        </Typography>

                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            helperText={touched.name && errors.name}
                                            {...getFieldProps("name")}
                                            error={Boolean(touched.name && errors.name)}></TextField>

                                        <Typography variant="body2" marginTop={2} marginBottom={1} gutterBottom>
                                            {t('selectColor')}
                                        </Typography>

                                        <Stack spacing={1} direction={"row"}>
                                            {
                                                colors.map(color => (
                                                    <ModelDot key={color}
                                                              color={color}
                                                              onClick={() => {
                                                                  setModelColor(color)
                                                              }}
                                                              selected={color === modelColor}></ModelDot>
                                                ))
                                            }
                                        </Stack>
                                    </FormControl>
                                </Stack>
                            </CardContent>
                        </Card>

                        <Typography variant="body1" fontWeight={400} margin={'16px 0'} gutterBottom>
                            {t('info')}
                        </Typography>

                        <Card>
                            <CardContent>
                                <Stack spacing={2}>
                                    <FormControl size="small" fullWidth>
                                        <Typography variant="body2" marginTop={2} marginBottom={1} gutterBottom>
                                            {t('named')}
                                        </Typography>
                                        {
                                            types.map(type => (
                                                <ListItem key={type} sx={{padding: 0}}>
                                                    <Checkbox
                                                        size="small"
                                                        checked={true}
                                                        id={"1"}
                                                        name={"wass"}
                                                    />
                                                    <ListItemText id="switch-list-label-bluetooth" primary={type}/>
                                                    <IconUrl path={'mdi_arrow_drop_down'}/>
                                                </ListItem>
                                            ))
                                        }
                                    </FormControl>
                                </Stack>
                            </CardContent>
                        </Card>

                        <Stack className='bottom-section' justifyContent='flex-end' spacing={2} direction={'row'}>
                            <Button onClick={props.closeDraw}>
                                {t('cancel')}
                            </Button>
                            <Button type='submit' variant="contained" color="primary">
                                {t('save')}
                            </Button>
                        </Stack>
                    </PaperStyled>
                </FormikProvider>
            }
        </Box>
    )
}

export default PfTemplateDetail;
