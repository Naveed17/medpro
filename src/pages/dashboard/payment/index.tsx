import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useCallback, useEffect, useState} from "react";
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Drawer,
    LinearProgress,
    List,
    ListItem,
    Stack,
    TextField,
    Theme,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import {SubHeader} from "@features/subHeader";
import {configSelector, DashLayout, dashLayoutSelector} from "@features/base";
import {
    onOpenPatientDrawer,
    Otable,
    tableActionSelector,
} from "@features/table";
import {useTranslation} from "next-i18next";
import {Dialog, PatientDetail} from "@features/dialog";
import IconUrl from "@themes/urlIcon";
import CloseIcon from "@mui/icons-material/Close";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {NoDataCard, PaymentMobileCard, setTimer} from "@features/card";
import {DesktopContainer} from "@themes/desktopConainter";
import {MobileContainer} from "@themes/mobileContainer";
import MuiDialog from "@mui/material/Dialog";
import {agendaSelector, openDrawer, setCurrentDate} from "@features/calendar";
import moment from "moment-timezone";
import {useRequestMutation} from "@lib/axios";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {toggleSideBar} from "@features/menu";
import {appLockSelector} from "@features/appLock";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import {Label} from "@features/label";
import {cashBoxSelector} from "@features/leftActionBar";
import {DefaultCountry} from "@lib/constants";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
    setInsurances,
    setPaymentTypes,
} from "@features/leftActionBar/components/payment/actions";
import {EventDef} from "@fullcalendar/core/internal";
import {PaymentFilter, leftActionBarSelector} from "@features/leftActionBar";
import {DrawerBottom} from "@features/drawerBottom";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {sendRequest, useInsurances} from "@lib/hooks/rest";
import useSWRMutation from "swr/mutation";

interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
    sortable: boolean;
    align: "left" | "right" | "center";
}

const headCheques: readonly HeadCell[] = [
    {
        id: "no",
        numeric: false,
        disablePadding: true,
        label: "-",
        sortable: false,
        align: "center",
    },
    {
        id: "nb-cheque",
        numeric: false,
        disablePadding: true,
        label: "numcheque",
        sortable: true,
        align: "left",
    },
    {
        id: "date",
        numeric: true,
        disablePadding: true,
        label: "date",
        sortable: true,
        align: "center",
    },
    {
        id: "amount",
        numeric: true,
        disablePadding: true,
        label: "amount",
        sortable: true,
        align: "right",
    },
];
const headCells: readonly HeadCell[] = [
    {
        id: "date",
        numeric: false,
        disablePadding: true,
        label: "date",
        sortable: true,
        align: "left",
    },
    {
        id: "time",
        numeric: true,
        disablePadding: false,
        label: "time",
        sortable: true,
        align: "left",
    },
    {
        id: "name",
        numeric: true,
        disablePadding: false,
        label: "name",
        sortable: true,
        align: "left",
    },
    {
        id: "insurance",
        numeric: true,
        disablePadding: false,
        label: "insurance",
        sortable: true,
        align: "left",
    },
    {
        id: "type",
        numeric: true,
        disablePadding: false,
        label: "type",
        sortable: true,
        align: "center",
    },
    {
        id: "payment_type",
        numeric: true,
        disablePadding: false,
        label: "payment_type",
        sortable: true,
        align: "center",
    },
    /*{
            id: "billing_status",
            numeric: true,
            disablePadding: false,
            label: "billing_status",
            sortable: true,
            align: "center",
        },*/
    {
        id: "amount",
        numeric: true,
        disablePadding: false,
        label: "amount",
        sortable: true,
        align: "center",
    },
];

