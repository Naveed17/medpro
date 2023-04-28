import {
    Autocomplete,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider, FormControlLabel, TextField,
    Theme,
} from "@mui/material";
import {
    Grid,
    Paper,
    Stack,
    Typography,
    IconButton,
    Checkbox,
    Radio,
    useMediaQuery,
} from "@mui/material";
import {Form, FormikProvider, useFormik} from "formik";
import React, {useEffect, useState} from "react";
import {LoadingButton} from "@mui/lab";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MedicalPrescriptionCycleStyled from "./overrides/medicalPrescriptionCycleStyled";
import IconUrl from "@themes/urlIcon";
import {Dialog as CustomDialog, ModelPrescriptionList, prescriptionSelector, setParentModel} from "@features/dialog";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {configSelector} from "@features/base";
import CloseIcon from "@mui/icons-material/Close";

import {motion, AnimatePresence} from "framer-motion";
import {RecButton} from "@features/buttons";
import {useRequest, useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import MenuItem from "@mui/material/MenuItem";
import * as Yup from "yup";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {Session} from "next-auth";

function MedicalPrescriptionCycleDialog({...props}) {
    const {data: {t}, data} = props;
    const {setState: setDrugs, state: drugs} = data;
    const {data: session} = useSession();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

    const {direction} = useAppSelector(configSelector);
    const {name: modelName, parent: modelParent} = useAppSelector(prescriptionSelector);

    const [drugsList, setDrugsList] = useState<DrugModel[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const fractions = ["1/4", "1/2", ...Array.from({length: 10}, (v, k) => (k + 1).toString())];
    const [info, setInfo] = useState("");
    const [talkStart, setTalk] = useState(false);
    const dosageMeal = [
        {
            label: "before_meal",
            value: "before meal",
        },
        {
            label: "after_meal",
            value: "after meal",
        },
        {
            label: "with_meal",
            value: "with meal",
        },
        {
            label: "fasting",
            value: "fasting",
        },
    ];
    const duration = [
        {
            label: "day",
            value: "day",
        },
        {
            label: "week",
            value: "week",
        },
        {
            label: "month",
            value: "month",
        },
        {
            label: "year",
            value: "year",
        }
    ];
    const initData = {
        drug: null,
        unit: null,
        cycles: [
            {
                count: 2,
                dosageQty: "1",
                dosageDuration: 1,
                dosageMealValue: "",
                durationValue: "",
                dosageInput: false,
                dosageInputText: "",
                cautionary_note: "",
                dosageTime: [
                    {
                        label: "morning",
                        value: false,
                    },
                    {
                        label: "mid_day",
                        value: false,
                    },
                    {
                        label: "evening",
                        value: false,
                    },
                    {
                        label: "before_sleeping",
                        value: false,
                    },
                ],
                dosageMeal,
                duration
            },
        ]
    };

    const validationSchema = Yup.object().shape({
        data: Yup.array().of(Yup.object().shape({
            drug: Yup.object().shape({
                uuid: Yup.string(),
                form: Yup.string().nullable(),
                dci: Yup.string().nullable(),
                dose: Yup.string().nullable(),
                commercial_name: Yup.string(),
                isVerified: Yup.boolean(),
                inputValue: Yup.string()
            }).nullable().required("drug_error"),
            unit: Yup.string().nullable(),
            cycles: Yup.array().of(Yup.object().shape({
                count: Yup.number(),
                dosageQty: Yup.string(),
                dosageDuration: Yup.number(),
                dosageMealValue: Yup.string(),
                durationValue: Yup.string(),
                dosageInput: Yup.boolean(),
                dosageInputText: Yup.string(),
                cautionary_note: Yup.string(),
                dosageTime: Yup.array().of(Yup.object().shape({
                    label: Yup.string(),
                    value: Yup.boolean()
                })),
                dosageMeal: Yup.array().of(Yup.object().shape({
                    label: Yup.string(),
                    value: Yup.string()
                })),
                duration: Yup.array().of(Yup.object().shape({
                    label: Yup.string(),
                    value: Yup.string()
                }))
            }))
        }))
    });

    const setInitData = (drugs: DrugModel[]) => {
        const data: any[] = drugs?.length === 0 ? [{
            drug: null,
            unit: null,
            cycles: initData.cycles as any[]
        }] : [];
        drugs?.map((drug: any) => {
            data.push({
                drug: {
                    uuid: drug.drugUuid,
                    commercial_name: drug.name,
                    dci: "",
                    dose: null,
                    form: "",
                    isVerified: true
                } as any,
                unit: drug.cycles.length > 0 && drug.cycles[0].dosage.split(",")[0] ? drug.cycles[0].dosage.split(",")[0]?.split(" ")[1] : null,
                cycles: drug.cycles.length === 0 && (drug.duration === "" || drug.duration === null) && drug.durationType === "" ? [] : drug.cycles.map((cycle: PrescriptionCycleModel) => ({
                    count: cycle.dosage.split(" ")[0] ? cycle.dosage.split(" ")[0] === fractions[0] ? 0 : cycle.dosage.split(" ")[0] === fractions[1] ? 1 : parseInt(cycle.dosage.split(" ")[0]) + 1 : 2,
                    dosageQty: cycle.dosage.split(" ")[0] ? cycle.dosage.split(" ")[0] : "1",
                    dosageDuration: cycle.duration ? cycle.duration : 1,
                    dosageMealValue: cycle.dosage !== "" && cycle.dosage.split(",")[2] && cycle.dosage.split(",")[2].length > 0 ? dosageMeal.find(meal => cycle.dosage.split(",")[2].includes(t(meal.label)))?.label : "",
                    durationValue: cycle.durationType ? cycle.durationType : "",
                    dosageInput: cycle.isOtherDosage ? cycle.isOtherDosage : false,
                    dosageInputText: cycle.isOtherDosage ? cycle.dosage : "",
                    cautionary_note: cycle.note !== "" ? cycle.note : "",
                    dosageTime: [
                        {
                            label: "morning",
                            value: cycle.dosage.split(",")[1] ? cycle.dosage.split(",")[1].includes(t("morning")) : false,
                        },
                        {
                            label: "mid_day",
                            value: cycle.dosage.split(",")[1] ? cycle.dosage.split(",")[1].includes(t("mid_day")) : false,
                        },
                        {
                            label: "evening",
                            value: cycle.dosage.split(",")[1] ? cycle.dosage.split(",")[1].includes(t("evening")) : false,
                        },
                        {
                            label: "before_sleeping",
                            value: cycle.dosage.split(",")[1] ? cycle.dosage.split(",")[1].includes(t("before_sleeping")) : false,
                        },
                    ],
                    dosageMeal,
                    duration
                }))
            })
        });

        return data;
    }

    const formik = useFormik({
        enableReinitialize: false,
        initialValues: {
            data: setInitData(drugs)
        },
        validationSchema,
        onSubmit: (values) => {
            console.log(values);
        }
    });

    const {setFieldValue, values, getFieldProps, errors, touched} = formik;

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {trigger: triggerDrugList} = useRequestMutation(null, "consultation/drugs");
    const {trigger: triggerPrescriptionModel} = useRequestMutation(null, "consultation/prescription/model");

    const {data: ParentModelResponse, mutate: mutateParentModel} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/prescriptions/modals/parents/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const handleAddDrug = () => {
        setFieldValue("data", [
            ...values.data,
            {...initData}
        ]);
    }

    const switchPrescriptionModel = (drugs: DrugModel[]) => {
        setDrugs(drugs);
        setFieldValue("data", setInitData(drugs));
    }

    const handleRemoveCycle = (idx: number, value: any) => {
        const filtered = values.data[idx].cycles.filter((item: any) => item !== value);
        setFieldValue(`data[${idx}].cycles`, filtered);
    }

    const handleRemoveDrug = (idx: number) => {
        const filtered = values.data.filter((item: any, index: number) => index !== idx);
        setFieldValue(`data`, filtered);
    }

    const handAddCycle = (index: number) => {
        setFieldValue(`data[${index}].cycles`, [
            ...values.data[index].cycles,
            ...initData.cycles
        ]);
    }

    const handleDosageQty = (prop: string, index: number, idx: number) => {
        if (prop === "plus") {
            if (values.data[idx].cycles[index].count < fractions.length - 1) {
                const dosage = values.data[idx].cycles[index].count + 1;
                setFieldValue(`data[${idx}].cycles[${index}].count`, dosage);
                setFieldValue(`data[${idx}].cycles[${index}].dosageQty`, fractions[dosage]);
            }
        } else {
            if (values.data[idx].cycles[index].count > 0) {
                const dosage = values.data[idx].cycles[index].count - 1;
                setFieldValue(`data[${idx}].cycles[${index}].count`, dosage);
                setFieldValue(`data[${idx}].cycles[${index}].dosageQty`, fractions[dosage]);
            }
        }
    }

    const durationCounter = (prop: string, index: number, idx: number) => {
        if (prop === "plus") {
            if (values.data[idx].cycles[index].dosageDuration < fractions.length - 1) {
                setFieldValue(
                    `data[${idx}].cycles[${index}].dosageDuration`,
                    values.data[idx].cycles[index].dosageDuration + 1
                );
            }
        } else {
            setFieldValue(
                `data[${idx}].cycles[${index}].dosageDuration`,
                values.data[idx].cycles[index].dosageDuration - 1
            );
        }
    }

    const handleSaveDialog = () => {
        const form = new FormData();
        form.append('globalNote', "");
        form.append('name', modelName);
        form.append('parent', modelParent);
        form.append('drugs', JSON.stringify(drugs));
        triggerPrescriptionModel({
            method: "POST",
            url: `/api/medical-entity/${medical_entity.uuid}/prescriptions/modals/${router.locale}`,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then(() => mutateParentModel());
        setOpenDialog(false);
    }

    const generateDosageText = (cycle: any, unit?: string) => {
        return cycle.dosageInput && cycle.dosageInputText.length > 0 ?
            cycle.dosageInputText : unit && cycle.dosageTime.some((time: any) => time.value) ?
                `${cycle.dosageQty} ${unit}, ${cycle.dosageTime.filter((time: any) => time.value).map((time: any) => t(time.label)).join("/")}, ${cycle.dosageMealValue && cycle.dosageMealValue.length > 0 ? t(cycle.dosageMealValue) : ""}` : ""
    }

    const models = (ParentModelResponse as HttpResponse)?.data as PrescriptionParentModel[];

    useEffect(() => {
        if (models && models.length > 0) {
            dispatch(setParentModel(models[0].uuid));
        }

    }, [dispatch, models]);

    useEffect(() => {
        if (values) {
            const drugs: any[] = [];
            values.data.map((data: any) => {
                if (data.drug) {
                    const drug = data.drug as DrugModel;
                    const cycles = data.cycles.map((cycle: any) => ({
                        dosage: generateDosageText(cycle, data.unit),
                        duration: cycle.durationValue.length > 0 ? cycle.dosageDuration : "",
                        durationType: cycle.durationValue.length > 0 ? cycle.durationValue : "",
                        note: cycle.cautionary_note.length > 0 ? cycle.cautionary_note : "",
                        isOtherDosage: cycle.dosageInput
                    }));
                    drugs.push({
                        cycles,
                        drugUuid: drug?.uuid,
                        name: drug?.commercial_name
                    })
                }
            });
            if (drugs.length > 0) {
                setDrugs(drugs);
            }
        }
    }, [values]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <MedicalPrescriptionCycleStyled>
            <Grid
                container
                spacing={{xs: 0, md: 2}}
                sx={{flexDirection: {xs: "column-reverse", md: "row"}}}>
                <Grid item md={9} xs={12}>
                    {talkStart ? (
                        <Stack spacing={4}>
                            <Card>
                                <CardContent>
                                    <Stack width={1} height={"20rem"}>
                                        <CardActions sx={{mt: "auto", justifyContent: "center"}}>
                                            <RecButton/>
                                        </CardActions>
                                    </Stack>
                                </CardContent>
                            </Card>
                            <Button
                                onClick={() => setTalk(false)}
                                sx={{alignSelf: "flex-start"}}
                                startIcon={<IconUrl path="ic-edit"/>}>
                                {t("write_your_order", {ns: "consultation"})}
                            </Button>
                        </Stack>
                    ) : (
                        <>
                            <FormikProvider value={formik}>
                                <Stack
                                    component={Form}
                                    spacing={1}
                                    autoComplete="off"
                                    noValidate>
                                    {values.data.map((item: any, idx: number) => (
                                        <Paper className="custom-paper" key={idx}>
                                            <Grid container spacing={2} alignItems="flex-end">
                                                <Grid item md={8} xs={12}>
                                                    <Typography gutterBottom>
                                                        {t("name_of_drug", {ns: "consultation"})}
                                                    </Typography>
                                                    {drugsList && <Autocomplete
                                                        id="cmo"
                                                        value={item.drug}
                                                        freeSolo
                                                        onChange={(e, drug) => {
                                                            e.stopPropagation();
                                                            if ((drug as DrugModel)?.inputValue || typeof drug === "string") {
                                                                // Create a new value from the user input
                                                                setFieldValue(`data[${idx}].drug`, {
                                                                    commercial_name: typeof drug === "string" ? drug : (drug as DrugModel)?.inputValue,
                                                                    isVerified: false
                                                                });
                                                            } else {
                                                                setFieldValue(`data[${idx}].drug`, drug as DrugModel);
                                                                setFieldValue(`data[${idx}].unit`, drug?.form);
                                                            }
                                                        }}
                                                        size='small'
                                                        options={drugsList}
                                                        noOptionsText={t('startWriting')}
                                                        getOptionLabel={(option) => {
                                                            // Value selected with enter, right from the input
                                                            if (typeof option === 'string') {
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
                                                            const filtered = options.filter(option => option.commercial_name.toLowerCase().includes(inputValue.toLowerCase()));
                                                            // Suggest the creation of a new value
                                                            const isExisting = options.some((option) => inputValue.toLowerCase() === option.commercial_name.toLowerCase());
                                                            if (inputValue !== '' && !isExisting) {
                                                                filtered.push({
                                                                    inputValue,
                                                                    commercial_name: `${t('add_drug')} "${inputValue}"`,
                                                                    isVerified: false
                                                                });
                                                            }
                                                            return filtered;
                                                        }}
                                                        isOptionEqualToValue={(option, value) => option?.commercial_name === value?.commercial_name}
                                                        renderOption={(props, option) => (
                                                            <MenuItem
                                                                {...props}
                                                                key={option.uuid ? option.uuid : "-1"}
                                                                value={option.uuid}>
                                                                {option.commercial_name}
                                                            </MenuItem>
                                                        )}
                                                        renderInput={(params) => <TextField {...params}
                                                                                            error={Boolean(touched.data && errors.data && (errors.data as any)[idx]?.drug)}
                                                                                            onChange={(ev) => {
                                                                                                if (ev.target.value.length >= 2) {
                                                                                                    triggerDrugList({
                                                                                                        method: "GET",
                                                                                                        url: "/api/drugs/" + router.locale + '?name=' + ev.target.value,
                                                                                                        headers: {Authorization: `Bearer ${session?.accessToken}`}
                                                                                                    }).then((cnx) => setDrugsList((cnx?.data as HttpResponse).data));
                                                                                                }
                                                                                            }}
                                                                                            placeholder={t('placeholder_drug_name')}/>}/>
                                                    }
                                                </Grid>
                                                <Grid item md={3.2} xs={12}>
                                                    <Autocomplete
                                                        size='small'
                                                        freeSolo
                                                        value={values.data[idx].unit ? values.data[idx].unit : ""}
                                                        onChange={(event, unit) => setFieldValue(`data[${idx}].unit`, unit)}
                                                        placeholder={t("unit", {ns: "consultation"})}
                                                        noOptionsText={t('no_unit')}
                                                        options={["Comprimé"]}
                                                        renderInput={(params) => <TextField
                                                            placeholder={t('unit')}
                                                            {...params} />}
                                                    />
                                                </Grid>
                                                <Grid className={"grid-action"} item md={.8} xs={12} pb={.2}>
                                                    <IconButton
                                                        onClick={() => handleRemoveDrug(idx)}
                                                        className="btn-del-drug">
                                                        <IconUrl path="icdelete"/>
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                            <Stack
                                                component={AnimatePresence}
                                                exitBeforeEnter
                                                spacing={2}>
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
                                                                <Typography gutterBottom>
                                                                    {t("dosage", {ns: "consultation"})}
                                                                </Typography>
                                                                {!values.data[idx].cycles[index].dosageInput && <Stack
                                                                    spacing={3}
                                                                    direction="row"
                                                                    flexWrap="wrap"
                                                                    alignItems="center">
                                                                    <Stack
                                                                        spacing={0.5}
                                                                        mb={0.5}
                                                                        flexWrap="wrap"
                                                                        direction="row"
                                                                        alignItems="center">
                                                                        <Button
                                                                            onClick={(event: any) => {
                                                                                event.stopPropagation();
                                                                                event.preventDefault();
                                                                            }}
                                                                            component="label"
                                                                            endIcon={
                                                                                <IconButton
                                                                                    disabled={innerItem.dosageQty === fractions[fractions.length - 1]}
                                                                                    onClick={(event) => handleDosageQty("plus", index, idx)}
                                                                                    size="small"
                                                                                    disableRipple>
                                                                                    <AddIcon/>
                                                                                </IconButton>
                                                                            }
                                                                            startIcon={
                                                                                <IconButton
                                                                                    disabled={innerItem.dosageQty === fractions[0]}
                                                                                    onClick={(event) => handleDosageQty("minus", index, idx)}
                                                                                    size="small"
                                                                                    disableRipple>
                                                                                    <RemoveIcon/>
                                                                                </IconButton>
                                                                            }
                                                                            variant="white"
                                                                            disableRipple>
                                                                            {innerItem.dosageQty}
                                                                        </Button>
                                                                        {innerItem.dosageTime.map((subitem: any, i: number) => (
                                                                            <Button
                                                                                component="label"
                                                                                variant="white"
                                                                                disableRipple
                                                                                startIcon={
                                                                                    <Checkbox
                                                                                        checked={values.data[idx].cycles[index].dosageTime[i].value}
                                                                                        {...getFieldProps(
                                                                                            `data[${idx}].cycles[${index}].dosageTime[${i}].value`
                                                                                        )}
                                                                                    />
                                                                                }
                                                                                key={subitem.label}>
                                                                                {t(subitem.label, {
                                                                                    ns: "consultation",
                                                                                })}
                                                                            </Button>
                                                                        ))}
                                                                    </Stack>
                                                                    <Stack
                                                                        spacing={0.5}
                                                                        direction="row"
                                                                        flexWrap="wrap"
                                                                        alignItems="center">
                                                                        {innerItem.dosageMeal.map((subitem: any, i: number) => (
                                                                            <Button
                                                                                component="label"
                                                                                variant="white"
                                                                                disableRipple
                                                                                startIcon={
                                                                                    <Radio
                                                                                        {...getFieldProps(
                                                                                            `data[${idx}].cycles[${index}].dosageMealValue`
                                                                                        )}
                                                                                        value={subitem.label}
                                                                                        checked={item.cycles[index].dosageMealValue === subitem.label}
                                                                                    />
                                                                                }
                                                                                key={subitem.label}>
                                                                                {t(subitem.label, {ns: "consultation"})}
                                                                            </Button>
                                                                        ))}
                                                                    </Stack>
                                                                </Stack>}
                                                                <Stack>
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Checkbox
                                                                                checked={values.data[idx].cycles[index].dosageInput}
                                                                                onChange={(event) => {
                                                                                    setFieldValue(`data[${idx}].cycles[${index}].dosageInput`, event.target.checked)
                                                                                }}
                                                                                name="autre"/>
                                                                        }
                                                                        label="Autre"
                                                                    />
                                                                    {values.data[idx].cycles[index].dosageInput &&
                                                                        <TextField
                                                                            value={generateDosageText(values.data[idx].cycles[index], values.data[idx].unit)}
                                                                            onChange={event => setFieldValue(`data[${idx}].cycles[${index}].dosageInputText`, event.target.value)}
                                                                            fullWidth
                                                                            placeholder={t("enter_your_dosage")}/>}
                                                                </Stack>
                                                            </Stack>
                                                            <Stack mt={1}>
                                                                <Typography gutterBottom>
                                                                    {t("durations", {ns: "consultation"})}
                                                                </Typography>
                                                                <Stack
                                                                    spacing={0.5}
                                                                    mb={0.5}
                                                                    flexWrap="wrap"
                                                                    direction="row"
                                                                    alignItems="center">
                                                                    <Button
                                                                        component="label"
                                                                        onClick={(event: any) => {
                                                                            event.stopPropagation();
                                                                            event.preventDefault();
                                                                        }}
                                                                        endIcon={
                                                                            <IconButton
                                                                                sx={{p: 1, m: 0}}
                                                                                disabled={
                                                                                    innerItem.dosageDuration === parseInt(fractions[fractions.length - 1])
                                                                                }
                                                                                onClick={(event) => durationCounter("plus", index, idx)}
                                                                                size="small"
                                                                                disableRipple>
                                                                                <AddIcon/>
                                                                            </IconButton>
                                                                        }
                                                                        startIcon={
                                                                            <IconButton
                                                                                sx={{p: 1, m: 0}}
                                                                                disabled={
                                                                                    innerItem.dosageDuration === 1
                                                                                }
                                                                                onClick={(event) => durationCounter("minus", index, idx)}
                                                                                size="small"
                                                                                disableRipple>
                                                                                <RemoveIcon/>
                                                                            </IconButton>
                                                                        }
                                                                        variant="white"
                                                                        disableRipple>
                                                                        {innerItem.dosageDuration}
                                                                    </Button>
                                                                    {innerItem.duration.map((subitem: any, i: number) => (
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
                                                                            {t(subitem.label, {ns: "consultation"})}
                                                                        </Button>
                                                                    ))}
                                                                </Stack>
                                                            </Stack>
                                                            <Stack mt={1}>
                                                                <Typography gutterBottom>
                                                                    {t("cautionary_note", {ns: "consultation"})}
                                                                </Typography>
                                                                <TextField
                                                                    {...getFieldProps(`data[${idx}].cycles[${index}].cautionary_note`)}
                                                                    fullWidth
                                                                    placeholder={t("cautionary_note_placeholder")}/>
                                                            </Stack>
                                                            <IconButton
                                                                onClick={() =>
                                                                    handleRemoveCycle(idx, innerItem)
                                                                }
                                                                className="btn-del"
                                                                disableRipple>
                                                                <IconUrl path="icdelete"/>
                                                            </IconButton>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </Stack>
                                            <Button
                                                {...(values.data[idx].cycles.length === 0 && {sx: {mt: 1}})}
                                                onClick={() => handAddCycle(idx)}
                                                size="small"
                                                startIcon={<AddIcon/>}>
                                                {t("cycle", {ns: "consultation"})}
                                            </Button>
                                        </Paper>
                                    ))}
                                </Stack>
                            </FormikProvider>
                            <Stack spacing={2} mt={2} alignItems="flex-start">
                                <Button startIcon={<AddIcon/>} onClick={handleAddDrug}>
                                    {t("add_drug", {ns: "consultation"})}
                                </Button>
                            </Stack>
                        </>
                    )}
                </Grid>
                <Grid item md={3} xs={12}>
                    <Stack direction="row" spacing={{xs: 0, md: 2}} height={1}>
                        <Divider
                            orientation="vertical"
                            sx={{display: {xs: "none", md: "block"}}}
                        />
                        <Stack width={1}>
                            <Button
                                disabled={drugs?.length === 0}
                                {...(isMobile && {
                                    fullWidth: true,
                                })}
                                onClick={() => {
                                    setInfo("medical_prescription_model");
                                    setOpenDialog(true);
                                }}
                                sx={{
                                    px: {xs: 0.5, md: 1},
                                    fontSize: {xs: 12, md: 14},
                                    alignSelf: "flex-start",
                                }}
                                variant="contained"
                                startIcon={<AddIcon/>}>
                                {t("createAsModel", {ns: "consultation"})}
                            </Button>
                            <Divider
                                sx={{
                                    display: {xs: "block", md: "none"},
                                    mt: 2,
                                    width: "calc(100% + 48px)",
                                    position: "relative",
                                    left: -24,
                                }}
                            />
                            <ModelPrescriptionList {...{models, t, switchPrescriptionModel}}/>
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
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
                    data: {t, dose: true, models},
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
        </MedicalPrescriptionCycleStyled>
    );
}

export default MedicalPrescriptionCycleDialog;
