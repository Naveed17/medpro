import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useCallback, useEffect, useState} from "react";
import {configSelector, DashLayout, dashLayoutSelector, setOngoing,} from "@features/base";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {
    Box,
    Button,
    Card,
    Checkbox,
    createFilterOptions,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    Stack,
    Switch,
    TextField,
    Theme,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import {useTranslation} from "next-i18next";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {RootStyled} from "@features/toolbar";
import {SubHeader} from "@features/subHeader";
import {Otable} from "@features/table";
import {useSnackbar} from "notistack";

import {LoadingScreen} from "@features/loadingScreen";

import {DefaultCountry} from "@lib/constants";
import {ActFeesMobileCard} from "@features/card";
import {DesktopContainer} from "@themes/desktopConainter";
import {MobileContainer} from "@themes/mobileContainer";
import {LoadingButton} from "@mui/lab";
import Icon from "@themes/urlIcon";
import CloseIcon from "@mui/icons-material/Close";
import {useInvalidateQueries, useMedicalEntitySuffix, useMedicalProfessionalSuffix,} from "@lib/hooks";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {ActionMenu} from "@features/menu";
import {Dialog as MedDialog} from "@features/dialog";
import {setStepperIndex, stepperSelector} from "@features/stepper";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

const filter = createFilterOptions<any>();

const headCells: readonly HeadCell[] = [
    {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "name",
        sortable: true,
        align: "left",
    },
    {
        id: "code",
        numeric: true,
        disablePadding: false,
        label: "code",
        sortable: true,
        align: "center",
    },
    {
        id: "contribution",
        numeric: true,
        disablePadding: false,
        label: "contribution",
        sortable: true,
        align: "center",
    },
    {
        id: "fees",
        numeric: true,
        disablePadding: false,
        label: "amount",
        sortable: true,
        align: "center",
    },
    {
        id: "actions",
        numeric: true,
        disablePadding: false,
        label: "actions",
        sortable: false,
        align: "right",
    },
];
const stepperData = [
    {
        title: "dialog.stepper.step-1",
    },
    {
        title: "dialog.stepper.step-2",
    },
    {
        title: "dialog.stepper.step-3",
    },
];

function ActFees() {
    const {data: session} = useSession();
    const {data: user} = session as Session;
    const router = useRouter();
    const theme = useTheme();

    const {enqueueSnackbar} = useSnackbar();
    const isMobile = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down("sm")
    );
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {medical_professional} = useMedicalProfessionalSuffix();
    const dispatch = useAppDispatch();
    const {trigger: invalidateQueries} = useInvalidateQueries();
    const {currentStep} = useAppSelector(stepperSelector);
    const {t, ready, i18n} = useTranslation("settings", {keyPrefix: "actfees"});
    const {medicalProfessionalData} = useAppSelector(dashLayoutSelector);

    const [mainActes, setMainActes] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState<any>("");
    const [create, setCreate] = useState(false);
    const [displayedItems, setDisplayedItems] = useState(10);
    const [consultationFees, setConsultationFees] = useState(0);
    const [collapse, setCollapse] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [isChecked, setIsChecked] = useState(user.medical_entity.hasDemo);
    const [newFees, setNewFees] = useState<{
        act: ActModel | string | null;
        fees: string;
        code: string;
        contribution: string;
    }>({act: null, fees: "", code: "", contribution: ""});
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const [openAgreementDialog, setAgreementDialog] = useState(false);
    const [popoverChildData, setPopoverChildData] = useState(false);
    const medical_entity = (user as UserDataResponse)
        .medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country
        ? medical_entity.country
        : DefaultCountry;
    const devise = doctor_country.currency?.name;
    const {direction} = useAppSelector(configSelector);
    const {trigger: triggerActUpdate} = useRequestQueryMutation(
        "/settings/acts/update"
    );
    const {trigger: triggerActDelete} = useRequestQueryMutation(
        "/settings/acts/delete"
    );
    const {trigger: triggerAddAct} =
        useRequestQueryMutation("/settings/acts/add");

    const {data: httpActSpeciality} = useRequestQuery(
        medical_professional
            ? {
                method: "GET",
                url: `/api/public/acts/${router.locale}`,
                params: {
                    ["specialities[0]"]:
                    medical_professional.specialities[0].speciality.uuid,
                },
            }
            : null
    );

    const {data: httpProfessionalsActs, mutate: mutateActs} = useRequestQuery(
        medical_professional
            ? {
                method: "GET",
                url: `${urlMedicalEntitySuffix}/professionals/${medical_professional?.uuid}/acts/${router.locale}`,
            }
            : null,
        {
            ...ReactQueryNoValidateConfig,
            ...(medical_professional && {
                variables: {
                    query: !isMobile
                        ? `?page=${router.query.page || 1
                        }&limit=10&withPagination=true&sort=true`
                        : "?sort=true",
                },
            }),
        }
    );

    useEffect(() => {
        if (medicalProfessionalData) {
            setConsultationFees(Number(medicalProfessionalData?.consultation_fees));
            if (localStorage.getItem("newCashbox")) {
                setIsChecked(localStorage.getItem("newCashbox") === "1");
            }
        }
    }, [medicalProfessionalData]);

    useEffect(() => {
        setLoading(true);
        if (httpProfessionalsActs !== undefined) {
            if (isMobile) {
                const response = (httpProfessionalsActs as HttpResponse).data;
                setMainActes(response as ActModel[]);
                setLoading(false);
            } else {
                const response =
                    (httpProfessionalsActs as HttpResponse)?.data?.list ?? [];
                setMainActes(response as ActModel[]);
                setLoading(false);
            }
        }
    }, [httpProfessionalsActs]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        //reload locize resources from cdn servers
        i18n.reloadResources(i18n.resolvedLanguage, ['settings']);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleCreate = () => {
        setCreate(true);
    };

    const handleRemove = () => {
        setCreate(false);
        setNewFees({act: null, fees: "", code: "", contribution: ""});
    };

    const editFees = () => {
        const form = new FormData();
        form.append("consultation_fees", consultationFees.toString());
        triggerActUpdate(
            {
                method: "PATCH",
                url: `${urlMedicalEntitySuffix}/professionals/${medical_professional?.uuid}/${router.locale}`,
                data: form,
            },
            {
                onSuccess: () =>
                    enqueueSnackbar(t("alert.updated"), {variant: "success"}),
            }
        );
    };

    const removeFees = (uuid: string) => {
        setLoading(true);
        triggerActDelete(
            {
                method: "DELETE",
                url: `${urlMedicalEntitySuffix}/acts/${uuid}/${router.locale}`,
            },
            {
                onSuccess: () => {
                    mutateActs().then(() => {
                        setOpen(false);
                        enqueueSnackbar(t("alert.delete-act"), {variant: "success"});
                        mutateMedicalProfessionalData();
                    });
                },
                onSettled: () => setTimeout(() => setLoading(false)),
            }
        );
    };

    const mutateMedicalProfessionalData = () => {
        //ongoing
        invalidateQueries([
            `${urlMedicalEntitySuffix}/professionals/${router.locale}`,
        ]);
    };

    const saveFees = () => {
        setLoading(true);
        if (newFees.fees !== "" && typeof newFees.act === "string") {
            const form = new FormData();
            form.append(
                "name",
                JSON.stringify({[router.locale as string]: newFees.act})
            );
            form.append("price", `${newFees.fees}`);
            newFees.code.length > 0 && form.append("code", `${newFees.code}`);
            newFees.contribution.length > 0 &&
            form.append("contribution", `${newFees.contribution}`);

            triggerAddAct(
                {
                    method: "POST",
                    url: `${urlMedicalEntitySuffix}/professionals/${medical_professional?.uuid}/new-acts/${router.locale}`,
                    data: form,
                },
                {
                    onSuccess: () => {
                        setLoading(false);
                        mutateActs().then(() => {
                            setCreate(false);
                            setNewFees({act: null, fees: "", code: "", contribution: ""});
                            enqueueSnackbar(t("alert.add"), {variant: "success"});
                        });
                    },
                }
            );
        }
    };

    const setActFees = useCallback(
        (isTopAct: boolean, actFees: any) => {
            setLoading(true);
            const form = new FormData();
            form.append("topAct", isTopAct.toString());
            form.append("act", actFees?.act?.uuid);
            triggerAddAct(
                {
                    method: "POST",
                    url: `${urlMedicalEntitySuffix}/professionals/${medical_professional?.uuid}/acts/${router.locale}`,
                    data: form,
                },
                {
                    onSuccess: () =>
                        handleEdit(
                            actFees,
                            actFees.fees,
                            (actFees.act as ActModel).name,
                            actFees.code,
                            actFees.contribution
                        ),
                }
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            medical_entity.uuid,
            medical_professional?.uuid,
            mutateActs,
            router.locale,
            session?.accessToken,
            triggerAddAct,
        ]
    );

    const handleEdit = (
        v: any,
        fees: string,
        name?: string,
        code?: string,
        contribution?: string
    ) => {
        const form = new FormData();
        form.append("price", fees);
        name && form.append("name", name);
        code && form.append("code", code);
        contribution && form.append("contribution", contribution);
        triggerActUpdate(
            {
                method: "PUT",
                url: `${urlMedicalEntitySuffix}/professionals/${medical_professional?.uuid}/acts/${v.act?.uuid}/${router.locale}`,
                data: form,
            },
            {
                onSuccess: () => {
                    setLoading(false);
                    mutateActs().then(() => {
                        enqueueSnackbar(t("alert.updated"), {variant: "success"});
                        mutateMedicalProfessionalData();
                        if (typeof newFees.act !== "string") {
                            setCreate(false);
                            setNewFees({act: null, fees: "", code: "", contribution: ""});
                        }
                    });
                },
            }
        );
    };
    const handleSelected = (prop: string) => {
        setOpen(true);
        setSelected(prop);
    };
    const handleScroll = () => {
        const total = (httpProfessionalsActs as HttpResponse)?.data.length;
        if (window.innerHeight + window.scrollY > document.body.offsetHeight - 50) {
            setLoading(true);
            if (total > displayedItems) {
                setDisplayedItems(displayedItems + 10);
            }
            if (total - displayedItems < 10) {
                setDisplayedItems(total);
            }
        }
    };
    const handleTableActions = ({
                                    action,
                                    event,
                                    row,
                                }: {
        action: string;
        event: any;
        row: any;
    }) => {
        switch (action) {
            case "OPEN-POPOVER":
                event.preventDefault();
                setPopoverChildData(false);
                setContextMenu(
                    contextMenu === null
                        ? {
                            mouseX: event.clientX + 2,
                            mouseY: event.clientY - 6,
                        }
                        : null
                );
                break;
            case "OPEN-POPOVER-CHILD":
                event.preventDefault();
                setPopoverChildData(true);
                setContextMenu(
                    contextMenu === null
                        ? {
                            mouseX: event.clientX + 2,
                            mouseY: event.clientY - 6,
                        }
                        : null
                );
                break;
            case "OPEN-AGREEMENT-DIALOG":
                event.preventDefault();
                setAgreementDialog(true);
                dispatch(setStepperIndex(0));
        }
    };
    const handleCloseMenu = () => {
        setContextMenu(null);
    };
    useEffect(() => {
        // Add scroll listener
        if (isMobile) {
            let promise = new Promise(function (resolve) {
                document.body.style.overflow = "hidden";
                setTimeout(() => {
                    window.addEventListener("scroll", handleScroll);
                    resolve(true);
                }, 2000);
            });
            promise.then(() => {
                return (document.body.style.overflow = "visible");
            });
        }
        return () => window.removeEventListener("scroll", handleScroll);
    }, [httpProfessionalsActs, displayedItems]); // eslint-disable-line react-hooks/exhaustive-deps

    const acts = (httpActSpeciality as HttpResponse)?.data as ActModel[];
    if (!ready) return <LoadingScreen button text={"loading-error"}/>;

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t("path")}</p>
                </RootStyled>
                {!create && isMobile && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon/>}
                        onClick={() => handleCreate()}
                    >
                        {t("add_a_new_act")}
                    </Button>
                )}

                {!isMobile && (
                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                        {!create && (
                            <Button
                                variant="contained"
                                startIcon={<AddIcon/>}
                                onClick={() => handleCreate()}
                            >
                                {t("add_a_new_act")}
                            </Button>
                        )}
                        {/*<span>|</span>
                        <Typography>{t("consultation")} :</Typography>
                        <TextField
                            id="outlined-basic"
                            value={consultationFees}
                            size="small"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">{devise}</InputAdornment>
                                ),
                                style: {width: 120, backgroundColor: "white"},
                            }}
                            onChange={(ev) => {
                                setConsultationFees(Number(ev.target.value));
                            }}
                            variant="outlined"
                        />
                        <IconButton
                            color={"primary"}
                            onClick={() => {
                                editFees();
                            }}>
                            <SaveRoundedIcon color={"primary"}/>
                        </IconButton>*/}
                    </Stack>
                )}
            </SubHeader>

            <Card style={{margin: 20, marginBottom: 0, paddingLeft: 10}}>
                <FormControlLabel
                    label={t("betav")}
                    sx={{
                        ml: theme.direction === 'rtl' ? 0 : -1.25
                    }}
                    control={
                        <Checkbox
                            checked={isChecked}
                            onChange={() => {
                                const form = new FormData();
                                form.append("is_demo", (!isChecked).toString());
                                triggerActUpdate(
                                    {
                                        method: "PATCH",
                                        url: `${urlMedicalEntitySuffix}/demo/${router.locale}`,
                                        data: form,
                                    },
                                    {
                                        onSuccess: () => {
                                            enqueueSnackbar(
                                                t(isChecked ? "alert.demodisabled" : "alert.demo"),
                                                {variant: "success"}
                                            );
                                            dispatch(setOngoing({newCashBox: !isChecked}));
                                            localStorage.setItem(
                                                "newCashbox",
                                                !isChecked ? "1" : "0"
                                            );
                                            setIsChecked(!isChecked);
                                        },
                                    }
                                );
                            }}
                        />
                    }
                />
            </Card>

            {isMobile && (
                <Box padding={2}>
                    <Stack
                        spacing={1}
                        padding={2}
                        style={{
                            background: "white",
                            borderRadius: 10,
                        }}
                    >
                        <Typography>{t("consultation")}</Typography>
                        <TextField
                            id="outlined-basic"
                            value={consultationFees}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">{devise}</InputAdornment>
                                ),
                            }}
                            onChange={(ev) => {
                                setConsultationFees(Number(ev.target.value));
                            }}
                            variant="outlined"
                        />
                        <Button
                            variant={"contained"}
                            onClick={() => {
                                editFees();
                            }}
                        >
                            <Typography>{t("save")}</Typography>
                        </Button>
                    </Stack>
                </Box>
            )}
            <Box
                sx={{
                    p: {xs: "40px 8px", sm: "30px 8px", md: 2},
                    table: {tableLayout: "fixed"},
                }}
            >
                <Paper sx={{p: 2, table: {tableLayout: "auto"}}}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        mb={2}
                        pb={1}
                        justifyContent="space-between"
                        borderBottom={1}
                        borderColor="divider"
                    >
                        <Typography variant="h6">{t("acts")}</Typography>
                        {/*<TextField
                            placeholder={t("search")}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{color: theme.palette.grey["200"]}}/>
                                    </InputAdornment>
                                ),
                            }}
                        />*/}
                    </Stack>
                    <DesktopContainer>
                        <Otable
                            headers={headCells}
                            rows={mainActes}
                            from={"actfees"}
                            edit={handleEdit}
                            handleEvent={handleTableActions}
                            {...{t, loading, handleSelected}}
                            total={(httpProfessionalsActs as HttpResponse)?.data?.total}
                            totalPages={
                                (httpProfessionalsActs as HttpResponse)?.data?.totalPages
                            }
                            pagination
                        />
                    </DesktopContainer>
                    <MobileContainer>
                        <Stack spacing={0.5}>
                            {mainActes.slice(0, displayedItems).map((act: any) => (
                                <React.Fragment key={act.uuid}>
                                    <ActFeesMobileCard
                                        data={act}
                                        editMotif={handleEdit}
                                        {...{
                                            t,
                                            handleSelected,
                                            handleEvent: handleTableActions,
                                            theme,
                                        }}
                                    />
                                </React.Fragment>
                            ))}
                        </Stack>
                    </MobileContainer>
                </Paper>
            </Box>
            <Dialog
                PaperProps={{
                    sx: {
                        width: "100%",
                    },
                }}
                maxWidth="sm"
                open={open}
            >
                <DialogTitle
                    sx={{
                        bgcolor: (theme: Theme) => theme.palette.error.main,
                        px: 1,
                        py: 2,
                    }}
                >
                    {t("dialog.delete-act-title")}
                </DialogTitle>
                <DialogContent style={{paddingTop: 20}}>
                    <Typography>{t("dialog.delete-act-desc")}</Typography>
                </DialogContent>
                <DialogActions
                    sx={{borderTop: 1, borderColor: "divider", px: 1, py: 2}}
                >
                    <Stack direction="row" spacing={1}>
                        <Button
                            onClick={() => {
                                setOpen(false);
                            }}
                            startIcon={<CloseIcon/>}
                        >
                            {t("dialog.cancel")}
                        </Button>
                        <LoadingButton
                            variant="contained"
                            loading={loading}
                            color="error"
                            onClick={() => removeFees(selected?.uuid as any)}
                            startIcon={<Icon path="setting/icdelete" color="white"/>}
                        >
                            {t("dialog.delete")}
                        </LoadingButton>
                    </Stack>
                </DialogActions>
            </Dialog>
            <ActionMenu {...{contextMenu, handleClose: handleCloseMenu}}>
                {popoverChildData ? (
                    <MenuItem>
                        <Typography color="common.white">Child Data</Typography>
                    </MenuItem>
                ) : (
                    <MenuItem>
                        <Typography color="common.white">Parent Data</Typography>
                    </MenuItem>
                )}
            </ActionMenu>
            <MedDialog
                action={"agreement"}
                open={openAgreementDialog}
                data={{t, devise, stepperData, collapse}}
                direction={direction}
                sx={{bgcolor: theme.palette.background.default}}
                dialogClose={() => {
                    setAgreementDialog(false);
                    setCollapse(false);
                }}
                onClose={() => {
                    setAgreementDialog(false);
                    setCollapse(false);
                }}
                t={t}
                headerDialog={
                    <DialogTitle
                        sx={{
                            backgroundColor: (theme: Theme) => theme.palette.primary.main,
                            position: "relative",
                        }}
                        id="scroll-dialog-title"
                    >
                        <Stack
                            direction={"row"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                        >
                            {t("dialog.title")}
                            <Stack direction="row" alignItems="center" ml={1}>
                                {stepperData.length - 1 === currentStep ? (
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            setAgreementDialog(false);
                                            setCollapse(false);
                                        }}
                                    >
                                        <CloseIcon
                                            fontSize="small"
                                            sx={{color: "common.white"}}
                                        />
                                    </IconButton>
                                ) : (
                                    <FormControlLabel
                                        sx={{
                                            mr: 0,
                                            ".MuiTypography-root": {color: "common.white"},
                                        }}
                                        control={
                                            <Switch
                                                className="custom-switch"
                                                checked={collapse}
                                                onChange={(event) => {
                                                    if (event.target.checked) {
                                                        dispatch(setStepperIndex(currentStep + 1));
                                                    } else {
                                                        dispatch(setStepperIndex(currentStep - 1));
                                                    }
                                                    setCollapse(event.target.checked);
                                                }}
                                            />
                                        }
                                        label={t("dialog.switch")}
                                    />
                                )}
                            </Stack>
                        </Stack>
                    </DialogTitle>
                }
                actionDialog={
                    <Stack
                        width={1}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        position="relative"
                        {...(stepperData.length - 1 === currentStep && {
                            pb: {xs: 6, sm: 0},
                        })}
                    >
                        <Button
                            variant="text-black"
                            onClick={() =>
                                currentStep < 1
                                    ? (setAgreementDialog(false), setCollapse(false))
                                    : dispatch(setStepperIndex(currentStep - 1))
                            }
                        >
                            {t("dialog.back")}
                        </Button>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    if (stepperData.length - 1 > currentStep) {
                                        dispatch(setStepperIndex(currentStep + 1));
                                    } else {
                                        setAgreementDialog(false);
                                        setCollapse(false);
                                    }
                                }}
                                {...(stepperData.length - 1 === currentStep && {
                                    variant: "outlined",
                                    color: "info",
                                    sx: {bgcolor: theme.palette.grey["A500"]},
                                })}
                            >
                                {t("dialog.next")}
                            </Button>
                            {stepperData.length - 1 === currentStep && (
                                <Button
                                    onClick={() => {
                                        setAgreementDialog(false);
                                        setCollapse(false);
                                        setConfirmDialog(true);
                                    }}
                                    variant="contained"
                                    sx={{
                                        position: {xs: "absolute", sm: "static"},
                                        width: {xs: "100%", sm: "auto"},
                                        left: {xs: -8, sm: "unset"},
                                        bottom: {xs: 0, sm: "unset"},
                                    }}
                                >
                                    {t("dialog.confirm_save")}
                                </Button>
                            )}
                        </Stack>
                    </Stack>
                }
            />
            <MedDialog
                action={"create-act"}
                title={t("dialog.create_act")}
                size={"sm"}
                open={create}
                data={{acts, theme, t, isMobile, newFees, setNewFees, filter, devise}}
                direction={direction}
                onClose={() => {
                    setCreate(false);
                }}
                dialogClose={() => {
                    setCreate(false);
                }}
                actionDialog={
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        width={1}
                    >
                        <Button
                            startIcon={<CloseIcon/>}
                            variant="text-black"
                            onClick={() => {
                                handleRemove();
                            }}
                        >
                            {t("cancel")}
                        </Button>
                        <LoadingButton
                            startIcon={<AddIcon/>}
                            {...{loading}}
                            disabled={newFees.act === null || newFees.fees.length === 0}
                            variant="contained"
                            onClick={() => {
                                if (typeof newFees.act === "string") {
                                    saveFees();
                                } else {
                                    setActFees(false, newFees);
                                }
                            }}
                        >
                            {t("add_a_new_act")}
                        </LoadingButton>
                    </Stack>
                }
            />
            <Dialog
                open={confirmDialog}
                maxWidth="sm"
                onClose={() => {
                    setConfirmDialog(false);
                }}
            >
                <DialogTitle
                    component={Stack}
                    direction="row"
                    justifyContent="space-between"
                >
                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        color={"text.primary"}
                    >
                        {t("dialog.confirm_dialog_title")}
                    </Typography>
                    <IconButton size="small" onClick={() => setConfirmDialog(false)}>
                        <CloseIcon fontSize="small"/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t("dialog.confirm_dialog_desc")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="text-black">{t("dialog.exit")}</Button>
                    <Button variant="contained">{t("dialog.add_an_other")}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, [
            "common",
            "menu",
            "settings",
        ])),
    },
});

export default ActFees;

ActFees.auth = true;

ActFees.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
