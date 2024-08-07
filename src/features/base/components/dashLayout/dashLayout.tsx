import dynamic from "next/dynamic";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import React, {useEffect, useState} from "react";
import {setAgendas, setConfig, setView} from "@features/calendar";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {configSelector, dashLayoutState, setOngoing, PageTransition, PageTransitionRef} from "@features/base";
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    Dialog as MuiDialog,
    DialogTitle,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
    IconButton
} from "@mui/material";
import Icon from "@themes/urlIcon";
import {Dialog} from "@features/dialog";
import {NoDataCard} from "@features/card";
import {useTranslation} from "next-i18next";
import {useSnackbar} from "notistack";
import {setProgress} from "@features/progressUI";
import {
    checkNotification,
    increaseNumberInString,
    useMedicalEntitySuffix,
    isAppleDevise,
    isSupported, groupPermissionsByFeature
} from "@lib/hooks";
import {DuplicateDetected, duplicatedSelector, resetDuplicated, setDuplicated} from "@features/duplicateDetected";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import {setSelectedRows} from "@features/table";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import {setPaymentTypesList} from "@features/leftActionBar/components/cashbox";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {pdfjs} from "react-pdf";
import {NewFeaturesCarousel} from "@features/carousels";
import {openNewFeaturesDialog, sideBarSelector} from "@features/menu";
import {useFeaturePermissions} from "@lib/hooks/rest";
import {setPermissions} from "@features/casl";

