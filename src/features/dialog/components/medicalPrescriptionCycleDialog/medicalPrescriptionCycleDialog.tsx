import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    ListSubheader,
    Paper,
    Radio,
    Select,
    Stack,
    Tab,
    Tabs,
    TextField,
    Theme,
    Typography,
    useMediaQuery,
} from "@mui/material";
import {Form, FormikProvider, useFormik} from "formik";
import React, {useEffect, useRef, useState} from "react";
import {LoadingButton} from "@mui/lab";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MedicalPrescriptionCycleStyled from "./overrides/medicalPrescriptionCycleStyled";
import IconUrl from "@themes/urlIcon";
import {
    Dialog as CustomDialog,
    dialogSelector,
    dosageMeal,
    duration,
    handleDrawerAction,
    initPrescriptionCycleData,
    ModelPrescriptionList,
    prescriptionSelector,
    setParentModel,
} from "@features/dialog";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {configSelector} from "@features/base";
import CloseIcon from "@mui/icons-material/Close";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import {AnimatePresence, motion} from "framer-motion";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import MenuItem from "@mui/material/MenuItem";
import * as Yup from "yup";
import {a11yProps, useLastPrescription, useMedicalProfessionalSuffix,} from "@lib/hooks";
import {TabPanel} from "@features/tabPanel";
import {useTranslation} from "next-i18next";
import {useSnackbar} from "notistack";
import FormControl from "@mui/material/FormControl";
import {MedicalFormUnit, PrescriptionMultiUnits} from "@lib/constants";
import ModelSwitchButton from "./modelSwitchButton";
import {search} from "fast-fuzzy";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";

