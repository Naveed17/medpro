import dynamic from "next/dynamic";
import {useRouter} from "next/router";
import {motion} from "framer-motion";
import {signIn, useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRequest, useRequestMutation} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import React, {useEffect, useState} from "react";
import {setAgendas, setConfig, setPendingAppointments, setView} from "@features/calendar";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {dashLayoutState, setOngoing} from "@features/base";
import {AppLock} from "@features/appLock";
import {Box, Button, DialogActions, Stack, useTheme} from "@mui/material";
import Icon from "@themes/urlIcon";
import {Dialog} from "@features/dialog";
import {NoDataCard} from "@features/card";
import {useTranslation} from "next-i18next";
import {useSnackbar} from "notistack";
import {setProgress} from "@features/progressUI";
import {checkNotification, useMedicalEntitySuffix} from "@lib/hooks";
import {isAppleDevise} from "@lib/hooks/isAppleDevise";

const SideBarMenu = dynamic(() => import("@features/menu/components/sideBarMenu/components/sideBarMenu"));

const variants = {
    hidden: {opacity: 0},
    enter: {opacity: 1},
    exit: {opacity: 0},
};

export const ImportCardData = {
    mainIcon: <Icon path={"ic-upload"} width={"100"} height={"100"}/>,
    title: "import_data.sub_title",
    description: "import_data.description",
    buttons: [{
        text: "import_data.button",
        icon: <Icon path={"ic-upload"} width={"18"} height={"18"}/>,
        variant: "expire",
        color: "white"
    }]
};

import {useSWRConfig} from 'swr';
import {DuplicateDetected, duplicatedSelector, resetDuplicated, setDuplicated} from "@features/duplicateDetected";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import IconUrl from "@themes/urlIcon";