const SideBarMenu = dynamic(() => import("@features/menu/components/sideBarMenu/components/sideBarMenu"));

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function DashLayout({children}: LayoutProps, ref: PageTransitionRef) {
    const router = useRouter();
    const {data: session} = useSession();
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const {closeSnackbar} = useSnackbar();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const {t} = useTranslation('common');
    const {
        duplications,
        duplicationSrc,
        openDialog: duplicateDetectedDialog,
        mutate: mutateDuplicationSource
    } = useAppSelector(duplicatedSelector);
    const {direction} = useAppSelector(configSelector);
    const {newFeaturesDialogOpen} = useAppSelector(sideBarSelector);

    const [importDataDialog, setImportDataDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [mergeDialog, setMergeDialog] = useState(false);
    const [agenda, setAgenda] = useState<AgendaConfigurationModel | null>(null);

    const {data: user} = session as Session;
    const general_information = (user as UserDataResponse).general_information;

    const permission = !isAppleDevise() && isSupported() ? checkNotification() : false; // Check notification permission
    const medicalEntityHasUser = (user as UserDataResponse)?.medical_entities?.find((entity: MedicalEntityDefault) => entity.is_default)?.user;
    // Get current root feature
    const slugFeature = router.pathname.split('/')[2];
    const features = (user as UserDataResponse)?.medical_entities?.find((entity: MedicalEntityDefault) => entity.is_default)?.features;
    const rootFeature = features?.find(feature => feature.root === slugFeature);
    const {permissions} = useFeaturePermissions(rootFeature?.slug as string, !rootFeature?.hasProfile);

    const {trigger: mergeDuplicationsTrigger} = useRequestQueryMutation("/duplications/merge");
    const {trigger: noDuplicationsTrigger} = useRequestQueryMutation("/duplications/unMerge");

    const {data: httpAgendasResponse} = useRequestQuery(medicalEntityHasUser ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/agendas/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    const {data: httpOngoingResponse} = useRequestQuery(agenda ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda.uuid}/ongoing/appointments/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    const {data: httpProfessionalsResponse} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/professionals/${router.locale}`
    }, ReactQueryNoValidateConfig);

    const renderNoDataCard = <NoDataCard
        {...{t}}
        ns={'common'}
        onHandleClick={() => {
            router.push('/dashboard/settings/data').then(() => {
                setImportDataDialog(false);
            });
        }}
        data={{
            mainIcon: <Icon path={"ic-upload"} width={"100"} height={"100"}/>,
            title: "import_data.sub_title",
            description: "import_data.description",
            buttons: [{
                text: "import_data.button",
                icon: <Icon path={"ic-upload"} width={"18"} height={"18"}/>,
                variant: "expire",
                color: "white"
            }]
        }}/>

    const getCheckedDuplications = () => {
        return duplications ? duplications.filter(duplication => (duplication?.checked === undefined || (duplication.hasOwnProperty('checked') && duplication.checked))) : [];
    }

    const handleNoDuplication = () => {
        setLoading(true);
        const params = new FormData();
        duplications && params.append('notDuplicatedPatients', getCheckedDuplications().map(duplication => duplication.uuid).join(","));

        medicalEntityHasUser && noDuplicationsTrigger({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${duplicationSrc?.uuid}/no-duplications/${router.locale}`,
            data: params
        }, {
            onSuccess: () => {
                setLoading(false);
                dispatch(setDuplicated({openDialog: false}));
                dispatch(resetDuplicated());
                mutateDuplicationSource && mutateDuplicationSource();
            }
        });
    }

    const getPatientParamsKey = (param: string) => {
        switch (param) {
            case "contact":
                return "phone";
            case "insurances":
                return "insurance";
            default:
                return param;
        }
    }

    const getPatientParamsValue = (param: string, value: any) => {
        switch (param) {
            case "insurances":
                return prepareInsurances(value)
            case "gender":
                return value === 'M' ? '1' : '2';
            default:
                return value;
        }
    }

    const updateParam_ = (param: string) => {
        return param.split(/(?=[A-Z])/).map((key: string) => key.toLowerCase()).join("_");
    }

    const prepareInsurances = (insurances: any) => {
        return insurances?.map((insurance: any) => ({
            insurance_number: insurance.insuranceNumber,
            insurance_uuid: insurance.insurance?.uuid,
            ...(insurance.insuredPerson && {
                insurance_social: {
                    firstName: insurance.insuredPerson.firstName ?? "",
                    lastName: insurance.insuredPerson.lastName ?? "",
                    birthday: insurance.insuredPerson.birthday ?? null,
                    ...(insurance.insuredPerson.contact && {
                        phone: {
                            code: insurance.insuredPerson.contact.code,
                            value: insurance.insuredPerson.contact.value,
                            type: "phone",
                            is_public: false,
                            is_support: false
                        }
                    })
                }
            }),
            insurance_type: insurance.type ? insurance.type.toString() : "0",
            expand: insurance.type ? insurance.type.toString() !== "0" : false
        }))
    }

    const handleMergeDuplication = () => {
        setLoading(true);
        const params = new FormData();
        duplications && params.append('duplicatedPatients', getCheckedDuplications().map(duplication => duplication.uuid).join(","));
        Object.entries(duplicationSrc as PatientModel).forEach(
            object => params.append(getPatientParamsKey(updateParam_(object[0])), (object[1] !== null && typeof object[1] !== "string") ? JSON.stringify(getPatientParamsValue(object[0], object[1])) : getPatientParamsValue(object[0], object[1]) ?? ""));

        medicalEntityHasUser && mergeDuplicationsTrigger({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${duplicationSrc?.uuid}/merge-duplications/${router.locale}`,
            data: params
        }, {
            onSuccess: () => {
                setLoading(false);
                dispatch(setSelectedRows([]));
                dispatch(setDuplicated({openDialog: false}));
                dispatch(resetDuplicated());
                setTimeout(() => setMergeDialog(false));
                mutateDuplicationSource && mutateDuplicationSource();
            }
        })
    }

    const handleNewFeaturesClose = () => {
        dispatch(openNewFeaturesDialog(false));
        localStorage.setItem('new-features', "true");
    }

    useEffect(() => {
        if (httpAgendasResponse) {
            const agendasData = ((httpAgendasResponse as HttpResponse)?.data ?? []) as AgendaPermissionsModel[];
            const defaultAgenda = agendasData.reduce((agendas: AgendaPermissionsModel, agendaPermission: AgendaPermissionsModel) => ({...(agendas ?? {}), ...(agendaPermission.agenda?.isDefault ? agendaPermission : {})}), {});
            if (defaultAgenda?.permissions) {
                const groupedPermissions = groupPermissionsByFeature(defaultAgenda?.permissions);
                dispatch(setPermissions({
                    "agenda": groupedPermissions[0]?.children.map((permission: PermissionModel) => permission?.slug),
                    "consultation": groupedPermissions[1]?.children.map((permission: PermissionModel) => permission?.slug)
                }));
            }
            if (defaultAgenda?.agenda) {
                const agenda = defaultAgenda?.agenda;
                setAgenda(agenda);
                dispatch(setOngoing({appointmentTypes: agenda.appointmentType}));
                dispatch(setConfig({...agenda}));
                const agendas = agendasData.reduce((agendas: AgendaConfigurationModel[], agendaPermission: AgendaPermissionsModel) => [...(agendas ?? []), ...(agendaPermission.agenda ? [agendaPermission.agenda] : [])], []);
                dispatch(setAgendas(agendas));
            }
        }
    }, [httpAgendasResponse, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (medicalEntityHasUser) {
            dispatch(setOngoing({medicalEntityHasUser}));
        }
    }, [medicalEntityHasUser, dispatch]);

    useEffect(() => {
        if (httpOngoingResponse) {
            const calendarData = (httpOngoingResponse as HttpResponse).data as dashLayoutState;
            if (calendarData.import_data?.length === 0) {
                localStorage.removeItem("import-data");
                localStorage.removeItem("import-data-progress");
                closeSnackbar();
            } else {
                const progress = localStorage.getItem("import-data-progress")
                dispatch(setProgress(progress ? parseFloat(progress) : 10));
            }

            let demo = user.medical_entity.hasDemo;
            if (localStorage.getItem('newCashbox')) {
                demo = localStorage.getItem('newCashbox') === "1";
            }

            dispatch(setOngoing({
                waiting_room: calendarData.waiting_room,
                import_data: calendarData.import_data,
                newCashBox: demo,
                doctorHasStarted: !!calendarData?.doctor_started,
                next: calendarData?.next ?? null,
                nb_appointment: calendarData.nb_appointment ?? 0,
                pending: calendarData.pending ?? 0,
                last_fiche_id: increaseNumberInString(calendarData.last_fiche_id ? calendarData.last_fiche_id : '0'),
                ongoing: calendarData?.ongoing ?? []
            }));
        }
    }, [httpOngoingResponse, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (permission) {
            dispatch(setOngoing({allowNotification: !["denied", "default"].includes(permission)}));
        }
    }, [dispatch, permission]);

    useEffect(() => {
        if (isMobile) {
            dispatch(setView("listWeek"));
        } else if (general_information && general_information?.agendaDefaultFormat) {
            // Set default calendar view
            dispatch(setView(general_information.agendaDefaultFormat));
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (httpProfessionalsResponse) {
            const medicalProfessionalData = (httpProfessionalsResponse as HttpResponse)?.data as MedicalProfessionalPermissionModel;
            dispatch(setPaymentTypesList(medicalProfessionalData[0].payments));
            dispatch(setOngoing({
                medicalProfessionalData: medicalProfessionalData[0],
                secretaryAccess: medicalProfessionalData?.secretary_access ?? false
            }));
        }
    }, [httpProfessionalsResponse, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (permissions?.length > 0) {
            dispatch(setPermissions({[rootFeature?.root as string]: permissions.map(permission => permission?.slug)}));
        }
    }, [permissions]); // eslint-disable-line react-hooks/exhaustive-deps

    /*
        useEffect(() => {
            if (!localStorage.getItem("new-features")) {
                setTimeout(() => {
                    dispatch(openNewFeaturesDialog(true));
                }, 3000);
            }
        }, []); // eslint-disable-line react-hooks/exhaustive-deps
    */

    return (
        <SideBarMenu>
            <PageTransition ref={ref}>
                {children}
            </PageTransition>
            <Dialog
                {...{
                    sx: {
                        minHeight: 340
                    }
                }}
                color={theme.palette.expire.main}
                contrastText={theme.palette.expire.contrastText}
                open={importDataDialog}
                title={t(`import_data.title`)}
                dialogClose={() => {
                    setImportDataDialog(false);
                }}
                action={() => renderNoDataCard}/>

            <Dialog
                color={theme.palette.error.main}
                contrastText={theme.palette.error.contrastText}
                dir={direction}
                action={() => {
                    return (
                        <Box sx={{minHeight: 150}}>
                            <Typography sx={{textAlign: "center"}}
                                        variant="subtitle1">{t("dialogs.merge-dialog.sub-title")}</Typography>
                            <Typography sx={{textAlign: "center"}}
                                        margin={2}>{t("dialogs.merge-dialog.description")}</Typography>
                        </Box>)
                }}
                open={mergeDialog}
                title={t("dialogs.merge-dialog.title")}
                actionDialog={
                    <>
                        <Button
                            variant="text-primary"
                            onClick={() => {
                                setMergeDialog(false);
                            }}
                            startIcon={<CloseIcon/>}>
                            {t("dialogs.merge-dialog.cancel")}
                        </Button>
                        <LoadingButton
                            {...{loading}}
                            loadingPosition="start"
                            variant="contained"
                            color={"error"}
                            onClick={handleMergeDuplication}
                            startIcon={<ArchiveRoundedIcon/>}>
                            {t("dialogs.merge-dialog.confirm")}
                        </LoadingButton>
                    </>
                }
            />

            <Dialog
                {...{
                    sx: {
                        minHeight: 340
                    },
                }}
                size={"lg"}
                color={theme.palette.primary.main}
                contrastText={theme.palette.primary.contrastText}
                dialogClose={() => {
                    dispatch(setDuplicated({openDialog: false}));
                }}
                action={() => <DuplicateDetected src={duplicationSrc} data={duplications}/>}
                actionDialog={
                    <DialogActions
                        sx={{
                            justifyContent: "space-between",
                            width: "100%",
                            "& .MuiDialogActions-root": {
                                div: {
                                    width: "100%",
                                },
                            },
                        }}>
                        <Stack
                            direction={isMobile ? "column" : "row"}
                            justifyContent={"space-between"}
                            sx={{width: "100%", textAlign: "center"}}>
                            <Button
                                onClick={() => dispatch(setDuplicated({openDialog: false}))}
                                startIcon={<CloseIcon/>}>
                                {t("dialogs.duplication-dialog.later")}
                            </Button>
                            <Box>
                                <LoadingButton
                                    {...{loading}}
                                    loadingPosition="start"
                                    onClick={handleNoDuplication}
                                    sx={{marginRight: 1}}
                                    color={"inherit"}
                                    startIcon={<CloseIcon/>}>
                                    {t("dialogs.duplication-dialog.no-duplicates")}
                                </LoadingButton>
                                <LoadingButton
                                    {...{loading}}
                                    loadingPosition="start"
                                    onClick={() => setMergeDialog(true)}
                                    variant="contained"
                                    startIcon={<ArchiveRoundedIcon/>}>
                                    {t("dialogs.duplication-dialog.save")}
                                </LoadingButton>
                            </Box>
                        </Stack>
                    </DialogActions>
                }
                open={duplicateDetectedDialog}
                title={t(`dialogs.duplication-dialog.title`)}
            />
            <MuiDialog
                open={newFeaturesDialogOpen}
                maxWidth={"lg"}
                PaperProps={{
                    sx: {
                        width: '100%',
                        background: 'radial-gradient(459.65% 113.63% at 85.2% 70.92%, #34BBFF 0%, #0696D6 76.56%)',
                        boxShadow: "0px 8px 8px -4px rgba(16, 24, 40, 0.04), 0px 20px 24px -4px rgba(16, 24, 40, 0.10)",
                        m: {xs: 1, sm: 3},
                    }
                }}
                onClose={handleNewFeaturesClose}>
                <DialogTitle component={Stack}
                             direction={"row"}
                             justifyContent={"space-between"}>
                    <Typography variant="h6" fontWeight={600}>{t("dialogs.new_features.title")}</Typography>
                    <IconButton disableRipple size="small" onClick={handleNewFeaturesClose}>
                        <CloseIcon sx={{color: 'common.white'}} fontSize="small"/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <NewFeaturesCarousel {...{t, onClose: handleNewFeaturesClose}}/>
                </DialogContent>
            </MuiDialog>
        </SideBarMenu>
    );
}

export default DashLayout;
