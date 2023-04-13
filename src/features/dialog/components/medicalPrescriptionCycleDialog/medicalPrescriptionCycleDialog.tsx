import {
    Autocomplete,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider, TextField,
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
import React, {useState} from "react";
import {LoadingButton} from "@mui/lab";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MedicalPrescriptionCycleStyled from "./overrides/medicalPrescriptionCycleStyled";
import IconUrl from "@themes/urlIcon";
import {Dialog as CustomDialog} from "@features/dialog";
import {useAppSelector} from "@app/redux/hooks";
import {configSelector} from "@features/base";
import CloseIcon from "@mui/icons-material/Close";

import {motion, AnimatePresence} from "framer-motion";
import {RecButton} from "@features/buttons";
import {useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import MenuItem from "@mui/material/MenuItem";


function MedicalPrescriptionCycleDialog({...props}) {
    const {data: {t}} = props;
    const {data: session} = useSession();
    const router = useRouter();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

    const {direction} = useAppSelector(configSelector);

    const [drugsList, setDrugsList] = useState<DrugModel[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [call, setCall] = useState(false);
    const fractions = ["1/4", "1/2", "1", "2", "3", "4", "5", "6", "7", "8"];
    const [info, setInfo] = useState("");
    const [talkStart, setTalk] = useState(false);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            dosageData: {
                idx: 0,
                index: 0,
            },
            data: [
                {
                    drug: null,
                    unit: null,
                    cycle: [
                        {
                            count: 2,
                            dosageQty: "1",
                            dosageDuration: 1,
                            dosageMealValue: "",
                            durationValue: "",
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
                            dosageMeal: [
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
                            ],
                            duration: [
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
                            ],
                        },
                    ],
                },
            ],
        },
        onSubmit: (values) => {
            console.log(values);
        },
    });

    const {setFieldValue, values, getFieldProps} = formik;

    const {trigger: triggerDrugList} = useRequestMutation(null, "consultation/drugs");

    const handleAddDrug = () => {
        setFieldValue("data", [
            ...values.data,
            {
                drug: null,
                unit: null,
                cycle: [
                    {
                        count: 2,
                        dosageQty: "1",
                        dosageDuration: 1,
                        dosageMealValue: "",
                        durationValue: "",
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
                        dosageMeal: [
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
                        ],
                        duration: [
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
                        ],
                    },
                ],
            },
        ]);
    }

    const handleRemoveCycle = (idx: number, value: any) => {
        const filtered = values.data[idx].cycle.filter((item) => item !== value);
        setFieldValue(`data[${idx}].cycle`, filtered);
    }

    const handAddCycle = (index: number) => {
        setFieldValue(`data[${index}].cycle`, [
            ...values.data[index].cycle,
            {
                count: 2,
                dosageQty: "1",
                dosageDuration: 1,
                dosageMealValue: "",
                durationValue: "",
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
                dosageMeal: [
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
                ],
                duration: [
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
                ],
            },
        ]);
    };
    const updatedValue = (index: number, idx: number) => {
        setFieldValue(
            `data[${idx}].cycle[${index}].dosageQty`,
            fractions[values.data[idx].cycle[index].count]
        );
    };

    const handleDosageQty = (prop: string, index: number, idx: number) => {
        setCall(!call);
        setFieldValue("dosageData", {
            ...values.dosageData,
            idx,
            index,
        });
        if (prop === "plus") {
            if (values.data[idx].cycle[index].count < 8) {
                setFieldValue(
                    `data[${idx}].cycle[${index}].count`,
                    values.data[idx].cycle[index].count + 1
                );
            }
        } else {
            if (values.data[idx].cycle[index].count > 0) {
                setFieldValue(
                    `data[${idx}].cycle[${index}].count`,
                    values.data[idx].cycle[index].count - 1
                );
            }
        }
    };

    const durationCounter = (prop: string, index: number, idx: number) => {
        if (prop === "plus") {
            if (values.data[idx].cycle[index].dosageDuration < 7) {
                setFieldValue(
                    `data[${idx}].cycle[${index}].dosageDuration`,
                    values.data[idx].cycle[index].dosageDuration + 1
                );
            }
        } else {
            setFieldValue(
                `data[${idx}].cycle[${index}].dosageDuration`,
                values.data[idx].cycle[index].dosageDuration - 1
            );
        }
    }

    React.useEffect(() => {
        const {idx, index} = values.dosageData;
        updatedValue(index, idx);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [call]);

    console.log(values);

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
                                    {values.data.map((item, idx) => (
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
                                                                                            error={item.drug === null}
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
                                                <Grid item md={4} xs={12}>
                                                    <Autocomplete
                                                        size='small'
                                                        placeholder={t("unit", {ns: "consultation"})}
                                                        noOptionsText={t('no_unit')}
                                                        options={[]}
                                                        renderInput={(params) => <TextField
                                                            placeholder={t('unit')}
                                                            {...params} />}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Stack
                                                component={AnimatePresence}
                                                exitBeforeEnter
                                                spacing={2}>
                                                {item.cycle.map((innerItem, index) => (
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
                                                                <Stack
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
                                                                            component="label"
                                                                            endIcon={
                                                                                <IconButton
                                                                                    disabled={innerItem.dosageQty === "7"}
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
                                                                                        innerItem.dosageQty === "1/4"
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
                                                                        {innerItem.dosageTime.map((subitem, i) => (
                                                                            <Button
                                                                                component="label"
                                                                                variant="white"
                                                                                disableRipple
                                                                                startIcon={
                                                                                    <Checkbox
                                                                                        {...getFieldProps(
                                                                                            `data[${idx}].cycle[${index}].dosageTime[${i}].value`
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
                                                                        {innerItem.dosageMeal.map((subitem, i) => (
                                                                            <Button
                                                                                component="label"
                                                                                variant="white"
                                                                                disableRipple
                                                                                startIcon={
                                                                                    <Radio
                                                                                        {...getFieldProps(
                                                                                            `data[${idx}].cycle[${index}].dosageMealValue`
                                                                                        )}
                                                                                        value={subitem.value}
                                                                                        checked={
                                                                                            item.cycle[index]
                                                                                                .dosageMealValue ===
                                                                                            subitem.value
                                                                                        }
                                                                                    />
                                                                                }
                                                                                key={subitem.label}>
                                                                                {t(subitem.label, {
                                                                                    ns: "consultation",
                                                                                })}
                                                                            </Button>
                                                                        ))}
                                                                    </Stack>
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
                                                                        endIcon={
                                                                            <IconButton
                                                                                disabled={
                                                                                    innerItem.dosageDuration === 7
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
                                                                                disabled={
                                                                                    innerItem.dosageDuration === 1
                                                                                }
                                                                                onClick={() =>
                                                                                    durationCounter("minus", index, idx)
                                                                                }
                                                                                size="small"
                                                                                disableRipple>
                                                                                <RemoveIcon/>
                                                                            </IconButton>
                                                                        }
                                                                        variant="white"
                                                                        disableRipple>
                                                                        {innerItem.dosageDuration}
                                                                    </Button>
                                                                    {innerItem.duration.map((subitem, i) => (
                                                                        <Button
                                                                            component="label"
                                                                            variant="white"
                                                                            disableRipple
                                                                            startIcon={
                                                                                <Radio
                                                                                    {...getFieldProps(
                                                                                        `data[${idx}].cycle[${index}].durationValue`
                                                                                    )}
                                                                                    value={subitem.value}
                                                                                    checked={
                                                                                        item.cycle[index].durationValue ===
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
                                                            {values.data[idx].cycle.length > 1 && (
                                                                <IconButton
                                                                    onClick={() =>
                                                                        handleRemoveCycle(idx, innerItem)
                                                                    }
                                                                    className="btn-del"
                                                                    disableRipple>
                                                                    <IconUrl path="icdelete"/>
                                                                </IconButton>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </Stack>
                                            <Button
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
                                    {t("add_a_drug", {ns: "consultation"})}
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
                                {...(isMobile && {
                                    fullWidth: true,
                                })}
                                onClick={() => {
                                    setInfo("change-model");
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
                            {/*<DocList models={models} t={t}/>*/}
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
            <CustomDialog
                action={info}
                direction={direction}
                open={openDialog}
                data={{t}}
                {...(info === "change-model" && {
                    size: "sm",

                    actionDialog: (
                        <Stack
                            direction={{xs: "column", md: "row"}}
                            alignItems="center"
                            justifyContent="flex-end"
                            width={1}
                            spacing={1}>
                            <Button
                                {...(isMobile && {
                                    fullWidth: true,
                                })}
                                variant="text-black"
                                onClick={() => {
                                    setOpenDialog(false);
                                }}
                                startIcon={<CloseIcon/>}>
                                {t("change_modal_action_btn_1", {
                                    ns: "consultation",
                                })}
                            </Button>
                            <LoadingButton
                                {...(isMobile && {
                                    fullWidth: true,
                                })}
                                startIcon={<IconUrl path="ic-dowlaodfile"/>}
                                variant="contained"
                                onClick={() => {
                                    setInfo("save-model");
                                }}>
                                {t("change_modal_action_btn_2", {
                                    ns: "consultation",
                                })}
                            </LoadingButton>
                        </Stack>
                    ),
                })}
                {...(info === "save-model" && {
                    size: "xs",
                    title: t("save_the_template_in_folder", {
                        ns: "consultation",
                    }),
                    data: {t, dose: true},
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
                                startIcon={<IconUrl path="ic-dowlaodfile"/>}
                                variant="contained"
                                onClick={() => {
                                    setOpenDialog(false);
                                }}>
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
