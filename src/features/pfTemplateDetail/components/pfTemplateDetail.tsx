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
    Button, ListItemText, ListItem, Checkbox, Collapse, Skeleton, IconButton
} from '@mui/material'
import {styled} from '@mui/material/styles';
import React, {useEffect, useState} from "react";
import {useTranslation} from "next-i18next";
import {ModelDot} from "@features/modelDot";
import IconUrl from "@themes/urlIcon";
import dynamic from "next/dynamic";
import {useRequest, useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import ItemCheckbox from "@themes/overrides/itemCheckbox";
import {useRouter} from "next/router";

const FormBuilder: any = dynamic(() => import("@formio/react").then((mod: any) => mod.Form
), {
    ssr: false,
});

const PaperStyled = styled(Form)(({theme}) => ({
    backgroundColor: '#F0F7FA',
    borderRadius: 0,
    minWidth: '650px',
    height: '100%',
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
        position: 'fixed',
        width: '650px',
        bottom: 0,
        borderTop: `3px solid ${theme.palette.grey['A700']}`,
    }
}));

function PfTemplateDetail({...props}) {

    const {t, ready} = useTranslation('settings', {
        keyPrefix: "templates.config.dialog",
    });

    const {data: session} = useSession();
    const {data: user} = session as Session;
    const router = useRouter();

    const colors = ['#FEBD15', '#FF9070', '#DF607B', '#9A5E8A', '#526686', '#96B9E8', '#72D0BE', '#56A97F'];
    const [modelColor, setModelColor] = useState(props.data ? props.data.color : '#FEBD15');
    const [sections, setSections] = useState<SpecialtyJsonWidgetModel[]>([]);
    const [widget, setWidget] = useState<SpecialtyJsonWidgetModel[]>([]);
    const [open, setOpen] = useState<string[]>([]);
    const [components, setComponents] = useState<any[]>([]);
    const [medical_professional_uuid, setMedicalProfessionalUuid] = useState<string>("");
    const initalData = Array.from(new Array(4));

    const {data} = useRequest({
        method: "GET",
        url: "/api/private/json-widgets/specialities/fr",
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    const {trigger} = useRequestMutation(null, "/settings/pfTemplateDetails");

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpProfessionalsResponse} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/professionals/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    useEffect(() => {
        if (data) {
            setSections((data as HttpResponse).data);
        }
        if (httpProfessionalsResponse !== undefined) {
            setMedicalProfessionalUuid((httpProfessionalsResponse as HttpResponse).data[0].medical_professional.uuid);
        }

        if (props.data) {
            setComponents(props.data.structure);
            if (data) {
                let wdg: any[] = [];
                props.data.structure.map((comp: any) => {
                    const compnent = (data as HttpResponse).data.find((elm: SpecialtyJsonWidgetModel) => elm.fieldSet.key === comp.key)
                    wdg.push({...compnent})
                });
                setWidget([...wdg]);
            }
        }
    }, [data, httpProfessionalsResponse, props.data])
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, t('users.new.ntc'))
            .max(50, t('users.new.ntl'))
            .required(t('users.new.nameReq'))
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: props.data ? (props.data.label as string) : "",
        },
        validationSchema,
        onSubmit: async (values, {setErrors, setSubmitting}) => {
            const struct: any[] = [];
            widget.map(w => {
                w.jsonWidgets.map(jw => {
                    w.fieldSet.components = [...w.fieldSet.components, ...jw.structure]
                });
                struct.push(w.fieldSet)
            });

            const form = new FormData();
            form.append('label', values.name);
            form.append('color', modelColor);
            form.append('medicalProfessionalUuid', medical_professional_uuid)
            form.append('structure', JSON.stringify(struct));

            if (props.action === 'edit' && !props.data.hasData) {
                trigger({
                    method: "PUT",
                    url: "/api/medical-entity/" + medical_entity.uuid + '/modals/' + props.data.uuid,
                    data: form,
                    headers: {
                        ContentType: 'application/x-www-form-urlencoded',
                        Authorization: `Bearer ${session?.accessToken}`
                    }
                }, {revalidate: true, populateCache: true}).then(() => {
                    props.mutate();
                    props.closeDraw();
                })

            } else {
                trigger({
                    method: "POST",
                    url: "/api/medical-entity/" + medical_entity.uuid + '/modals',
                    data: form,
                    headers: {
                        ContentType: 'application/x-www-form-urlencoded',
                        Authorization: `Bearer ${session?.accessToken}`
                    }
                }, {revalidate: true, populateCache: true}).then(() => {
                    props.mutate();
                    props.closeDraw();
                })
            }
        },
    });
    const {values, errors, touched, handleSubmit, getFieldProps, setFieldValue} = formik;

    const handleWidgetCheck = (ev: boolean, parent: SpecialtyJsonWidgetModel, child: JsonWidgetModel | null) => {
        const index = widget.findIndex((v: SpecialtyJsonWidgetModel) => v.uuid === parent.uuid);
        if (child !== null) {
            if (ev) {
                if (index === -1) {
                    setWidget([...widget, {...parent, jsonWidgets: [child]}])
                } else {
                    widget[index].jsonWidgets = [...widget[index].jsonWidgets, child];
                    setWidget([...widget]);
                }
            } else {
                const widgetindex = widget[index].jsonWidgets.findIndex((v: JsonWidgetModel) => v.uuid === child.uuid);
                let newWid = widget[index].jsonWidgets;
                newWid = [...newWid.slice(0, widgetindex), ...newWid.slice(widgetindex + 1, newWid.length)]
                widget[index].jsonWidgets = newWid;
                if (newWid.length === 0)
                    setWidget([...widget.slice(0, index), ...widget.slice(index + 1, widget.length)]);
                else
                    setWidget([...widget]);
            }
        } else {
            index === -1 ? setWidget([...widget, {...parent}]) : setWidget([...widget.slice(0, index), ...widget.slice(index + 1, widget.length)]);
            updateOpenedWidget(parent.uuid, index === -1);
        }
    }

    const updateOpenedWidget = (widget: string, state: boolean | null) => {
        const index = open.findIndex((v: string) => v === widget)
        if (state !== null) {
            if (index === -1 && state)
                setOpen([...open, widget]);
            if (index !== -1 && !state)
                setOpen([...open.slice(0, index), ...open.slice(index + 1, open.length)])
        } else {
            index === -1 ? setOpen([...open, widget]) : setOpen([...open.slice(0, index), ...open.slice(index + 1, open.length)]);
        }
    }

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
                        <Stack spacing={2} direction="row" sx={{marginBottom: '2rem'}}>
                            <ModelDot key={modelColor}
                                      color={modelColor}
                                      selected={false}></ModelDot>
                            <Typography variant="h6" gutterBottom>
                                {t('title') + props.data.label}
                            </Typography>
                        </Stack>


                        <FormBuilder
                            form={{
                                display: 'form',
                                components: components
                            }}/>

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
                            {props.data ? t('titleEdit') : t('titleAdd')}
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

                                        {sections.length === 0 ? initalData.map((item, index) => (
                                                <Box key={index}
                                                     sx={{display: 'flex', alignItems: 'center', margin: '0 5px'}}>
                                                    <Checkbox size="small"/>
                                                    <Skeleton width={180} variant="text"/>
                                                </Box>
                                            )) :
                                            sections.map((section: SpecialtyJsonWidgetModel, index: number) => (
                                                <Box key={index}>
                                                    <ListItem key={section.uuid} sx={{padding: 0}}>
                                                        <Checkbox
                                                            size="small"
                                                            id={section.uuid}
                                                            name={section.name}
                                                            checked={widget.find((i: { uuid: string; }) => i.uuid == section.uuid) !== undefined}
                                                            onChange={(v: any) => handleWidgetCheck(v, section, null)}
                                                        />
                                                        <ListItemText id="switch-list-label-bluetooth"
                                                                      onClick={() => {
                                                                          updateOpenedWidget(section.uuid, null)
                                                                      }}
                                                                      primary={section.name}/>
                                                        <IconButton sx={{width: '40px', height: '40px'}} onClick={() => {
                                                            updateOpenedWidget(section.uuid, null)
                                                        }}>
                                                            <IconUrl path={'mdi_arrow_drop_down'}/>
                                                        </IconButton>
                                                    </ListItem>

                                                    <Collapse
                                                        in={open.find((i: string) => i == section.uuid) !== undefined}>

                                                        <Card style={{width: '50%', margin: 5}}>
                                                            <CardContent>
                                                                {
                                                                    section.jsonWidgets.map((jw: JsonWidgetModel) => (
                                                                        <ItemCheckbox key={jw.uuid}
                                                                                      checked={widget.find((i: { uuid: string; }) => i.uuid == section.uuid)?.jsonWidgets.find((j: { uuid: string; }) => j.uuid == jw.uuid) !== undefined}
                                                                                      onChange={(v: any) => handleWidgetCheck(v, section, jw)}
                                                                                      data={jw}></ItemCheckbox>
                                                                    ))
                                                                }
                                                            </CardContent>
                                                        </Card>
                                                    </Collapse>
                                                </Box>))
                                        }

                                    </FormControl>
                                </Stack>
                            </CardContent>
                        </Card>

                        {/*<Typography variant="body1" fontWeight={400} margin={'16px 0'} gutterBottom>
                            Preview
                        </Typography>
                        <Card>
                            <CardContent>
                                <FormBuilder
                                    form={{
                                        display: 'form',
                                        components
                                    }}
                                  />
                            </CardContent>
                        </Card>*/}

                        <div style={{height: 70}}></div>

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
