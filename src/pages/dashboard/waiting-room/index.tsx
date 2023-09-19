import {GetStaticProps} from "next";
import React, {ReactElement, useEffect, useState} from "react";
//components
import {DetailsCard, NoDataCard, setTimer, timerSelector} from "@features/card";
// next-i18next
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";
import {configSelector, DashLayout, dashLayoutSelector, setOngoing} from "@features/base";
import {Alert, Box, Button, DialogActions, Drawer, LinearProgress, MenuItem} from "@mui/material";
import {SubHeader} from "@features/subHeader";
import {RoomToolbar} from "@features/toolbar";
import {onOpenPatientDrawer, Otable, tableActionSelector} from "@features/table";
import {Session} from "next-auth";
import {useRequest, useRequestMutation} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {DesktopContainer} from "@themes/desktopConainter";
import {MobileContainer} from "@themes/mobileContainer";
import Typography from "@mui/material/Typography";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {leftActionBarSelector} from "@features/leftActionBar";
import moment from "moment-timezone";
import {useSnackbar} from "notistack";
import {toggleSideBar} from "@features/menu";
import {useIsMountedRef, useMedicalEntitySuffix} from "@lib/hooks";
import {appLockSelector} from "@features/appLock";
import dynamic from "next/dynamic";
import {Dialog, PatientDetail, preConsultationSelector} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import IconUrl from "@themes/urlIcon";
import {AddWaitingRoomCardData, DefaultCountry, WaitingHeadCells} from "@lib/constants";
import {AnimatePresence, motion} from "framer-motion";
import {EventDef} from "@fullcalendar/core/internal";
import PendingIcon from "@themes/overrides/icons/pendingIcon";
import useSWRMutation from "swr/mutation";
import {sendRequest} from "@lib/hooks/rest";
import {cashBoxSelector} from "@features/leftActionBar/components/cashbox";
import {LoadingButton} from "@mui/lab";
import {OnTransactionEdit} from "@lib/hooks/onTransactionEdit";
import {ActionMenu} from "@features/menu";
import {useSWRConfig} from "swr";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function WaitingRoom() {
    const {data: session, status} = useSession();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const isMounted = useIsMountedRef();
    const {enqueueSnackbar} = useSnackbar();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {mutate} = useSWRConfig();

    const {t, ready} = useTranslation(["waitingRoom", "common"], {keyPrefix: "config"});
    const {query: filter} = useAppSelector(leftActionBarSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {lock} = useAppSelector(appLockSelector);
    const {direction} = useAppSelector(configSelector);
    const {tableState} = useAppSelector(tableActionSelector);
    const {isActive, event} = useAppSelector(timerSelector);
    const {model} = useAppSelector(preConsultationSelector);
    const {selectedBoxes, paymentTypesList} = useAppSelector(cashBoxSelector);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const roles = (session?.data as UserDataResponse)?.general_information.roles as Array<string>;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const demo = localStorage.getItem('newCashbox') ? localStorage.getItem('newCashbox') === '1' : user.medical_entity.hasDemo;

    const [patientDetailDrawer, setPatientDetailDrawer] = useState<boolean>(false);
    const [isAddAppointment] = useState<boolean>(false);
    const [loading] = useState<boolean>(status === 'loading');
    const [error, setError] = useState<boolean>(false);
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const [row, setRow] = useState<WaitingRoomModel | null>(null);
    const [openPaymentDialog, setOpenPaymentDialog] = useState<boolean>(false);
    const [openPreConsultationDialog, setOpenPreConsultationDialog] = useState<boolean>(false);
    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [popoverActions, setPopoverActions] = useState([
        {
            title: "pre_consultation_data",
            icon: <PendingIcon/>,
            action: "onPreConsultation",
        },
        ...(!roles.includes('ROLE_SECRETARY') ? [{
            title: "start_the_consultation",
            icon: <PlayCircleIcon/>,
            action: "onConsultationStart",
        }] : []),
        {
            title: "leave_waiting_room",
            icon: <IconUrl color={"white"} path="ic-salle"/>,
            action: "onLeaveWaitingRoom",
        },
        {
            title: "see_patient_form",
            icon: <IconUrl color={"white"} width={"18"} height={"18"} path="ic-edit-file"/>,
            action: "onPatientDetail",
        }]);
    const [loadingRequest, setLoadingRequest] = useState<boolean>(false);

    const {trigger: updateTrigger} = useRequestMutation(null, "/agenda/update/appointment");
    const {trigger: updateAppointmentStatus} = useSWRMutation(["/agenda/update/appointment/status", {Authorization: `Bearer ${session?.accessToken}`}], sendRequest as any);
    const {trigger: handlePreConsultationData} = useSWRMutation(["/pre-consultation/update", {Authorization: `Bearer ${session?.accessToken}`}], sendRequest as any);
    const {trigger: triggerPostTransaction} = useRequestMutation(null, "/payment/cashbox");

    const {data: httpAgendasResponse} = useRequest(medicalEntityHasUser ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/agendas/${router.locale}`
    } : null, SWRNoValidateConfig);

    const {data: httpWaitingRoomsResponse, mutate: mutateWaitingRoom} = useRequest({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/waiting-rooms/${router.locale}${filter?.type ? '?type=' + filter?.type : ''}`
    });

    const agenda = (httpAgendasResponse as HttpResponse)?.data.find((item: AgendaConfigurationModel) => item.isDefault) as AgendaConfigurationModel;
    const handleContextMenu = (event: MouseEvent) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                } : null,
        );
    };

    const mutateOnGoing = () => {
        setTimeout(() => mutate(`${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/ongoing/appointments/${router.locale}`));
    }

    const handleClose = () => {
        setContextMenu(null);
    };

    const handleSubmit = () => {
        setLoadingRequest(true)
        OnTransactionEdit(selectedPayment,
            selectedBoxes,
            router.locale,
            row?.transactions && row?.transactions?.length > 0 ? row?.transactions[0] : null,
            triggerPostTransaction,
            urlMedicalEntitySuffix,
            () => {
                mutateWaitingRoom().then(() => {
                    enqueueSnackbar(t("addsuccess"), {variant: 'success'});
                    setOpenPaymentDialog(false);
                    setLoadingRequest(false);
                })
            }
        );
    }

    const resetDialog = () => {
        setOpenPaymentDialog(false);
        const actions = [...popoverActions];
        // actions.splice(popoverActions.findIndex(data => data.action === "onPay"), 1);
        setPopoverActions(actions);
    };
    const nextConsultation = (row: any) => {
        const form = new FormData();
        form.append('attribute', 'is_next');
        form.append('value', `${!Boolean(row.is_next)}`);
        updateTrigger({
            method: "PATCH",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${row.uuid}/${router.locale}`,
            data: form
        }).then(() => {
            mutateWaitingRoom();
            // refresh on going api
            mutateOnGoing();
            setLoadingRequest(false);
        });
    }
    const startConsultation = (row: any) => {
        if (!isActive) {
            const event: any = {
                publicId: (row?.uuid ? row.uuid : row?.publicId ? row?.publicId : (row as any)?.id) as string,
                extendedProps: {
                    ...(row?.extendedProps && {...row?.extendedProps}),
                    ...(row?.patient && {patient: row?.patient})
                }
            };
            const slugConsultation = `/dashboard/consultation/${event.publicId}`;
            router.push(slugConsultation, slugConsultation, {locale: router.locale}).then(() => {
                updateAppointmentStatus({
                    method: "PATCH",
                    data: {
                        status: "4",
                        start_date: moment().format("DD-MM-YYYY"),
                        start_time: moment().format("HH:mm")
                    },
                    url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${event.publicId}/status/${router.locale}`
                } as any).then(() => {
                    dispatch(setTimer({
                            isActive: true,
                            isPaused: false,
                            event,
                            startTime: moment().utc().format("HH:mm")
                        }
                    ));
                    // refresh on going api
                    mutateOnGoing();
                });
            });
        } else {
            setError(true);
            setLoadingRequest(false);
        }
    }
    const OnMenuActions = (action: string) => {
        switch (action) {
            case "onConsultationStart":
                startConsultation(row);
                break;
            case "onPreConsultation":
                setOpenPreConsultationDialog(true);
                break;
            case "onNextConsultation":
                nextConsultation(row);
                break;
            case "onLeaveWaitingRoom":
                updateAppointmentStatus({
                    method: "PATCH",
                    data: {status: "1"},
                    url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${row?.uuid}/status/${router.locale}`
                } as any).then(() => {
                    // refresh on going api
                    mutateOnGoing();
                    mutateWaitingRoom();
                });
                break;
            case "onPatientDetail":
                dispatch(onOpenPatientDrawer({patientId: row?.patient.uuid}));
                setPatientDetailDrawer(true);
                break;
            case "onPay":
                let payed_amount = 0;//row?.appointment_type.price ? row?.appointment_type.price - row?.rest_amount : 0;
                let payments: any[] = [];
                row?.transactions && row.transactions.map(transaction => {
                    payed_amount += transaction.amount - transaction.rest_amount;
                    transaction.transaction_data.map((td: any) => {
                        let pay: any = {
                            uuid: td.uuid,
                            amount: td.amount,
                            payment_date: moment().format('DD-MM-YYYY HH:mm'),
                            status_transaction: td.status_transaction_data,
                            type_transaction: td.type_transaction_data,
                            data: td.data,
                            ...(td.insurance && {insurance: td.insurance.uuid}),
                            ...(td.payment_means && {
                                payment_means: paymentTypesList.find((pt: {
                                    slug: string;
                                }) => pt.slug === td.payment_means.slug)
                            })
                        }
                        payments.push(pay)
                    })
                });

                setSelectedPayment({
                    uuid: row?.uuid,
                    payments,
                    payed_amount,
                    appointment: row,
                    patient: row?.patient,
                    total: row?.appointment_type.price,
                    isNew: payed_amount === 0
                });
                setOpenPaymentDialog(true);
                break;
        }
        handleClose();
    }
    const handleTableActions = (data: any) => {
        setRow(data.row);
        switch (data.action) {
            case "PATIENT_DETAILS":
                dispatch(onOpenPatientDrawer({patientId: data.row.patient.uuid}));
                setPatientDetailDrawer(true);
                break;
            case "START_CONSULTATION":
                startConsultation(data.row);
                break;
            case "NEXT_CONSULTATION":
                nextConsultation(data.row);
                break;
            default:
                if (data.row.rest_amount >= 0 && demo && !popoverActions.find(data => data.action === "onPay")) {
                    setPopoverActions([{
                        title: "consultation_pay",
                        icon: <IconUrl color={"white"} path="ic-fees"/>,
                        action: "onPay",
                    }, ...popoverActions])
                } else {
                    setPopoverActions([...popoverActions]);
                }
                handleContextMenu(data.event);
                break;
        }
    }

    const submitPreConsultationData = () => {
        handlePreConsultationData({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${row?.uuid}/data/${router.locale}`,
            data: {
                "modal_uuid": model,
                "modal_data": localStorage.getItem(`Modeldata${row?.uuid}`) as string
            }
        } as any).then(() => {
            localStorage.removeItem(`Modeldata${row?.uuid}`);
            setOpenPreConsultationDialog(false);
        });
    }

    const waitingRooms = (httpWaitingRoomsResponse as HttpResponse)?.data as any;

    useEffect(() => {
        if (isMounted.current && !lock) {
            dispatch(toggleSideBar(false));
        }
    }, [dispatch, isMounted]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (waitingRooms) {
            dispatch(setOngoing({waiting_room: waitingRooms.length}))
        }
    }, [dispatch, waitingRooms]);

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <>
            <SubHeader
                sx={{
                    "& .MuiToolbar-root": {
                        display: "block"
                    }
                }}>
                <RoomToolbar/>

                {error &&
                    <AnimatePresence>
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{ease: "easeIn", duration: 1}}
                        >
                            <Alert variant="filled"
                                   onClick={() => {
                                       const slugConsultation = `/dashboard/consultation/${event?.publicId ? event?.publicId : (event as any)?.id}`;
                                       if (router.asPath !== slugConsultation) {
                                           router.replace(slugConsultation, slugConsultation, {locale: router.locale});
                                       }
                                   }}
                                   onClose={(event) => {
                                       event.stopPropagation();
                                       setError(false);
                                   }}
                                   sx={{marginBottom: 2, marginTop: 1, border: "none", cursor: "pointer"}}
                                   severity="error">
                                {t("in-consultation-error", {ns: "common"})}
                            </Alert>
                        </motion.div>
                    </AnimatePresence>}
            </SubHeader>
            <Box>
                <LinearProgress sx={{
                    visibility: !httpWaitingRoomsResponse || loading ? "visible" : "hidden"
                }} color="warning"/>
                <DesktopContainer>
                    <Box className="container">
                        <Box display={{xs: "none", md: "block"}} mt={1}>
                            {waitingRooms &&
                                <>
                                    {waitingRooms.length > 0 ? <Otable
                                            {...{
                                                doctor_country,
                                                roles,
                                                loading: loadingRequest,
                                                setLoading: setLoadingRequest
                                            }}
                                            headers={WaitingHeadCells}
                                            rows={waitingRooms}
                                            from={"waitingRoom"}
                                            t={t}
                                            pagination
                                            handleEvent={handleTableActions}
                                        />
                                        :
                                        <NoDataCard
                                            t={t}
                                            onHandleClick={() => {
                                                router.push('/dashboard/agenda').then(() => {
                                                    enqueueSnackbar(t("add-to-waiting-room"), {variant: 'info'})
                                                });
                                            }}
                                            ns={"waitingRoom"}
                                            data={AddWaitingRoomCardData}/>
                                    }

                                    <ActionMenu {...{contextMenu, handleClose}}>
                                        {popoverActions.map(
                                            (v: any, index) => (
                                                <MenuItem
                                                    key={index}
                                                    className="popover-item"
                                                    onClick={() => {
                                                        OnMenuActions(v.action);
                                                    }}>
                                                    {v.icon}
                                                    <Typography fontSize={15} sx={{color: "#fff"}}>
                                                        {t(`${v.title}`)}
                                                    </Typography>
                                                </MenuItem>
                                            )
                                        )}
                                    </ActionMenu>
                                </>
                            }
                        </Box>
                    </Box>
                </DesktopContainer>
                <MobileContainer>
                    <DetailsCard
                        {...{t}}
                        waitingRoom
                        handleEvent={handleTableActions}
                        rows={waitingRooms}/>
                </MobileContainer>
            </Box>

            <Drawer
                anchor={"right"}
                open={patientDetailDrawer}
                dir={direction}
                onClose={() => {
                    dispatch(onOpenPatientDrawer({patientId: ""}));
                    setPatientDetailDrawer(false);
                }}
            >
                <PatientDetail
                    {...{isAddAppointment, patientId: tableState.patientId}}
                    onCloseDialog={() => {
                        dispatch(onOpenPatientDrawer({patientId: ""}));
                        setPatientDetailDrawer(false);
                    }}
                    onConsultationStart={(event: EventDef) => startConsultation(event)}
                    onAddAppointment={() => console.log("onAddAppointment")}/>
            </Drawer>

            <Dialog
                action={"payment_dialog"}
                {...{
                    direction,
                    sx: {
                        minHeight: 380
                    }
                }}
                open={openPaymentDialog}
                data={{
                    selectedPayment, setSelectedPayment,
                    appointment: row,
                    patient: row?.patient
                }}
                size={"lg"}
                fullWidth
                title={t("payment_dialog_title")}
                dialogClose={resetDialog}
                actionDialog={
                    <DialogActions>
                        <Button onClick={resetDialog} startIcon={<CloseIcon/>}>
                            {t("cancel", {ns: "common"})}
                        </Button>
                        <LoadingButton
                            disabled={selectedPayment && selectedPayment.payments.length === 0}
                            variant="contained"
                            onClick={handleSubmit}
                            loading={loadingRequest}
                            startIcon={<IconUrl path="ic-dowlaodfile"/>}>
                            {t("save", {ns: "common"})}
                        </LoadingButton>
                    </DialogActions>
                }
            />

            <Dialog
                action={"pre_consultation_data"}
                {...{
                    direction,
                    sx: {
                        minHeight: 380
                    }
                }}
                open={openPreConsultationDialog}
                data={{
                    patient: row?.patient,
                    uuid: row?.uuid
                }}
                size={"md"}
                title={t("pre_consultation_dialog_title")}
                {...(!loadingRequest && {dialogClose: () => setOpenPreConsultationDialog(false)})}
                actionDialog={
                    <DialogActions>
                        <Button onClick={() => setOpenPreConsultationDialog(false)} startIcon={<CloseIcon/>}>
                            {t("cancel", {ns: "common"})}
                        </Button>
                        <Button
                            disabled={loadingRequest}
                            variant="contained"
                            onClick={() => submitPreConsultationData()}
                            startIcon={<IconUrl path="ic-dowlaodfile"/>}>
                            {t("save", {ns: "common"})}
                        </Button>
                    </DialogActions>
                }
            />
        </>
    );
}

export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, [
            "menu",
            "common",
            "patient",
            "consultation",
            "payment",
            "waitingRoom",
        ])),
    },
});

export default WaitingRoom;

WaitingRoom.auth = true

WaitingRoom.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
