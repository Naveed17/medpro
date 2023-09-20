import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useCallback, useEffect, useState} from "react";
import {
    Box,
    Button,
    Card,
    Checkbox, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle,
    Drawer,
    FormControlLabel,
    LinearProgress,
    Stack,
    Typography,
} from "@mui/material";
import {SubHeader} from "@features/subHeader";
import {configSelector, DashLayout, setOngoing} from "@features/base";
import {onOpenPatientDrawer, Otable, tableActionSelector,} from "@features/table";
import {useTranslation} from "next-i18next";
import {PatientDetail} from "@features/dialog";
import IconUrl from "@themes/urlIcon";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {NoDataCard, PaymentMobileCard, setTimer} from "@features/card";
import {DesktopContainer} from "@themes/desktopConainter";
import {MobileContainer} from "@themes/mobileContainer";
import {agendaSelector, openDrawer, setCurrentDate} from "@features/calendar";
import moment from "moment-timezone";
import {useRequestQueryMutation} from "@lib/axios";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {toggleSideBar} from "@features/menu";
import {appLockSelector} from "@features/appLock";
import {leftActionBarSelector, PaymentFilter} from "@features/leftActionBar";
import {DefaultCountry} from "@lib/constants";
import {EventDef} from "@fullcalendar/core/internal";
import {DrawerBottom} from "@features/drawerBottom";
import {useMedicalEntitySuffix, useMutateOnGoing} from "@lib/hooks";
import {useInsurances} from "@lib/hooks/rest";

interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
    sortable: boolean;
    align: "left" | "right" | "center";
}

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
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {insurances} = useInsurances();
    const {trigger: mutateOnGoing} = useMutateOnGoing();

    const {tableState} = useAppSelector(tableActionSelector);
    const {t} = useTranslation(["payment", "common"]);
    const {currentDate} = useAppSelector(agendaSelector);
    const {config: agenda} = useAppSelector(agendaSelector);
    const {query: filterData} = useAppSelector(leftActionBarSelector);
    const {lock} = useAppSelector(appLockSelector);
    const {direction} = useAppSelector(configSelector);
    const roles = (session?.data as UserDataResponse)?.general_information.roles as Array<string>;

    const noCardData = {
        mainIcon: "ic-payment",
        title: "no-data.title",
        description: "no-data.description",
    };

    const [patientDetailDrawer, setPatientDetailDrawer] = useState<boolean>(false);
    const [isAddAppointment] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [day, setDay] = useState(moment().format("DD-MM-YYYY"));
    const [filtredRows, setFiltredRows] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    let [select] = useState<any[]>([]);
    const [filter, setFilter] = useState(false);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;
    const [isChecked, setIsChecked] = useState(localStorage.getItem('newCashbox') ? localStorage.getItem('newCashbox') === '1' : user.medical_entity.hasDemo);
    const [openInfo, setOpenInfo] = React.useState(false);

    const {trigger: updateAppointmentStatus} = useRequestQueryMutation("/agenda/appointment/status/update");
    const {trigger: triggerCashbox} = useRequestQueryMutation("/payment/cashbox");


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
        router.push(slugConsultation, slugConsultation, {locale: router.locale})
            .then(() => {
                const form = new FormData();
                form.append('status', "4");
                form.append('start_date', moment().format("DD-MM-YYYY"));
                form.append('start_time', moment().format("HH:mm"));
                updateAppointmentStatus({
                    method: "PATCH",
                    data: form,
                    url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${event?.publicId ? event?.publicId : (event as any)?.id}/status/${router.locale}`
                }, {
                    onSuccess: () => {
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
                        mutateOnGoing();
                    }
                });
            });
    };

    const getAppointments = useCallback(
        (query: string, filterQuery: any) => {
            setLoading(true);
            if (query.includes("format=list")) {
                dispatch(setCurrentDate({date: moment().toDate(), fallback: false}));
            }
            triggerCashbox({
                method: "GET",
                url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${router.locale}?${query}`
            }, {
                onSuccess: (result) => {
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
                        amout += Number(app.fees ?? 0);
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
                            amount: app.fees ?? 0
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
                                    row.patient.insurances?.length > 0 &&
                                    updatedData &&
                                    updatedData.length > 0
                                );
                            })
                            : [...r]
                    );
                    //setTotal(amout);
                    setLoading(false);
                }
            });
        },
        [agenda, medical_entity.uuid, router, session, triggerCashbox, dispatch] // eslint-disable-line react-hooks/exhaustive-deps
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
                            <Typography variant="subtitle2">{t("total")}</Typography>
                            <Typography variant="h6">
                                {total} {devise}
                            </Typography>
                        </Stack>

                    </Stack>
                </Stack>
            </SubHeader>

            <LinearProgress
                sx={{visibility: loading ? "visible" : "hidden"}}
                color="warning"
            />

            <Box className="container">
                {!roles.includes("ROLE_SECRETARY") && <Card style={{paddingLeft: 10, marginBottom: 10}}>
                    <FormControlLabel
                        label={t('betav')}
                        control={
                            <Checkbox
                                checked={isChecked}
                                onChange={() => {
                                    setOpenInfo(true)
                                    const form = new FormData();
                                    form.append("is_demo", (!isChecked).toString());
                                    triggerCashbox({
                                            method: "PATCH",
                                            url: `${urlMedicalEntitySuffix}/demo/${router.locale}`,
                                            data: form
                                        },
                                        {
                                            onSuccess: () => {
                                                dispatch(setOngoing({newCashBox: !isChecked}));
                                                localStorage.setItem('newCashbox', !isChecked ? '1' : '0')
                                                setIsChecked(!isChecked);
                                            }
                                        }
                                    );
                                }}
                            />
                        }
                    />
                </Card>}
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
            <MobileContainer>
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

                    }}>
                    Filtrer (0)
                </Button>
            </MobileContainer>
            <DrawerBottom
                handleClose={() => setFilter(false)}
                open={filter}
                title="Filter">
                <PaymentFilter/>
            </DrawerBottom>

            <Dialog
                open={openInfo}
                scroll={'paper'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Beta version</DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        tabIndex={-1}>
                        {[...new Array(6)]
                            .map(
                                (_, index) => (
                                    <Typography key={`alert${index}`} mb={2}>
                                        {t(`alert-${index + 1}`)}
                                    </Typography>
                                ))
                        }

                        <Typography>{t('alert-7')}</Typography>
                        <Typography>{t('alert-8')}</Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        router.replace('/dashboard/cashbox')
                    }}>OK</Button>
                </DialogActions>
            </Dialog>
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