function DashLayout({children}: LayoutProps) {
    const router = useRouter();
    const {data: session} = useSession();
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const {closeSnackbar} = useSnackbar();
    const {cache} = useSWRConfig();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {t} = useTranslation('common');
    const {
        duplications,
        duplicationSrc,
        openDialog: duplicateDetectedDialog,
        mutate: mutateDuplicationSource
    } = useAppSelector(duplicatedSelector);

    const [importDataDialog, setImportDataDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const {trigger: mergeDuplicationsTrigger} = useRequestMutation(null, "/duplications/merge");
    const {trigger: noDuplicationsTrigger} = useRequestMutation(null, "/duplications/unMerge");

    const {data: httpUserResponse} = useRequest({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/professional/user/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const medicalEntityHasUser = (httpUserResponse as HttpResponse)?.data as MedicalEntityHasUsersModel[];
    const [agendasData, setAgendasData] = useState<AgendaConfigurationModel[]>((medicalEntityHasUser && cache.get(`${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/agendas/${router.locale}`)?.data?.data?.data) ?? null);
    const [agenda, setAgenda] = useState<AgendaConfigurationModel | null>(null);

    const {data: httpAgendasResponse, mutate: mutateAgenda} = useRequest(medicalEntityHasUser ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/agendas/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    } : null, SWRNoValidateConfig);

    // Check notification permission
    const permission = !isAppleDevise() ? checkNotification() : false;

    const {data: httpPendingAppointmentResponse, mutate: mutatePendingAppointment} = useRequest(agenda ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda.uuid}/appointments/get/pending/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null, SWRNoValidateConfig);

    const {data: httpOngoingResponse, mutate} = useRequest(agenda ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda.uuid}/ongoing/appointments/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    } : null, SWRNoValidateConfig);

    const {data: httpProfessionalsResponse} = useRequest({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/professionals/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const {data: httpAppointmentTypesResponse} = useRequest(medicalEntityHasUser && medicalEntityHasUser.length > 0 ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/appointments/types/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null, SWRNoValidateConfig);

    const {data: user} = session as Session;
    const general_information = (user as UserDataResponse).general_information;
    const calendarStatus = (httpOngoingResponse as HttpResponse)?.data as dashLayoutState;
    const pendingAppointments = (httpPendingAppointmentResponse as HttpResponse)?.data as AppointmentModel[];
    const appointmentTypes = (httpAppointmentTypesResponse as HttpResponse)?.data as AppointmentTypeModel[];
    const medicalProfessionalData = (httpProfessionalsResponse as HttpResponse)?.data as MedicalProfessionalDataModel[];

    const renderNoDataCard = <NoDataCard
        {...{t}}
        ns={'common'}
        onHandleClick={() => {
            router.push('/dashboard/settings/data').then(() => {
                setImportDataDialog(false);
            });
        }}
        data={ImportCardData}/>

    const justNumbers = (str: string) => {
        const res = str.match(/\d+$/); // Find the last numeric digit
        if (str && res) {
            let numStr = res[0];
            let num = parseInt(numStr);
            num++;
            str = str.replace(/\d+$/, num.toString());
        }
        return str;
    }

    const getCheckedDuplications = () => {
        return duplications ? duplications.filter(duplication => (duplication?.checked === undefined || (duplication.hasOwnProperty('checked') && duplication.checked))) : [];
    }

    const handleNoDuplication = () => {
        setLoading(true);
        const params = new FormData();
        duplications && params.append('notDuplicatedPatients', getCheckedDuplications().map(duplication => duplication.uuid).join(","));

        medicalEntityHasUser && noDuplicationsTrigger({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${duplicationSrc?.uuid}/no-duplications/${router.locale}`,
            data: params,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then(() => {
            setLoading(false);
            dispatch(setDuplicated({openDialog: false}));
            dispatch(resetDuplicated());
            mutateDuplicationSource && mutateDuplicationSource();
        })
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
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${duplicationSrc?.uuid}/merge-duplications/${router.locale}`,
            data: params,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then(() => {
            setLoading(false);
            dispatch(setDuplicated({openDialog: false}));
            dispatch(resetDuplicated());
            mutateDuplicationSource && mutateDuplicationSource();
        })
    }

    useEffect(() => {
        if (httpAgendasResponse) {
            const localAgendasData = (httpAgendasResponse as HttpResponse)?.data as AgendaConfigurationModel[];
            setAgendasData(localAgendasData);
            const agendaUser = localAgendasData?.find((item: AgendaConfigurationModel) => item.isDefault) as AgendaConfigurationModel;
            setAgenda(agendaUser);
            dispatch(setConfig({...agendaUser, mutate: [mutateAgenda, mutatePendingAppointment]}));
            dispatch(setAgendas(agendasData));
        }
    }, [httpAgendasResponse, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (pendingAppointments) {
            dispatch(setPendingAppointments(pendingAppointments));
        }
    }, [pendingAppointments, dispatch]);

    useEffect(() => {
        if (calendarStatus) {
            if (calendarStatus.import_data?.length === 0) {
                localStorage.removeItem("import-data");
                localStorage.removeItem("import-data-progress");
                closeSnackbar();
            } else {
                const progress = localStorage.getItem("import-data-progress")
                dispatch(setProgress(progress ? parseFloat(progress) : 10));
            }

            dispatch(setOngoing({
                mutate,
                waiting_room: calendarStatus.waiting_room,
                import_data: calendarStatus.import_data,
                next: calendarStatus.next ? calendarStatus.next : null,
                last_fiche_id: justNumbers(calendarStatus.last_fiche_id ? calendarStatus.last_fiche_id : '0'),
                ongoing: calendarStatus.ongoing ? calendarStatus.ongoing : null
            }));
        }
    }, [calendarStatus, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (session?.error === "RefreshAccessTokenError") {
            signIn('keycloak', {
                callbackUrl: `${router.locale}/dashboard/agenda`,
            }); // Force sign in to hopefully resolve error
        }
    }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (permission) {
            dispatch(setOngoing({allowNotification: !["denied", "default"].includes(permission)}));
        }
    }, [dispatch, permission])

    useEffect(() => {
        if (general_information && general_information?.agendaDefaultFormat) {
            // Set default calendar view
            dispatch(setView(general_information.agendaDefaultFormat));
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (medicalEntityHasUser) {
            dispatch(setOngoing({medicalEntityHasUser}));
        }
    }, [dispatch, medicalEntityHasUser])

    useEffect(() => {
        if (appointmentTypes) {
            dispatch(setOngoing({appointmentTypes}));
        }
    }, [dispatch, appointmentTypes])

    useEffect(() => {
        if (medicalProfessionalData) {
            dispatch(setOngoing({medicalProfessionalData}));
        }
    }, [medicalProfessionalData, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <SideBarMenu>
            <AppLock/>
            <motion.main
                key={router.route}
                initial="hidden"
                animate="enter"
                exit="exit"
                variants={variants}
                transition={{type: "linear"}}>
                {children}
            </motion.main>
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
                {...{
                    sx: {
                        minHeight: 340,
                        "& .MuiDialog-root": {
                            zIndex: 1199
                        },
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
                            direction={"row"}
                            justifyContent={"space-between"}
                            sx={{width: "100%"}}>
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
                                    onClick={handleMergeDuplication}
                                    variant="contained"
                                    startIcon={<IconUrl path="ic-dowlaodfile"></IconUrl>}>
                                    {t("dialogs.duplication-dialog.save")}
                                </LoadingButton>
                            </Box>
                        </Stack>
                    </DialogActions>
                }
                open={duplicateDetectedDialog}
                title={t(`dialogs.duplication-dialog.title`)}
            />
        </SideBarMenu>
    );
}

export default DashLayout;
