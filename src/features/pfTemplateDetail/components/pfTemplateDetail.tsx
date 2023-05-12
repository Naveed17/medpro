import * as Yup from "yup";
import {Form, FormikProvider, useFormik} from "formik";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControl,
    Skeleton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {styled} from "@mui/material/styles";
import React, {useEffect, useState} from "react";
import {useTranslation} from "next-i18next";
import {ModelDot} from "@features/modelDot";
import dynamic from "next/dynamic";
import {useRequest, useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import ItemCheckboxPF from "@themes/overrides/itemCheckboxPF";
import {LoadingScreen} from "@features/loadingScreen";
import {useMedicalProfessionalSuffix} from "@app/hooks";
import ReactDOM from "react-dom/client";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";

const FormBuilder: any = dynamic(
    () => import("@formio/react").then((mod: any) => mod.Form),
    {
        ssr: false,
    }
);

const PaperStyled = styled(Form)(({theme}) => ({
    backgroundColor: "#F0F7FA",
    borderRadius: 0,
    minWidth: "650px",
    height: "100%",
    border: "none",
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(0),
    [theme.breakpoints.down("md")]: {
        minWidth: 0,
    },
    "& .container": {
        maxHeight: 680,
        overflowY: "auto",
        "& .MuiCard-root": {
            border: "none",
            "& .MuiCardContent-root": {
                padding: theme.spacing(2),
            },
        },
    },
    "& .bottom-section": {
        background: theme.palette.background.paper,
        padding: theme.spacing(1),
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(-2),
        marginRight: theme.spacing(-2),
        position: "fixed",
        width: "650px",
        bottom: 0,
        borderTop: `3px solid ${theme.palette.grey["A700"]}`,
        [theme.breakpoints.down("md")]: {
            width: "100%",
        },
    },
    "& fieldset legend": {
        display: "none",
    },
}));

function PfTemplateDetail({...props}) {
    const {data: session} = useSession();
    const router = useRouter();
    const urlMedicalProfessionalSuffix = useMedicalProfessionalSuffix();

    const {t, ready} = useTranslation("settings", {keyPrefix: "templates.config.dialog"});

    const colors = [
        "#FEBD15",
        "#FF9070",
        "#DF607B",
        "#9A5E8A",
        "#526686",
        "#96B9E8",
        "#72D0BE",
        "#56A97F",
    ];
    const [modelColor, setModelColor] = useState(props.data ? props.data.color : "#FEBD15");
    const [sections, setSections] = useState<SpecialtyJsonWidgetModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [widget, setWidget] = useState<SpecialtyJsonWidgetModel[]>([]);
    const [open, setOpen] = useState<string[]>([]);
    const [components, setComponents] = useState<any[]>([]);
    const initalData = Array.from(new Array(4));

    const {trigger: triggerModalRequest} = useRequestMutation(null, "/settings/pfTemplateDetails");

    const {data: jsonWidgetsResponse} = useRequest({
        method: "GET",
        url: "/api/private/json-widgets/specialities/fr",
        headers: {Authorization: `Bearer ${session?.accessToken}`},
    }, SWRNoValidateConfig);

    useEffect(() => {
        if (jsonWidgetsResponse) {
            const widgets = (jsonWidgetsResponse as HttpResponse).data;
            setSections(widgets);

            if (props.data) {
                setComponents(props.data.structure);
                let wdg: any[] = [];
                props.data.structure.map((comp: any) => {
                    const component = widgets.find(
                        (elm: SpecialtyJsonWidgetModel) => elm.fieldSet.key === comp.key
                    );
                    wdg.push({...component});
                });
                setWidget([...wdg]);
                setTimeout(() => {
                    const adultTeeth = document.getElementById('adultTeeth');
                    const childTeeth = document.getElementById('childTeeth');
                    if (adultTeeth) {
                        const root = ReactDOM.createRoot(adultTeeth);
                        root.render(
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={'/static/img/adultTeeth.svg'} alt={"adult teeth"}/>
                        );
                    }
                    if (childTeeth) {
                        const root = ReactDOM.createRoot(childTeeth);
                        root.render(
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={'/static/img/childTeeth.svg'} alt={"child teeth"}/>
                        );
                    }
                }, 2000)
            }
        }

    }, [jsonWidgetsResponse, props.data]);

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, t("ntc"))
            .max(50, t("ntl"))
            .required(t("nameReq")),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: props.data ? (props.data.label as string) : "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            const struct: any[] = [];
            widget.map((w) => {
                w.jsonWidgets.map((jw) => {
                    w.fieldSet.components = [...w.fieldSet.components, ...jw.structure];
                });
                struct.push(w.fieldSet);
            });

            /*if (struct.length > 0)
                            struct[0].components.push({
                                key: "submit",
                                type: "button",
                                input: true,
                                label: "Submit",
                                tableView: false,
                                customClass: "sub-btn",
                                disableOnInvalid: true,
                                saveOnEnter: false,
                                showValidations: false,
                            })*/

            const form = new FormData();
            form.append("label", values.name);
            form.append("color", modelColor);
            form.append("structure", JSON.stringify(struct));
            const editAction = props.action === "edit" && !props.data.hasData;
            triggerModalRequest({
                method: editAction ? "PUT" : "POST",
                url: `${urlMedicalProfessionalSuffix}/modals${editAction ? `/${props.data.uuid}` : ""}/${router.locale}`,
                data: form,
                headers: {Authorization: `Bearer ${session?.accessToken}`}
            }).then(() => {
                props.mutate();
                props.closeDraw();
                setLoading(false);
            });
        },
    });

    const {
        errors,
        touched,
        handleSubmit,
        getFieldProps,
    } = formik;

    const handleWidgetCheck = (
        ev: boolean,
        parent: SpecialtyJsonWidgetModel,
        child: JsonWidgetModel | null
    ) => {
        const index = widget.findIndex(
            (v: SpecialtyJsonWidgetModel) => v.uuid === parent.uuid
        );
        if (child !== null) {
            if (ev) {
                if (index === -1) {
                    setWidget([...widget, {...parent, jsonWidgets: [child]}]);
                } else {
                    widget[index].jsonWidgets = [...widget[index].jsonWidgets, child];
                    setWidget([...widget]);
                }
            } else {
                const widgetindex = widget[index].jsonWidgets.findIndex(
                    (v: JsonWidgetModel) => v.uuid === child.uuid
                );
                let newWid = widget[index].jsonWidgets;
                newWid = [
                    ...newWid.slice(0, widgetindex),
                    ...newWid.slice(widgetindex + 1, newWid.length),
                ];
                widget[index].jsonWidgets = newWid;
                if (newWid.length === 0)
                    setWidget([
                        ...widget.slice(0, index),
                        ...widget.slice(index + 1, widget.length),
                    ]);
                else setWidget([...widget]);
            }
        } else {
            index === -1
                ? setWidget([...widget, {...parent}])
                : setWidget([
                    ...widget.slice(0, index),
                    ...widget.slice(index + 1, widget.length),
                ]);
            updateOpenedWidget(parent.uuid, index === -1);
        }
    };

    const updateOpenedWidget = (widget: string, state: boolean | null) => {
        const index = open.findIndex((v: string) => v === widget);
        if (state !== null) {
            if (index === -1 && state) setOpen([...open, widget]);
            if (index !== -1 && !state)
                setOpen([
                    ...open.slice(0, index),
                    ...open.slice(index + 1, open.length),
                ]);
        } else {
            index === -1
                ? setOpen([...open, widget])
                : setOpen([
                    ...open.slice(0, index),
                    ...open.slice(index + 1, open.length),
                ]);
        }
    };

    if (!ready) return (<LoadingScreen error button={"loading-error-404-reset"} text={"loading-error"}/>);

    console.log("props", props);

    return (
        <Box style={{background: "black"}}>
            {props.action === "see" && (
                <FormikProvider value={formik}>
                    <PaperStyled
                        autoComplete="off"
                        noValidate
                        className="root"
                        onSubmit={handleSubmit}>
                        <Stack spacing={2} direction="row" sx={{marginBottom: "2rem"}}>
                            <ModelDot
                                key={modelColor}
                                color={modelColor}
                                selected={false}></ModelDot>
                            <Typography variant="h6" gutterBottom>
                                {t("title") + props.data.label}
                            </Typography>
                        </Stack>

                        <FormBuilder
                            form={{
                                display: "form",
                                components: components,
                            }}
                        />
                    </PaperStyled>
                </FormikProvider>
            )}
            {props.action !== "see" && (
                <FormikProvider value={formik}>
                    <PaperStyled
                        autoComplete="off"
                        noValidate
                        className="root"
                        onSubmit={handleSubmit}>
                        <Typography variant="h6" gutterBottom>
                            {props.data ? t("titleEdit") : t("titleAdd")}
                        </Typography>
                        <Typography
                            variant="body1"
                            fontWeight={400}
                            margin={"16px 0"}
                            gutterBottom>
                            {t("info")}
                        </Typography>

                        <Card>
                            <CardContent>
                                <Stack spacing={2}>
                                    <FormControl size="small" fullWidth>
                                        <Typography
                                            variant="body2"
                                            marginTop={2}
                                            marginBottom={1}
                                            gutterBottom>
                                            {t("named")}
                                        </Typography>

                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            helperText={touched.name && errors.name}
                                            {...getFieldProps("name")}
                                            error={Boolean(touched.name && errors.name)}></TextField>

                                        <Typography
                                            variant="body2"
                                            marginTop={2}
                                            marginBottom={1}
                                            gutterBottom>
                                            {t("selectColor")}
                                        </Typography>

                                        <Stack spacing={1} direction={"row"}>
                                            {colors.map((color) => (
                                                <ModelDot
                                                    key={color}
                                                    color={color}
                                                    onClick={() => {
                                                        setModelColor(color);
                                                    }}
                                                    selected={color === modelColor}></ModelDot>
                                            ))}
                                        </Stack>
                                    </FormControl>
                                </Stack>
                            </CardContent>
                        </Card>

                        <Typography
                            variant="body1"
                            fontWeight={400}
                            margin={"16px 0"}
                            gutterBottom>
                            {t("info")}
                        </Typography>

                        <Card>
                            <CardContent>
                                <Stack spacing={2}>
                                    <FormControl size="small" fullWidth>
                                        <Typography
                                            variant="body2"
                                            marginTop={2}
                                            marginBottom={1}
                                            gutterBottom>
                                            {t("select")}
                                        </Typography>

                                        {sections.length === 0
                                            ? initalData.map((item, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        margin: "0 5px",
                                                    }}>
                                                    <Checkbox size="small"/>
                                                    <Skeleton width={180} variant="text"/>
                                                </Box>
                                            ))
                                            : sections.map(
                                                (
                                                    section: SpecialtyJsonWidgetModel,
                                                    index: number
                                                ) => (
                                                    <Box key={index}>
                                                        {/*<ListItem key={section.uuid} sx={{padding: 0}}>
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
                                                        in={open.find((i: string) => i == section.uuid) !== undefined}>*/}
                                                        <Card
                                                            sx={{
                                                                width: {xs: "100%", md: "50%"},
                                                                margin: 0.5,
                                                            }}>
                                                            <CardContent>
                                                                {section.jsonWidgets.map(
                                                                    (jw: JsonWidgetModel) => (
                                                                        <ItemCheckboxPF
                                                                            key={jw.uuid}
                                                                            checked={widget.find((i: {
                                                                                uuid: string
                                                                            }) =>
                                                                                i.uuid == section.uuid)?.jsonWidgets.find((j: {
                                                                                uuid: string
                                                                            }) =>
                                                                                j.uuid == jw.uuid) !== undefined}
                                                                            onChange={(v: any) =>
                                                                                handleWidgetCheck(v, section, jw)
                                                                            }
                                                                            data={jw}></ItemCheckboxPF>
                                                                    )
                                                                )}
                                                            </CardContent>
                                                        </Card>
                                                        {/*</Collapse>*/}
                                                    </Box>
                                                )
                                            )}
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

                        <Stack
                            className="bottom-section"
                            justifyContent="flex-end"
                            spacing={2}
                            direction={"row"}>
                            <Button onClick={props.closeDraw}>{t("cancel")}</Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                variant="contained"
                                color="primary">
                                {t("save")}
                            </Button>
                        </Stack>
                    </PaperStyled>
                </FormikProvider>
            )}
        </Box>
    );
}

export default PfTemplateDetail;