function Payment() {
    const {data: session} = useSession();
    const theme = useTheme() as Theme;
    const router = useRouter();
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {insurances} = useInsurances();

    const {tableState} = useAppSelector(tableActionSelector);
    const {t} = useTranslation(["payment", "common"]);
    const {currentDate} = useAppSelector(agendaSelector);
    const {config: agenda} = useAppSelector(agendaSelector);
    const {mutate: mutateOnGoing, medicalProfessionalData} = useAppSelector(dashLayoutSelector);
    const {query: filterData} = useAppSelector(leftActionBarSelector);
    const {lock} = useAppSelector(appLockSelector);
    const {direction} = useAppSelector(configSelector);
    const {selectedBox, paymentTypes} = useAppSelector(cashBoxSelector);

    const noCardData = {
        mainIcon: "ic-payment",
        title: "no-data.title",
        description: "no-data.description",
    };

    const [patientDetailDrawer, setPatientDetailDrawer] = useState<boolean>(false);
    const [isAddAppointment] = useState<boolean>(false);
    const [openPaymentDialog, setOpenPaymentDialog] = useState<boolean>(false);
    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [deals, setDeals] = React.useState<any>({
        cash: {
            amount: "",
        },
        card: {
            amount: "",
        },
        check: [
            {
                amount: "",
                carrier: "",
                bank: "",
                check_number: "",
                payment_date: new Date(),
                expiry_date: new Date(),
            },
        ],
        selected: "",
    });
    const [collapse, setCollapse] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [collapseDate] = useState<any>(null);
    const [day, setDay] = useState(moment().format("DD-MM-YYYY"));
    const [filtredRows, setFiltredRows] = useState<any[]>([]);
    const [cheques] = useState<ChequeModel[]>([
        {uuid: "x", numero: "111111111", date: "23/21/2022", amount: 200},
        {uuid: "x", numero: "111111111", date: "23/21/2022", amount: 200},
    ]);
    const [total, setTotal] = useState(0);
    let [select] = useState<any[]>([]);
    const [filter, setFilter] = useState(false);
    let [collect, setCollect] = useState<any[]>([]);
    let [collected, setCollected] = useState(0);
    const [toReceive] = useState(0);
    const [somme, setSomme] = useState(0);
    const [freeTrans, setFreeTrans] = useState(0);
    const [action, setAction] = useState("");
    const [popoverActions, setPopoverActions] = useState([
        {
            title: "start_the_consultation",
            icon: <PlayCircleIcon/>,
            action: "onConsultationStart",
        },
        {
            title: "leave_waiting_room",
            icon: <IconUrl color={"white"} path="ic-salle"/>,
            action: "onLeaveWaitingRoom",
        },
        {
            title: "see_patient_form",
            icon: (
                <IconUrl color={"white"} width={"18"} height={"18"} path="ic-edit-file"/>
            ),
            action: "onPatientDetail",
        },
    ]);

    const newVersion = process.env.NODE_ENV === "development";
    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;

    const {trigger: updateAppointmentStatus} = useSWRMutation(["/agenda/update/appointment/status", {Authorization: `Bearer ${session?.accessToken}`}], sendRequest as any);
    const {trigger} = useRequestMutation(null, "/payment/cashbox");

    const handleCollapse = () => {
        //setCollapseData(props);
        setCollapse(true);
    };

    const handleCloseCollapse = () => setCollapse(false);

    const handleCheques = (props: ChequeModel) => {
        if (collect.indexOf(props) != -1) {
            collect.splice(collect.indexOf(props), 1);
        } else {
            collect.push(props);
        }
        setCollect([...collect]);
        let res = 0;
        collect.map((val) => (res += val.amount));
        setCollected(res + freeTrans);
    };

    const handleSubmit = () => {
        const trans_data: TransactionDataModel[] = [];
        selectedPayment.payments.map((sp: any) => {
            console.log(sp);
            trans_data.push({
                payment_means: sp.payment_type[0].uuid,
                //insurance: "value",
                amount: sp.amount,
                status_transaction: "1",
                type_transaction: action === "btn_header_2" ? "IN" : "OUT",
                payment_date: sp.date,
                data: {label: sp.designation},
            });
        });
        const form = new FormData();
        form.append("type_transaction", action === "btn_header_2" ? "IN" : "OUT");
        form.append("status_transaction", "1");
        form.append("amount", "100");
        form.append("rest_amount", "0");
        form.append("transaction_data", JSON.stringify(trans_data));

        trigger({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/cash-boxes/${selectedBox?.uuid}/transactions/${router.locale}`,
            data: form,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
        });
        setOpenPaymentDialog(false);
    };

    const resetDialog = () => {
        setOpenPaymentDialog(false);
        const actions = [...popoverActions];
        actions.splice(
            popoverActions.findIndex((data) => data.action === "onPay"),
            1
        );
        setPopoverActions(actions);
    };

    const openPop = (ev: string) => {
        setAction(ev);
        setSelectedPayment({
            uuid: "row?.uuid",
            date: moment().format("DD-MM-YYYY"),
            time: "row?.appointment_time",
            patient: null,
            insurance: "",
            type: "row?.appointment_type.name",
            amount: 0,
            total: 0,
            payments: [],
        });
        setOpenPaymentDialog(true);
    };

    const handleTableActions = (data: any) => {
        switch (data.action) {
            case "PATIENT_DETAILS":
                dispatch(onOpenPatientDrawer({patientId: data.row.patient.uuid}));
                setPatientDetailDrawer(true);
                break;
        }
    };

    const onConsultationStart = (event: EventDef) => {
        const slugConsultation = `/dashboard/consultation/${
            event?.publicId ? event?.publicId : (event as any)?.id
        }`;
        router
            .push(slugConsultation, slugConsultation, {locale: router.locale})
            .then(() => {
                updateAppointmentStatus({
                    method: "PATCH",
                    data: {
                        status: "4",
                        start_date: moment().format("DD-MM-YYYY"),
                        start_time: moment().format("HH:mm")
                    },
                    url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${event?.publicId ? event?.publicId : (event as any)?.id}/status/${router.locale}`
                } as any).then(() => {
                    dispatch(openDrawer({type: "view", open: false}));
                    dispatch(
                        setTimer({
                            isActive: true,
                            isPaused: false,
                            event,
                            startTime: moment().utc().format("HH:mm"),
                        })
                    );
                    // refresh on going api
                    mutateOnGoing && mutateOnGoing();
                });
            });
    };

    const getAppointments = useCallback(
        (query: string, filterQuery: any) => {
            setLoading(true);
            if (query.includes("format=list")) {
                dispatch(setCurrentDate({date: moment().toDate(), fallback: false}));
            }
            trigger({
                method: "GET",
                url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${router.locale}?${query}`,
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            }).then((result) => {
                let amout = 0;
                const r: any[] = [];
                const appointments = result?.data as HttpResponse;
                const filteredStatus = appointments?.data.filter((app: {
                    status: number;
                    dayDate: string
                }) => app.status === 5);
                const filteredData = filterQuery.day ? filteredStatus?.filter(
                    (app: { status: number; dayDate: string }) => app.dayDate === filterQuery.day) : filteredStatus;

                filteredData?.map((app: any) => {
                    amout += Number(app.fees);
                    r.push({
                        uuid: app.uuid,
                        date: app.dayDate,
                        time: app.startTime,
                        name: `${app.patient.firstName} ${app.patient.lastName}`,
                        insurance: app.patient.insurances,
                        patient: app.patient,
                        type: app.type.name,
                        payment_type: ["ic-argent", "ic-card-pen"],
                        billing_status: "yes",
                        amount: app.fees,
                        /*collapse: [
                                                {
                                                    uuid: 61,
                                                    date: "10/10/2022",
                                                    time: "15:30",
                                                    payment_type: [
                                                        {
                                                            name: "123456789",
                                                            icon: "ic-card-pen",
                                                        },
                                                    ],
                                                    billing_status: "yes",
                                                    amount: 10,
                                                },
                                                {
                                                    uuid: 62,
                                                    date: "10/10/2022",
                                                    time: "15:30",
                                                    payment_type: [
                                                        {
                                                            name: "credit_card",
                                                            icon: "ic-argent",
                                                        },
                                                    ],
                                                    billing_status: "yes",
                                                    amount: 10,
                                                },
                                            ],*/
                    });
                });
                setFiltredRows(
                    filterQuery?.payment && filterQuery?.payment?.insurance
                        ? [...r].filter((row) => {
                            const updatedData = filterQuery.payment?.insurance?.filter(
                                (insur: any) =>
                                    row.patient.insurances
                                        ?.map((insurance: any) => insurance.uuid)
                                        .includes(insur)
                            );
                            return (
                                row.patient.insurances.length > 0 &&
                                updatedData &&
                                updatedData.length > 0
                            );
                        })
                        : [...r]
                );
                //setTotal(amout);
                setLoading(false);
            });
        },
        [agenda, medical_entity.uuid, router, session, trigger, dispatch] // eslint-disable-line react-hooks/exhaustive-deps
    );

    const getFilteredData = (day: string) => {
        const filterByRange = filterData?.payment && filterData?.payment?.dates;
        const startDate = filterByRange
            ? moment(filterData?.payment?.dates[0].startDate).format("DD-MM-YYYY")
            : day;
        const endDate = filterByRange
            ? moment(filterData?.payment?.dates[0].endDate).format("DD-MM-YYYY")
            : moment(day, "DD-MM-YYYY").add(1, "day").format("DD-MM-YYYY");
        const queryPath = `format=week&start_date=${startDate}&end_date=${endDate}`;
        agenda &&
        getAppointments(queryPath, {
            ...filterData,
            ...(!filterByRange && {day}),
        });
    };

    useEffect(() => {
        if (!lock) {
            dispatch(toggleSideBar(false));
        }
    });

    useEffect(() => {
        if (medicalProfessionalData) {
            dispatch(setInsurances(medicalProfessionalData[0].insurances));
            dispatch(setPaymentTypes(medicalProfessionalData[0].payments));

            if (medicalProfessionalData[0].payments.length > 0) {
                deals.selected = medicalProfessionalData[0].payments[0].slug;
                setDeals({...deals});
            }
        }
    }, [medicalProfessionalData]); // eslint-disable-line react-hooks/exhaustive-deps

    /*    useEffect(() => {
              if (selectedBox) {
                  setTotal(selectedBox.total);
                  setToReceive(selectedBox.total_insurance);
                  const filterQuery = generateFilter();

                  trigger({
                      method: "GET",
                      url: `${urlMedicalEntitySuffix}/cash-boxes/${selectedBox.uuid}/transactions/${router.locale}${filterQuery}`,
                      headers: {
                          Authorization: `Bearer ${session?.accessToken}`,
                      },
                  }).then((r: any) => {
                      // console.log(r.data.data);
                  });
              }
          }, [day, selectedBox]); // eslint-disable-line react-hooks/exhaustive-deps*/

    useEffect(() => {
        const updatedDate = moment(currentDate.date).format("DD-MM-YYYY");
        setDay(updatedDate);
        getFilteredData(updatedDate);
    }, [currentDate]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        agenda && getFilteredData(day);
    }, [getAppointments, agenda, filterData]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        let total = 0;
        filtredRows.map((row) => (total += parseFloat(row.amount)));
        setTotal(total);
    }, [filtredRows]);

    return (
        <>
            <SubHeader>
                <Stack
                    direction={{xs: "column", md: "row"}}
                    width={1}
                    justifyContent="space-between"
                    py={1}
                    alignItems={{xs: "flex-start", md: "center"}}>
                    <Typography>
                        <b>Le {moment(day, "DD-MM-YYYY").format("DD MMMM YYYY")}</b>
                    </Typography>
                    <Stack
                        direction={{xs: "column", md: "row"}}
                        spacing={{xs: 1, md: 3}}
                        alignItems={{xs: "flex-start", md: "center"}}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            {newVersion && (
                                <>
                                    <Typography variant="subtitle2">{t("receive")}</Typography>
                                    <Typography variant="h6">
                                        {toReceive} {devise}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        display={{xs: "none", md: "block"}}>
                                        I
                                    </Typography>
                                </>
                            )}

                            <Typography variant="subtitle2">{t("total")}</Typography>
                            <Typography variant="h6">
                                {total} {devise}
                            </Typography>
                        </Stack>
                        {newVersion && (
                            <Stack direction="row" spacing={1} alignItems="center">
                                {!isMobile && <Typography variant="h6">I</Typography>}

                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => {
                                        openPop("btn_header_1");
                                    }}
                                    {...(isMobile && {
                                        size: "small",
                                        sx: {minWidth: 40},
                                    })}>
                                    - {!isMobile && t("btn_header_1")}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="success"
                                    {...(isMobile && {
                                        size: "small",
                                        sx: {minWidth: 40},
                                    })}
                                    onClick={() => {
                                        openPop("btn_header_2");
                                    }}>
                                    + {!isMobile && t("btn_header_2")}
                                </Button>
                                <Typography variant="h6" display={{xs: "none", md: "block"}}>
                                    I
                                </Typography>
                                <Button
                                    variant="contained"
                                    {...(isMobile && {
                                        size: "small",
                                        sx: {minWidth: 40},
                                    })}
                                    onClick={() => {
                                        handleCollapse();
                                    }}>
                                    <KeyboardArrowDownIcon/> {!isMobile && t("Encaisser")}
                                </Button>
                            </Stack>
                        )}
                    </Stack>
                </Stack>
            </SubHeader>

            <LinearProgress
                sx={{visibility: loading ? "visible" : "hidden"}}
                color="warning"
            />

            <Box className="container">
                {filtredRows.length > 0 ? (
                    <React.Fragment>
                        <DesktopContainer>
                            <Otable
                                {...{rows: filtredRows, select, t, insurances}}
                                headers={headCells}
                                from={"payment"}
                                handleEvent={handleTableActions}
                            />
                        </DesktopContainer>
                        <MobileContainer>
                            <Stack spacing={2}>
                                {filtredRows.map((card, idx) => (
                                    <React.Fragment key={idx}>
                                        <PaymentMobileCard
                                            data={card}
                                            t={t}
                                            insurances={insurances}
                                            handleEvent={handleTableActions}
                                        />
                                    </React.Fragment>
                                ))}
                            </Stack>
                            <Box pb={6}/>
                        </MobileContainer>
                    </React.Fragment>
                ) : (
                    <Box
                        style={{
                            height: "75vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                        <NoDataCard t={t} ns={"payment"} data={noCardData}/>
                    </Box>
                )}
            </Box>

            <Drawer
                anchor={"right"}
                open={patientDetailDrawer}
                dir={direction}
                onClose={() => {
                    dispatch(onOpenPatientDrawer({patientId: ""}));
                    setPatientDetailDrawer(false);
                }}>
                <PatientDetail
                    {...{isAddAppointment, patientId: tableState.patientId}}
                    onCloseDialog={() => {
                        dispatch(onOpenPatientDrawer({patientId: ""}));
                        setPatientDetailDrawer(false);
                    }}
                    onConsultationStart={onConsultationStart}
                    onAddAppointment={() => console.log("onAddAppointment")}
                />
            </Drawer>

            <Dialog
                action={"payment_dialog"}
                {...{
                    direction,
                    sx: {
                        minHeight: 380,
                    },
                }}
                open={openPaymentDialog}
                data={{
                    selectedPayment,
                    setSelectedPayment,
                    deals,
                    setDeals,
                    paymentTypes,
                    patient: null,
                }}
                size={"md"}
                title={t(action)}
                dialogClose={resetDialog}
                actionDialog={
                    <DialogActions>
                        <Button onClick={resetDialog} startIcon={<CloseIcon/>}>
                            {t("config.cancel", {ns: "common"})}
                        </Button>
                        <Button
                            disabled={
                                selectedPayment && selectedPayment.payments.length === 0
                            }
                            variant="contained"
                            onClick={handleSubmit}
                            startIcon={<IconUrl path="ic-dowlaodfile"/>}>
                            {t("config.save", {ns: "common"})}
                        </Button>
                    </DialogActions>
                }
            />

            <MuiDialog
                PaperProps={{
                    style: {
                        margin: 4,
                        width: "100%",
                        paddingBottom: 16,
                    },
                }}
                onClose={handleCloseCollapse}
                open={collapse}>
                <DialogTitle
                    sx={{
                        bgcolor: (theme) => theme.palette.primary.main,
                        position: "relative",
                    }}>
                    {t("Encaisser")}
                    <Button
                        size="small"
                        variant="contained"
                        sx={{
                            position: "absolute",
                            right: 15,
                            top: 15,
                        }}
                        color="warning"
                        {...(isMobile && {
                            fullWidth: true,
                        })}>
                        {t("total")}
                        <Typography fontWeight={700} component="strong" mx={1}>
                            {collected}
                        </Typography>
                        {devise}
                    </Button>
                </DialogTitle>
                <DialogContent dividers={true}>
                    <Stack
                        direction={"row"}
                        spacing={3}
                        alignItems={"center"}
                        padding={2}>
                        <Typography variant={"body1"}>{t("somme")}</Typography>
                        <TextField
                            type="number"
                            fullWidth
                            style={{width: "150px", textAlign: "center"}}
                            value={somme}
                            onChange={(ev) => {
                                setSomme(Number(ev.target.value));
                                let updatedCollected = collected - freeTrans;
                                updatedCollected = updatedCollected + Number(ev.target.value);
                                setCollected(updatedCollected);
                                setFreeTrans(Number(ev.target.value));
                            }}
                            InputProps={{
                                style: {
                                    width: "150px",
                                    textAlign: "center",
                                },
                            }}
                            placeholder={t("---")}
                        />
                        <Typography variant={"body1"} color={theme.palette.grey[700]}>
                            {devise}
                        </Typography>
                    </Stack>
                    <Box className="container">
                        <DesktopContainer>
                            <Otable
                                headers={headCheques}
                                rows={cheques}
                                from={"chequesList"}
                                t={t}
                                select={collect}
                                edit={handleCheques}
                            />
                        </DesktopContainer>
                    </Box>
                    <List sx={{pt: 3}}>
                        {collapseDate?.map((col: any, idx: number) => (
                            <ListItem
                                key={idx}
                                sx={{
                                    "&:not(:last-child)": {
                                        borderBottom: `1px solid ${theme.palette.divider}`,
                                    },
                                }}>
                                <Stack
                                    sx={{
                                        ".react-svg svg": {
                                            width: (theme) => theme.spacing(1.5),
                                            path: {
                                                fill: (theme) => theme.palette.text.primary,
                                            },
                                        },
                                    }}
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    width={1}>
                                    <Stack spacing={0.5} direction="row" alignItems="center">
                                        <IconUrl path="ic-agenda-jour"/>
                                        <Typography fontWeight={600}>{col.date}</Typography>
                                    </Stack>
                                    <Stack spacing={0.5} direction="row" alignItems="center">
                                        <IconUrl path="setting/ic-time"/>
                                        <Typography fontWeight={600} className="date">
                                            {col.time}
                                        </Typography>
                                    </Stack>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="flex-start"
                                        spacing={1}>
                                        {col.payment_type?.map((type: any, i: number) => (
                                            <Stack
                                                key={i}
                                                direction="row"
                                                alignItems="center"
                                                spacing={1}>
                                                <IconUrl path={type.icon}/>
                                                <Typography color="text.primary" variant="body2">
                                                    {t("table." + type.name)}
                                                </Typography>
                                            </Stack>
                                        ))}
                                    </Stack>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="flex-start"
                                        spacing={2}>
                                        {col.billing_status ? (
                                            <Label
                                                className="label"
                                                variant="ghost"
                                                color={
                                                    col.billing_status === "yes" ? "success" : "error"
                                                }>
                                                {t("table." + col.billing_status)}
                                            </Label>
                                        ) : (
                                            <Typography>--</Typography>
                                        )}
                                        <Typography
                                            color={
                                                (col.amount > 0 && "success.main") ||
                                                (col.amount < 0 && "error.main") ||
                                                "text.primary"
                                            }
                                            fontWeight={700}>
                                            {col.amount}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions style={{paddingBottom: 0}}>
                    <Button
                        onClick={() => {
                            setCollapse(false);
                        }}
                        startIcon={<CloseIcon/>}>
                        {t("config.cancel", {ns: "common"})}
                    </Button>
                    <Button
                        disabled={selectedPayment && selectedPayment.payments.length === 0}
                        variant="contained"
                        onClick={handleSubmit}
                        startIcon={<IconUrl path="ic-dowlaodfile"/>}>
                        {t("config.save", {ns: "common"})}
                    </Button>
                </DialogActions>
            </MuiDialog>
            <Button
                startIcon={<IconUrl path="ic-filter"/>}
                variant="filter"
                onClick={() => setFilter(true)}
                sx={{
                    position: "fixed",
                    bottom: 50,
                    transform: "translateX(-50%)",
                    left: "50%",
                    zIndex: 999,
                    display: {xs: "flex", md: "none"},
                }}>
                Filtrer (0)
            </Button>
            <DrawerBottom
                handleClose={() => setFilter(false)}
                open={filter}
                title="Filter">
                <PaymentFilter/>
            </DrawerBottom>
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => {
    return {
        props: {
            fallback: false,
            ...(await serverSideTranslations(context.locale as string, [
                "common",
                "menu",
                "consultation",
                "patient",
                "payment",
            ])),
        },
    };
};

Payment.auth = true;

Payment.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};

export default Payment;
