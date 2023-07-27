import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useCallback, useEffect, useState} from "react";
import {Box, Button, Drawer, LinearProgress, Stack, Typography,} from "@mui/material";
import {SubHeader} from "@features/subHeader";
import {configSelector, DashLayout, dashLayoutSelector} from "@features/base";
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
import {useRequestMutation} from "@lib/axios";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {toggleSideBar} from "@features/menu";
import {appLockSelector} from "@features/appLock";
import {leftActionBarSelector, PaymentFilter} from "@features/leftActionBar";
import {DefaultCountry} from "@lib/constants";
import {EventDef} from "@fullcalendar/core/internal";
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

    const {tableState} = useAppSelector(tableActionSelector);
    const {t} = useTranslation(["payment", "common"]);
    const {currentDate} = useAppSelector(agendaSelector);
    const {config: agenda} = useAppSelector(agendaSelector);
    const {mutate: mutateOnGoing, medicalProfessionalData} = useAppSelector(dashLayoutSelector);
    const {query: filterData} = useAppSelector(leftActionBarSelector);
    const {lock} = useAppSelector(appLockSelector);
    const {direction} = useAppSelector(configSelector);

    const noCardData = {
        mainIcon: "ic-payment",
        title: "no-data.title",
        description: "no-data.description",
    };

    const [patientDetailDrawer, setPatientDetailDrawer] = useState<boolean>(false);
    const [isAddAppointment] = useState<boolean>(false);
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

    const {trigger: updateAppointmentStatus} = useSWRMutation(["/agenda/update/appointment/status", {Authorization: `Bearer ${session?.accessToken}`}], sendRequest as any);
    const {trigger} = useRequestMutation(null, "/payment/cashbox");


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