function MedicalPrescriptionCycleDialog({...props}) {
    const {data} = props;
    const {setState: setDrugs, state: drugs} = data;
    const router = useRouter();
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
    const refs = useRef([]);
    const refContainer = useRef(null);
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();
    const {enqueueSnackbar} = useSnackbar();
    const {lastPrescriptions} = useLastPrescription();

    const {t} = useTranslation("consultation", {keyPrefix: "consultationIP"});
    const {direction} = useAppSelector(configSelector);
    const {drawerAction} = useAppSelector(dialogSelector);
    const {name: modelName, parent: modelParent} = useAppSelector(prescriptionSelector);

    const [openAddParentDialog, setOpenAddParentDialog] = useState(false);
    const [parentModelName, setParentModelName] = useState<string>("");
    const [drugsList, setDrugsList] = useState<DrugModel[]>([]);
    const [initialOpenData, setInitialOpenData] = useState<any[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const fractions = [
        "1/4",
        "1/2",
        "1",
        "1.25",
        "1.5",
        "1.75",
        "2",
        "2.5",
        ...Array.from({length: 30}, (v, k) => (k + 3).toString()),
    ];
    const [info, setInfo] = useState("");
    const [loading, setLoading] = useState(false);
    const [editModel, setEditModel] = useState<PrescriptionPatternModel | null>(
        null
    );
    const [prescriptionTabIndex, setPrescriptionTabIndex] = useState(0);

    const validationSchema = Yup.object().shape({
        data: Yup.array().of(
            Yup.object().shape({
                drug: Yup.object()
                    .shape({
                        uuid: Yup.string(),
                        form: Yup.string().nullable(),
                        dci: Yup.string().nullable(),
                        dose: Yup.string().nullable(),
                        commercial_name: Yup.string(),
                        isVerified: Yup.boolean(),
                        inputValue: Yup.string(),
                    })
                    .nullable()
                    .required("drug_error"),
                unit: Yup.string().nullable(),
                cycles: Yup.array().of(
                    Yup.object().shape({
                        count: Yup.number(),
                        dosageQty: Yup.string(),
                        dosageDuration: Yup.number(),
                        dosageMealValue: Yup.string(),
                        durationValue: Yup.string(),
                        dosageInput: Yup.boolean(),
                        cautionaryNoteInput: Yup.boolean(),
                        dosageInputText: Yup.string(),
                        cautionaryNote: Yup.string(),
                        dosageTime: Yup.array()
                            .of(
                                Yup.object().shape({
                                    label: Yup.string(),
                                    value: Yup.boolean(),
                                })
                            )
                            .compact((v) => !v.value)
                            .min(1, "dosageTime_error"),
                        dosageMeal: Yup.array().of(
                            Yup.object().shape({
                                label: Yup.string(),
                                value: Yup.string(),
                            })
                        ),
                        duration: Yup.array().of(
                            Yup.object().shape({
                                label: Yup.string(),
                                value: Yup.string(),
                            })
                        ),
                    })
                ),
            })
        ),
    });

    const getMedicForm = (drug: any) => {
        const [first, ...rest] = (drug.cycles?.length > 0 ? drug.cycles[0].dosage.split(",")[0] : "")?.split(" ");
        const unit = rest.join(" ");
        const hasMultiValues = PrescriptionMultiUnits.includes(unit);
        const hasMedicalFormUnit = MedicalFormUnit.find(
            (item) => item.unit === unit
        );
        return (drug.cycles?.length > 0 && drug.cycles[0].dosage.split(",")[0] && hasMedicalFormUnit)
            ? `${hasMedicalFormUnit.forms[0].form}${hasMultiValues ? `_${unit}` : ""}`
            : unit;
    };

    const setInitData = (drugs: DrugModel[]) => {
        const data: any[] =
            drugs?.length === 0
                ? [
                    {
                        drug: null,
                        unit: null,
                        cycles: initPrescriptionCycleData.cycles as any[],
                    },
                ]
                : [];
        drugs?.map((drug: any) => {
            data.push({
                drug: {
                    uuid: drug.drugUuid,
                    commercial_name: drug.name,
                    dci: "",
                    dose: null,
                    form: "",
                    isVerified: true,
                } as any,
                unit: getMedicForm(drug),
                cycles: (drug.cycles?.length === 0 && (drug.duration === "" || drug.duration === null) && drug.durationType === "")
                    ? []
                    : drug.cycles.map((cycle: PrescriptionCycleModel) => ({
                        count: cycle.dosage.split(" ")[0]
                            ? cycle.dosage.split(" ")[0] === fractions[0]
                                ? 0
                                : cycle.dosage.split(" ")[0] === fractions[1]
                                    ? 1
                                    : parseInt(cycle.dosage.split(" ")[0]) + 1
                            : 2,
                        dosageQty: cycle.dosage.split(" ")[0]
                            ? cycle.dosage.split(" ")[0]
                            : "1",
                        dosageDuration: cycle.duration ? cycle.duration : 1,
                        dosageMealValue:
                            cycle.dosage !== "" &&
                            cycle.dosage.split(",")[2] &&
                            cycle.dosage.split(",")[2].length > 0
                                ? dosageMeal.find((meal) =>
                                    cycle.dosage.split(",")[2].includes(t(meal.label))
                                )?.label
                                : "",
                        durationValue: cycle.durationType ? cycle.durationType : "",
                        dosageInput: cycle.isOtherDosage ? cycle.isOtherDosage : false,
                        cautionaryNoteInput: cycle.note?.length > 0,
                        dosageInputText: cycle.isOtherDosage ? cycle.dosage : "",
                        cautionaryNote: cycle.note !== "" ? cycle.note : "",
                        dosageTime: [
                            {
                                label: "morning",
                                value: cycle.dosage.split(",")[1]
                                    ? cycle.dosage.split(",")[1].includes(t("morning"))
                                    : false,
                            },
                            {
                                label: "mid_day",
                                value: cycle.dosage.split(",")[1]
                                    ? cycle.dosage.split(",")[1].includes(t("mid_day"))
                                    : false,
                            },
                            {
                                label: "evening",
                                value: cycle.dosage.split(",")[1]
                                    ? cycle.dosage.split(",")[1].includes(t("evening"))
                                    : false,
                            },
                            {
                                label: "before_sleeping",
                                value: cycle.dosage.split(",")[1]
                                    ? cycle.dosage
                                        .split(",")[1]
                                        .includes(t("before_sleeping"))
                                    : false,
                            },
                        ],
                        dosageMeal,
                        duration,
                    })),
            });
        });

        return data;
    };

    const formik = useFormik({
        enableReinitialize: false,
        initialValues: {
            data: setInitData(drugs),
            dosageValues: [],
        },
        validationSchema,
        onSubmit: (values) => {
            console.log(values);
        },
    });

    const {setFieldValue, values, getFieldProps, errors, touched} = formik;

    const {trigger: triggerDrugList} = useRequestQueryMutation("consultation/drugs");
    const {trigger: triggerPrescriptionModel} = useRequestQueryMutation("consultation/prescription/model");
    const {trigger: triggerPrescriptionParent} = useRequestQueryMutation("consultation/prescription/model/parent");
    const {trigger: triggerEditPrescriptionModel} = useRequestQueryMutation("/consultation/prescription/model/edit");

    const {data: ParentModelResponse, mutate: mutateParentModel} = useRequestQuery(urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/prescriptions/modals/parents/${router.locale}`,
    } : null, ReactQueryNoValidateConfig);

    const handleAddDrug = () => {
        setFieldValue("data", [
            ...values.data,
            {...initPrescriptionCycleData},
        ]).then(() => {
            (refContainer.current as any)?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        });
    }

    const switchModel = (drugs: DrugModel[]) => {
        setDrugs(drugs);
        setFieldValue("data", setInitData(drugs));
    }

    const editPrescriptionModel = (props: any) => {
        setEditModel(props.node);
    }

    const editPrescriptionAction = () => {
        setLoading(true);
        const form = new FormData();
        form.append('drugs', JSON.stringify(drugs));
        editModel?.text && form.append('name', editModel.text);
        editModel?.parent && form.append('parent', editModel.parent.toString());
        triggerEditPrescriptionModel({
            method: "PUT",
            url: `${urlMedicalProfessionalSuffix}/prescriptions/modals/${editModel?.id}/${router.locale}`,
            data: form,
        }, {
            onSuccess: (result) => {
                mutateParentModel().then(() => {
                    setLoading(false);
                    setDrugsList((result?.data as HttpResponse)?.data);
                    setEditModel(null);
                    enqueueSnackbar(t("editWithsuccess"), {variant: "success"});
                });
            }
        });
    }

    const handleRemoveCycle = (idx: number, value: any) => {
        const filtered = values.data[idx].cycles.filter(
            (item: any) => item !== value
        );
        setFieldValue(`data[${idx}].cycles`, filtered);
    }

    const handleRemoveDrug = (idx: number) => {
        const filtered = values.data.filter(
            (item: any, index: number) => index !== idx
        );
        setFieldValue(`data`, filtered);
    }

    const handAddCycle = (index: number) => {
        setFieldValue(`data[${index}].cycles`, [
            ...values.data[index].cycles,
            ...initPrescriptionCycleData.cycles,
        ]);
    }

    const handlePrescriptionTabChange = (
        event: React.SyntheticEvent,
        newValue: number
    ) => {
        setPrescriptionTabIndex(newValue);
    }

    const handleDosageQty = (prop: string, index: number, idx: number) => {
        setFieldValue(`data[${idx}].cycles[${index}].dosageInput`, false);
        let dosage = values.data[idx].cycles[index].count;

        if (prop === "plus") {
            if (values.data[idx].cycles[index].count < fractions.length - 1) {
                dosage += 1;
            }
        } else {
            if (values.data[idx].cycles[index].count > 0) {
                dosage -= 1;
            }
        }
        setFieldValue(`data[${idx}].cycles[${index}].count`, dosage);
        setFieldValue(
            `data[${idx}].cycles[${index}].dosageQty`,
            fractions[dosage]
        );
    }

    const durationCounter = (prop: string, index: number, idx: number) => {
        setFieldValue(`data[${idx}].cycles[${index}].dosageInput`, false);
        const currentDosage = values.data[idx].cycles[index].dosageDuration;
        let sign = -1;
        if (prop === "plus") {
            if (currentDosage < fractions.length - 1) {
                sign = 1;
            }
        }

        setFieldValue(
            `data[${idx}].cycles[${index}].dosageDuration`,
            currentDosage + (sign)
        );
    }

    const handleSaveDialog = () => {
        const form = new FormData();
        form.append("globalNote", "");
        form.append("name", modelName);
        form.append("parent", modelParent);
        form.append("drugs", JSON.stringify(drugs));
        triggerPrescriptionModel({
            method: "POST",
            url: `${urlMedicalProfessionalSuffix}/prescriptions/modals/${router.locale}`,
            data: form,
        }, {
            onSuccess: () =>
                mutateParentModel().then(() => {
                    setInitialOpenData([modelParent]);
                    setPrescriptionTabIndex(1);
                })
        });
        setOpenDialog(false);
    }

    const handleAddParentModel = () => {
        setLoading(true);
        const form = new FormData();
        form.append("name", parentModelName);
        triggerPrescriptionParent({
            method: "POST",
            url: `${urlMedicalProfessionalSuffix}/prescriptions/modals/parents/${router.locale}`,
            data: form,
        }, {
            onSuccess: () => {
                mutateParentModel().then((result: any) => {
                    const models = (result?.data as HttpResponse)?.data as PrescriptionParentModel[];
                    dispatch(setParentModel(models[models.length - 1]?.uuid));
                    setOpenAddParentDialog(false);
                    setParentModelName("");
                    setLoading(false);
                });
            }
        });
    }

    const getFormUnitMedic: any = (form: string) => {
        const hasMultiValues = form.split("_");
        let formUnitMedic: any;
        if (hasMultiValues.length > 1) {
            formUnitMedic = MedicalFormUnit.find(
                (medic: any) => medic.unit == hasMultiValues[1]
            );
        } else {
            formUnitMedic =
                MedicalFormUnit.find((medic: any) => {
                    const matchFormUnit: string[] = search(
                        form,
                        medic.forms.map((data: any) => data.form),
                        {returnMatchData: true}
                    ).reduce((filtered: string[], option) => {
                        if (option.score >= 0.8) {
                            filtered.push(option.item as string);
                        }
                        return filtered;
                    }, []);
                    return matchFormUnit.length > 0;
                }) ?? form;
        }
        return formUnitMedic;
    }

    const generateDosageText = (cycle: any, unit?: string) => {
        return unit && cycle.dosageTime.some((time: any) => time.value)
            ? `${cycle.dosageQty} ${
                getFormUnitMedic(unit).unit ?? unit
            }${parseFloat(cycle.dosageQty) >= 2 ? "(s)" : ""}, ${cycle.dosageTime
                .filter((time: any) => time.value)
                .map((time: any) => t(time.label))
                .join("/")} ${
                cycle.dosageMealValue && cycle.dosageMealValue.length > 0
                    ? `, ${t(cycle.dosageMealValue)}`
                    : ""
            }`
            : "";
    }

    const models = (ParentModelResponse as HttpResponse)?.data as PrescriptionParentModel[];

    useEffect(() => {
        if (models && models.length > 0) {
            dispatch(setParentModel(models[0].uuid));
        }
    }, [dispatch, models]);

    useEffect(() => {
        if (drawerAction === "addDrug") {
            if (Math.abs(values.data.length - (drugs.length + 1)) === 1) {
                handleAddDrug();
            }
            dispatch(handleDrawerAction(""));
        }
    }, [dispatch, drawerAction]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (values) {
            const drugs: any[] = [];
            values.data.map((data: any) => {
                if (data.drug) {
                    const drug = data.drug as DrugModel;
                    const cycles = data.cycles.map((cycle: any) => ({
                        dosage: cycle.dosageInput
                            ? cycle.dosageInputText
                            : generateDosageText(cycle, data.unit),
                        duration:
                            cycle.durationValue.length > 0 ? cycle.dosageDuration : null,
                        durationType:
                            cycle.durationValue.length > 0 ? cycle.durationValue : "",
                        note: cycle.cautionaryNote?.length > 0 ? cycle.cautionaryNote : "",
                        isOtherDosage: cycle.dosageInput,
                    }));
                    drugs.push({
                        cycles,
                        drugUuid: drug?.uuid,
                        name: drug?.commercial_name,
                    });
                }
            });
            if (drugs.length > 0 || (values.data && values.data.length === 0)) {
                setDrugs(drugs);
            }
        }
    }, [values]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <MedicalPrescriptionCycleStyled>
            <Container fixed>
                <Grid
                    container
                    spacing={{xs: 0, md: 2}}
                    sx={{flexDirection: {xs: "column-reverse", md: "row"}}}>
                    <Grid item md={8} xs={12}>
                        <FormikProvider value={formik}>
                            <Stack
                                ref={refContainer}
                                component={Form}
                                spacing={1}
                                autoComplete="off"
                                noValidate>
                                {values.data.map((item: any, idx: number) => (
                                    <Paper
                                        ref={(element) => {
                                            (refs.current as any)[idx] = element;
                                        }}
                                        className="custom-paper"
                                        key={idx}>
                                        <Grid container spacing={{xs: 1, md: 2}} alignItems="center">
                                            <Grid item sm={0.5} xs={1}>
                                                <Stack direction="row" alignItems="center">
                                                      <span style={{fontSize: 20, fontWeight: "bold"}}>
                                                        {idx + 1}
                                                      </span>
                                                    <FiberManualRecordIcon sx={{fontSize: 6, ml: .8}}/>
                                                </Stack>
                                            </Grid>
                                            <Grid item className={"drug-input"} sm={7.5} xs={11}>
                                                {drugsList && (
                                                    <Autocomplete
                                                        id="cmo"
                                                        value={item.drug}
                                                        freeSolo
                                                        onChange={(e, drug) => {
                                                            e.stopPropagation();
                                                            if (
                                                                (drug as DrugModel)?.inputValue ||
                                                                typeof drug === "string"
                                                            ) {
                                                                // Create a new value from the user input
                                                                setFieldValue(`data[${idx}].drug`, {
                                                                    commercial_name:
                                                                        typeof drug === "string"
                                                                            ? drug
                                                                            : (drug as DrugModel)?.inputValue,
                                                                    isVerified: false,
                                                                });
                                                            } else {
                                                                setFieldValue(
                                                                    `data[${idx}].drug`,
                                                                    drug as DrugModel
                                                                );
                                                                setFieldValue(`data[${idx}].unit`, drug?.form);
                                                            }
                                                        }}
                                                        size="small"
                                                        options={drugsList}
                                                        noOptionsText={t("startWriting")}
                                                        getOptionLabel={(option) => {
                                                            // Value selected with enter, right from the input
                                                            if (typeof option === "string") {
                                                                return option;
                                                            }
                                                            // Add "xxx" option created dynamically
                                                            if (option.inputValue) {
                                                                return option.inputValue;
                                                            }
                                                            // Regular option
                                                            return option.commercial_name;
                                                        }}
                                                        filterOptions={(options, params) => {
                                                            const {inputValue} = params;
                                                            const filtered = options.filter((option) =>
                                                                option.commercial_name
                                                                    .toLowerCase()
                                                                    .includes(inputValue.toLowerCase())
                                                            );
                                                            // Suggest the creation of a new value
                                                            const isExisting = options.some(
                                                                (option) =>
                                                                    inputValue.toLowerCase() ===
                                                                    option.commercial_name.toLowerCase()
                                                            );
                                                            if (inputValue !== "" && !isExisting) {
                                                                filtered.push({
                                                                    inputValue,
                                                                    commercial_name: `${t(
                                                                        "add_drug"
                                                                    )} "${inputValue}"`,
                                                                    isVerified: false,
                                                                });
                                                            }
                                                            return filtered;
                                                        }}
                                                        isOptionEqualToValue={(option, value) =>
                                                            option?.commercial_name === value?.commercial_name
                                                        }
                                                        renderOption={(props, option) => (
                                                            <Stack key={option.uuid ? option.uuid : "-1"}>
                                                                {!option.uuid && <Divider/>}
                                                                <MenuItem
                                                                    {...props}
                                                                    {...(!option.uuid && {
                                                                        sx: {fontWeight: "bold"},
                                                                    })}
                                                                    value={option.uuid}>
                                                                    {!option.uuid && <AddOutlinedIcon/>}
                                                                    {option.commercial_name}
                                                                </MenuItem>
                                                            </Stack>
                                                        )}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                error={Boolean(
                                                                    touched.data &&
                                                                    errors.data &&
                                                                    (errors.data as any)[idx]?.drug
                                                                )}
                                                                onChange={(ev) => {
                                                                    if (ev.target.value.length >= 2) {
                                                                        triggerDrugList({
                                                                            method: "GET",
                                                                            url: `/api/drugs/${router.locale}?name=${ev.target.value}`,
                                                                        }, {
                                                                            onSuccess: (cnx) => setDrugsList((cnx?.data as HttpResponse)?.data ?? [])
                                                                        });
                                                                    }
                                                                }}
                                                                placeholder={t("placeholder_drug_name")}
                                                            />
                                                        )}
                                                    />
                                                )}
                                            </Grid>

                                            <Grid item xs={1} sx={{display: {xs: 'block', sm: 'none'}}}/>

                                            <Grid item sm={3.2} xs={10}>
                                                <Autocomplete
                                                    size="small"
                                                    freeSolo
                                                    value={
                                                        values.data[idx].unit
                                                            ? getFormUnitMedic(values.data[idx].unit)
                                                            : ""
                                                    }
                                                    onChange={(event, data) => {
                                                        const hasMultiValues =
                                                            data &&
                                                            PrescriptionMultiUnits.includes(data.unit);
                                                        values.data[idx].cycles.forEach(
                                                            (element: any, index: number) =>
                                                                setFieldValue(
                                                                    `data[${idx}].cycles[${index}].dosageInput`,
                                                                    false
                                                                )
                                                        );
                                                        setFieldValue(
                                                            `data[${idx}].unit`,
                                                            data
                                                                ? typeof data === "string"
                                                                    ? data
                                                                    : `${data.forms[0].form}${
                                                                        hasMultiValues ? `_${data.unit}` : ""
                                                                    }`
                                                                : ""
                                                        );
                                                    }}
                                                    placeholder={t("unit", {ns: "consultation"})}
                                                    noOptionsText={t("no_unit")}
                                                    options={MedicalFormUnit}
                                                    getOptionLabel={(option) => {
                                                        // Value selected with enter, right from the input
                                                        if (typeof option === "string") {
                                                            return option;
                                                        }
                                                        // Regular option
                                                        return option.unit;
                                                    }}
                                                    isOptionEqualToValue={(option: any, value) =>
                                                        option?.unit === value?.unit
                                                    }
                                                    renderInput={(params) => (
                                                        <TextField placeholder={t("unit")} {...params} />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid
                                                className={"grid-action"}
                                                item
                                                sm={0.8}
                                                xs={1}
                                                pb={0.2}
                                                sx={{textAlign: {xs: "right", md: "left"}}}>
                                                <IconButton
                                                    onClick={() => handleRemoveDrug(idx)}
                                                    className="btn-del-drug">
                                                    <IconUrl path="icdelete"/>
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                        <Stack component={AnimatePresence} mode="popLayout" spacing={2}>
                                            {item.cycles.map((innerItem: any, index: number) => (
                                                <Card
                                                    component={motion.div}
                                                    initial={{y: -100}}
                                                    animate={{y: 0}}
                                                    transition={{duration: 0.5}}
                                                    className="cycle-card"
                                                    key={index}>
                                                    <CardContent>
                                                        <Stack>
                                                            <Stack
                                                                spacing={3}
                                                                direction={{xs: "column", md: "row"}}
                                                                flexWrap="wrap"
                                                                alignItems="center">
                                                                <Stack
                                                                    width={{xs: "100%", md: "auto"}}
                                                                    spacing={0.5}
                                                                    mb={0.5}
                                                                    direction={{xs: "column", sm: "row"}}
                                                                    alignItems="center">
                                                                    <Button
                                                                        sx={{
                                                                            justifyContent: {
                                                                                xs: "space-between",
                                                                                md: "center",
                                                                                width: {xs: '100%', md: 'auto'},

                                                                            },

                                                                        }}

                                                                        onClick={(event: any) => {
                                                                            event.stopPropagation();
                                                                            event.preventDefault();
                                                                        }}
                                                                        component="label"
                                                                        endIcon={
                                                                            <IconButton
                                                                                disabled={
                                                                                    innerItem.dosageQty ===
                                                                                    fractions[fractions.length - 1]
                                                                                }
                                                                                onClick={() =>
                                                                                    handleDosageQty("plus", index, idx)
                                                                                }
                                                                                size="small"
                                                                                disableRipple>
                                                                                <AddIcon/>
                                                                            </IconButton>
                                                                        }
                                                                        startIcon={
                                                                            <IconButton
                                                                                disabled={
                                                                                    innerItem.dosageQty === fractions[0]
                                                                                }
                                                                                onClick={() =>
                                                                                    handleDosageQty("minus", index, idx)
                                                                                }
                                                                                size="small"
                                                                                disableRipple>
                                                                                <RemoveIcon/>
                                                                            </IconButton>
                                                                        }
                                                                        variant="white"
                                                                        disableRipple>
                                                                        {innerItem.dosageQty}
                                                                    </Button>
                                                                    {!isMobile ? (
                                                                        innerItem.dosageTime.map(
                                                                            (subitem: any, i: number) => (
                                                                                <Button
                                                                                    component="label"
                                                                                    variant="white"
                                                                                    disableRipple
                                                                                    startIcon={
                                                                                        <Checkbox
                                                                                            checked={
                                                                                                values.data[idx].cycles[index]
                                                                                                    .dosageTime[i].value
                                                                                            }
                                                                                            onChange={(event) => {
                                                                                                setFieldValue(
                                                                                                    `data[${idx}].cycles[${index}].dosageInput`,
                                                                                                    false
                                                                                                );
                                                                                                setFieldValue(
                                                                                                    `data[${idx}].cycles[${index}].dosageTime[${i}].value`,
                                                                                                    event.target.checked
                                                                                                );
                                                                                            }}
                                                                                        />
                                                                                    }
                                                                                    key={subitem.label}>
                                                                                    {t(subitem.label, {
                                                                                        ns: "consultation",
                                                                                    })}
                                                                                </Button>
                                                                            )
                                                                        )
                                                                    ) : (
                                                                        <FormControl fullWidth>
                                                                            <Select
                                                                                labelId="demo-multiple-checkbox-label"
                                                                                id="demo-multiple-checkbox"
                                                                                fullWidth
                                                                                multiple
                                                                                displayEmpty={true}
                                                                                size="small"
                                                                                value={
                                                                                    values.data[idx].cycles[
                                                                                        index
                                                                                        ].dosageTime
                                                                                        .reduce((item: any[], elm: any) => {
                                                                                            if (elm.value) {
                                                                                                item.push(t(elm.label, {
                                                                                                    ns: "consultation"
                                                                                                }));
                                                                                            }
                                                                                            return item;
                                                                                        }, [])
                                                                                    || []
                                                                                }
                                                                                renderValue={(selected) => {
                                                                                    if (selected.length === 0) {
                                                                                        return (
                                                                                            <Typography
                                                                                                color="textSecondary">
                                                                                                {t("dosge_time", {
                                                                                                    ns: "consultation",
                                                                                                })}
                                                                                            </Typography>
                                                                                        );
                                                                                    }
                                                                                    return selected.join(", ");
                                                                                }}>
                                                                                {innerItem.dosageTime.map(
                                                                                    (subitem: any, i: number) => (
                                                                                        <MenuItem
                                                                                            key={subitem.label}
                                                                                            value={t(subitem.label, {
                                                                                                ns: "consultation",
                                                                                            })}>
                                                                                            <FormControlLabel
                                                                                                control={
                                                                                                    <Checkbox
                                                                                                        checked={
                                                                                                            values.data[idx].cycles[
                                                                                                                index
                                                                                                                ].dosageTime[i].value
                                                                                                        }
                                                                                                        onChange={(event) => {
                                                                                                            setFieldValue(
                                                                                                                `data[${idx}].cycles[${index}].dosageInput`,
                                                                                                                false
                                                                                                            );
                                                                                                            setFieldValue(
                                                                                                                `data[${idx}].cycles[${index}].dosageTime[${i}].value`,
                                                                                                                event.target.checked
                                                                                                            );
                                                                                                        }}
                                                                                                    />
                                                                                                }
                                                                                                label={t(subitem.label, {
                                                                                                    ns: "consultation",
                                                                                                })}
                                                                                            />
                                                                                        </MenuItem>
                                                                                    )
                                                                                )}
                                                                            </Select>
                                                                        </FormControl>
                                                                    )}
                                                                    <Select
                                                                        fullWidth={isMobile}
                                                                        size={"small"}
                                                                        displayEmpty
                                                                        sx={{
                                                                            maxHeight: 35,
                                                                            "& .MuiSelect-select": {
                                                                                background: "white",
                                                                            },
                                                                        }}
                                                                        id="dosageMeal-select"
                                                                        value={
                                                                            item.cycles[index]?.dosageMealValue
                                                                                ? item.cycles[index].dosageMealValue
                                                                                : ""
                                                                        }
                                                                        onChange={(event) => {
                                                                            setFieldValue(
                                                                                `data[${idx}].cycles[${index}].dosageInput`,
                                                                                false
                                                                            );
                                                                            setFieldValue(
                                                                                `data[${idx}].cycles[${index}].dosageMealValue`,
                                                                                event.target.value
                                                                            );
                                                                        }}
                                                                        renderValue={(selected) => {
                                                                            if (
                                                                                !selected ||
                                                                                (selected && selected.length === 0)
                                                                            ) {
                                                                                return (
                                                                                    <Typography color={"gray"}>
                                                                                        {t("condition", {
                                                                                            ns: "consultation",
                                                                                        })}
                                                                                    </Typography>
                                                                                );
                                                                            }

                                                                            return t(selected, {
                                                                                ns: "consultation",
                                                                            });
                                                                        }}>
                                                                        {innerItem.dosageMeal.map(
                                                                            (subitem: any) => (
                                                                                <MenuItem
                                                                                    key={subitem.label}
                                                                                    value={subitem.label}>
                                                                                    {t(subitem.label, {
                                                                                        ns: "consultation",
                                                                                    })}
                                                                                </MenuItem>
                                                                            )
                                                                        )}
                                                                    </Select>
                                                                </Stack>
                                                            </Stack>

                                                            <TextField
                                                                sx={{mt: 0.5}}
                                                                value={
                                                                    values.data[idx].cycles[index].dosageInput
                                                                        ? values.data[idx].cycles[index].dosageInputText
                                                                        : generateDosageText(
                                                                            values.data[idx].cycles[index],
                                                                            values.data[idx].unit
                                                                        )
                                                                }
                                                                onChange={(event) => {
                                                                    const dosage = generateDosageText(
                                                                        values.data[idx].cycles[index],
                                                                        values.data[idx].unit
                                                                    );
                                                                    const inputText = event.target.value;
                                                                    const hasChange =
                                                                        inputText.length === 0 &&
                                                                        values.data[idx].cycles[index]
                                                                            .dosageInputText.length > 0;
                                                                    setFieldValue(
                                                                        `data[${idx}].cycles[${index}].dosageInput`,
                                                                        !hasChange
                                                                    );
                                                                    setFieldValue(
                                                                        `data[${idx}].cycles[${index}].dosageInputText`,
                                                                        hasChange ? dosage : inputText
                                                                    );
                                                                }}
                                                                fullWidth
                                                                placeholder={t("enter_your_dosage")}
                                                            />
                                                        </Stack>
                                                        <Stack
                                                            mt={1}
                                                            direction={{xs: "column", md: "row"}}
                                                            alignItems={{xs: "flex-start", md: "center"}}>
                                                            <Typography gutterBottom mr={1}>
                                                                {t("durations", {ns: "consultation"})}
                                                            </Typography>
                                                            <Stack
                                                                spacing={0.5}
                                                                width={{xs: "100%", md: "auto"}}
                                                                mr={{xs: 0, md: 1}}
                                                                mb={0.5}
                                                                direction={{xs: "column", sm: "row"}}
                                                                alignItems="center">
                                                                <Button
                                                                    sx={{
                                                                        justifyContent: {
                                                                            xs: "space-between",
                                                                            md: "center",
                                                                        },
                                                                    }}

                                                                    component="label"
                                                                    onClick={(event: any) => {
                                                                        event.stopPropagation();
                                                                        event.preventDefault();
                                                                    }}
                                                                    endIcon={
                                                                        <IconButton
                                                                            sx={{p: 1, m: 0}}
                                                                            disabled={
                                                                                innerItem.dosageDuration ===
                                                                                parseInt(
                                                                                    fractions[fractions.length - 1]
                                                                                )
                                                                            }
                                                                            onClick={() =>
                                                                                durationCounter("plus", index, idx)
                                                                            }
                                                                            size="small"
                                                                            disableRipple>
                                                                            <AddIcon/>
                                                                        </IconButton>
                                                                    }
                                                                    startIcon={
                                                                        <IconButton
                                                                            sx={{p: 1, m: 0}}
                                                                            disabled={innerItem.dosageDuration === 1}
                                                                            onClick={() =>
                                                                                durationCounter("minus", index, idx)
                                                                            }
                                                                            size="small"
                                                                            disableRipple
                                                                        >
                                                                            <RemoveIcon/>
                                                                        </IconButton>
                                                                    }
                                                                    variant="white"
                                                                    disableRipple>
                                                                    {innerItem.dosageDuration}
                                                                </Button>
                                                                {!isMobile ? (
                                                                    innerItem.duration.map((subitem: any) => (
                                                                        <Button
                                                                            component="label"
                                                                            variant="white"
                                                                            disableRipple
                                                                            startIcon={
                                                                                <Radio
                                                                                    {...getFieldProps(
                                                                                        `data[${idx}].cycles[${index}].durationValue`
                                                                                    )}
                                                                                    value={subitem.value}
                                                                                    checked={
                                                                                        item.cycles[index].durationValue ===
                                                                                        subitem.value
                                                                                    }
                                                                                />
                                                                            }
                                                                            key={subitem.label}>
                                                                            {t(subitem.label, {
                                                                                ns: "consultation",
                                                                            })}
                                                                        </Button>
                                                                    ))
                                                                ) : (
                                                                    <Select
                                                                        fullWidth={isMobile}
                                                                        size={"small"}
                                                                        displayEmpty
                                                                        sx={{
                                                                            maxHeight: 35,
                                                                            "& .MuiSelect-select": {
                                                                                background: "white",
                                                                            },
                                                                        }}
                                                                        id="durationValue-select"
                                                                        {...getFieldProps(
                                                                            `data[${idx}].cycles[${index}].durationValue`
                                                                        )}
                                                                        renderValue={(selected) => {
                                                                            if (
                                                                                !selected ||
                                                                                (selected && selected.length === 0)
                                                                            ) {
                                                                                return (
                                                                                    <Typography color={"gray"}>
                                                                                        {t("durations", {ns: "consultation"})}
                                                                                    </Typography>
                                                                                );
                                                                            }

                                                                            return t(selected, {
                                                                                ns: "consultation",
                                                                            });
                                                                        }}>
                                                                        {innerItem.duration.map((subitem: any) => (
                                                                            <MenuItem
                                                                                key={subitem.label}
                                                                                value={subitem.label}>
                                                                                {t(subitem.label, {
                                                                                    ns: "consultation",
                                                                                })}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                )}
                                                                {errors.data &&
                                                                    (errors.data as any)[idx]?.cycles &&
                                                                    (errors.data as any)[idx]?.cycles[index]
                                                                        ?.durationValue && (
                                                                        <FormControl
                                                                            sx={{m: 3}}
                                                                            error
                                                                            variant="standard">
                                                                            <FormHelperText>
                                                                                {t("duration-error", {
                                                                                    ns: "consultation",
                                                                                })}
                                                                            </FormHelperText>
                                                                        </FormControl>
                                                                    )}
                                                            </Stack>
                                                        </Stack>
                                                        <Stack mt={1}>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={
                                                                            values.data[idx].cycles[index]
                                                                                .cautionaryNoteInput
                                                                        }
                                                                        onChange={(event) => {
                                                                            setFieldValue(
                                                                                `data[${idx}].cycles[${index}].cautionaryNoteInput`,
                                                                                event.target.checked
                                                                            );
                                                                        }}
                                                                        name="autre"
                                                                    />
                                                                }
                                                                label={t("cautionary_note", {
                                                                    ns: "consultation",
                                                                })}
                                                            />
                                                            {values.data[idx].cycles[index].cautionaryNoteInput && (
                                                                <TextField
                                                                    {...getFieldProps(
                                                                        `data[${idx}].cycles[${index}].cautionaryNote`
                                                                    )}
                                                                    fullWidth
                                                                    placeholder={t("cautionary_note_placeholder")}
                                                                />
                                                            )}
                                                        </Stack>
                                                        {index !== 0 && <IconButton
                                                            onClick={() => handleRemoveCycle(idx, innerItem)}
                                                            className="btn-del"
                                                            disableRipple>
                                                            <IconUrl path="icdelete"/>
                                                        </IconButton>}
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </Stack>
                                        <Button
                                            {...(values.data[idx].cycles.length === 0 && {
                                                sx: {mt: 1},
                                            })}
                                            onClick={() => handAddCycle(idx)}
                                            size="small"
                                            startIcon={<AddIcon/>}>
                                            {t("cycle", {ns: "consultation"})}
                                        </Button>
                                    </Paper>
                                ))}
                            </Stack>
                        </FormikProvider>
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Stack
                            direction="row"
                            spacing={{xs: 1, md: 2}}
                            {...(!isMobile && {sx: {position: "sticky", top: "0"}})}>
                            <Stack direction={"column"} sx={{width: "100%"}}>
                                <Stack direction={"row"} spacing={1.2}>
                                    {!editModel ? (
                                        <ModelSwitchButton
                                            {...{t, editModel, lastPrescriptions, drugs}}
                                            {...(isMobile && {
                                                fullWidth: true,
                                            })}
                                            className="custom-button"
                                            variant="contained"
                                            onClickEvent={(action: string) => {
                                                switch (action) {
                                                    case "last-prescription":
                                                        const last: any[] = [];
                                                        lastPrescriptions[0].prescription_has_drugs.map(
                                                            (drug: any) => {
                                                                last.push({
                                                                    cycles: drug.cycles,
                                                                    drugUuid: drug.standard_drug.uuid,
                                                                    name: drug.standard_drug.commercial_name,
                                                                });
                                                            }
                                                        );
                                                        switchModel([...last]);
                                                        break;
                                                    case "set-prescription":
                                                        setInfo("medical_prescription_model");
                                                        setOpenDialog(true);
                                                        break;
                                                }
                                            }}
                                        />
                                    ) : (
                                        <LoadingButton
                                            {...{loading}}
                                            loadingPosition="start"
                                            disabled={drugs?.length === 0}
                                            {...(isMobile && {
                                                fullWidth: true,
                                            })}
                                            color="warning"
                                            onClick={() => {
                                                editPrescriptionAction();
                                            }}
                                            className="custom-button"
                                            variant="contained"
                                            startIcon={<EditIcon/>}>
                                            {t("editModel", {ns: "consultation"})}{" "}
                                            {`${editModel?.text} ${t("model")}`}
                                        </LoadingButton>
                                    )}
                                    {editModel && (
                                        <Button
                                            disabled={loading}
                                            onClick={() => setEditModel(null)}
                                            color={"error"}
                                            className="custom-button"
                                            variant="contained">
                                            {t("cancel")}
                                        </Button>
                                    )}
                                </Stack>
                                <Divider
                                    sx={{
                                        display: {xs: "block", md: "none"},
                                        mt: 2,
                                        width: "calc(100% + 48px)",
                                        position: "relative",
                                        left: -24,
                                    }}
                                />

                                <Box sx={{width: "100%", "& .MuiBox-root": {p: 0}}}>
                                    <Box sx={{borderBottom: 1, borderColor: "divider"}}>
                                        <Tabs
                                            value={prescriptionTabIndex}
                                            onChange={handlePrescriptionTabChange}
                                            aria-label="prescription tabs">
                                            <Tab
                                                disableFocusRipple
                                                label={t("preview")}
                                                {...a11yProps(0)}
                                            />
                                            <Tab
                                                disableFocusRipple
                                                label={t("modeles")}
                                                {...a11yProps(1)}
                                            />
                                        </Tabs>
                                    </Box>
                                    <TabPanel value={prescriptionTabIndex} index={0}>
                                        <List
                                            className={"prescription-preview"}
                                            subheader={
                                                <ListSubheader
                                                    disableSticky
                                                    component="div"
                                                    id="nested-list-subheader">
                                                    {t("drug_list", {ns: "consultation"})}
                                                </ListSubheader>
                                            }>
                                            {drugs.map((drug: DrugCycleModel, index: number) => (
                                                <ListItemButton
                                                    key={drug.drugUuid}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        setTimeout(() => {
                                                            (refs.current as any)[index]?.scrollIntoView({
                                                                behavior: "smooth",
                                                            });
                                                        }, 100);
                                                    }}
                                                    alignItems="flex-start">
                                                    <ListItemText
                                                        primary={`${index + 1} • ${drug.name}`}
                                                        secondary={
                                                            <React.Fragment>
                                                                <span style={{display: "grid"}}>
                                  {drug.cycles.map((cycle: PrescriptionCycleModel, indexCycle: number) => (
                                          <span
                                              key={`cycle-${indexCycle}`}
                                              style={{display: "grid"}}>
                                        <span>
                                          <Typography
                                              sx={{display: "inline"}}
                                              component="span"
                                              variant="body2"
                                              color="text.primary">
                                            {`${cycle.dosage}  ${
                                                cycle?.duration
                                                    ? `pendant ${cycle.duration}`
                                                    : ""
                                            } ${
                                                cycle?.durationType
                                                    ? t(cycle.durationType)
                                                    : ""
                                            }`}
                                          </Typography>
                                            {cycle.note?.length > 0 &&
                                                `(${cycle.note})`}
                                        </span>
                                              {indexCycle < drug.cycles?.length - 1 &&
                                                  !(
                                                      errors.data &&
                                                      ((errors.data as any)[index]
                                                              ?.cycles[indexCycle + 1] ||
                                                          (errors.data as any)[index]
                                                              ?.cycles[indexCycle])
                                                  ) && (
                                                      <span style={{marginLeft: 4}}>
                                              {t("after", {
                                                  ns: "consultation",
                                              })}
                                            </span>
                                                  )}
                                      </span>
                                      )
                                  )}
                                </span>
                                                            </React.Fragment>
                                                        }
                                                    />
                                                    <IconButton
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            setTimeout(() => {
                                                                (refs.current as any)[index]?.scrollIntoView({
                                                                    behavior: "smooth",
                                                                });
                                                            }, 100);
                                                        }}

                                                        disableRipple>
                                                        <IconUrl
                                                            width={12}
                                                            height={12}
                                                            path="ic-edit"
                                                        />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            handleRemoveDrug(index);
                                                        }}
                                                        className="btn-del"
                                                        disableRipple>
                                                        <IconUrl
                                                            color="red"
                                                            width={12}
                                                            height={12}
                                                            path="icdelete"
                                                        />
                                                    </IconButton>
                                                </ListItemButton>
                                            ))}
                                        </List>
                                    </TabPanel>
                                    <TabPanel value={prescriptionTabIndex} index={1}>
                                        <ModelPrescriptionList
                                            {...{
                                                models,
                                                t,
                                                initialOpenData,
                                                switchModel,
                                                editPrescriptionModel,
                                                setOpenAddParentDialog
                                            }}
                                        />
                                        <Button
                                            size={"small"}
                                            onClick={() => setOpenAddParentDialog(true)}
                                            sx={{alignSelf: "flex-start", mb: 1}}
                                            color={"primary"}
                                            startIcon={<AddRoundedIcon/>}>
                                            {t("new_file", {ns: "consultation"})}
                                        </Button>
                                    </TabPanel>
                                </Box>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
            <CustomDialog
                action={info}
                direction={direction}
                open={openDialog}
                data={{t}}
                {...(info === "medical_prescription_model" && {
                    size: "xs",
                    title: t("save_the_template_in_folder", {
                        ns: "consultation",
                    }),
                    data: {t, dose: true, models, setOpenAddParentDialog},
                    actionDialog: (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Button
                                variant="text-black"
                                onClick={() => {
                                    setOpenDialog(false);
                                }}
                                startIcon={<CloseIcon/>}>
                                {t("cancel", {ns: "consultation"})}
                            </Button>
                            <LoadingButton
                                disabled={modelName.length === 0}
                                startIcon={<IconUrl path="ic-dowlaodfile"/>}
                                variant="contained"
                                onClick={handleSaveDialog}>
                                {t("save", {ns: "consultation"})}
                            </LoadingButton>
                        </Stack>
                    ),
                })}
            />
            <Dialog
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        width: "100%",
                    },
                }}
                onClose={() => setOpenAddParentDialog(false)}
                open={openAddParentDialog}>
                <DialogTitle
                    sx={{
                        bgcolor: (theme: Theme) => theme.palette.primary.main,
                        mb: 2,
                    }}>
                    {t("add_group_model", {ns: "consultation"})}
                </DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        {t("group_model_name", {ns: "consultation"})}
                    </Typography>
                    <TextField
                        fullWidth
                        value={parentModelName}
                        onChange={(e) => {
                            setParentModelName(e.target.value);
                        }}
                        placeholder={t("group_model_name_placeholder", {
                            ns: "consultation",
                        })}
                    />
                </DialogContent>
                <DialogActions>
                    <Stack
                        width={1}
                        spacing={2}
                        direction="row"
                        justifyContent="flex-end">
                        <Button
                            variant="text-black"
                            onClick={() => {
                                setOpenAddParentDialog(false);
                            }}
                            startIcon={<CloseIcon/>}>
                            {t("cancel", {ns: "consultation"})}
                        </Button>
                        <LoadingButton
                            {...{loading}}
                            disabled={parentModelName.length === 0}
                            onClick={handleAddParentModel}
                            startIcon={<IconUrl path="ic-dowlaodfile"/>}
                            variant="contained">
                            {t("save", {ns: "consultation"})}
                        </LoadingButton>
                    </Stack>
                </DialogActions>
            </Dialog>
        </MedicalPrescriptionCycleStyled>
    );
}

export default MedicalPrescriptionCycleDialog;
