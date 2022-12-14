import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useCallback, useEffect, useState} from "react";
import {
    Box,
    Button,
    DialogActions,
    IconButton,
    List,
    ListItem,
    Stack,
    Theme,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import {SubHeader} from "@features/subHeader";
import {DashLayout} from "@features/base";
import {Otable, tableActionSelector} from "@features/table";
import {useTranslation} from "next-i18next";
import {Dialog} from "@features/dialog";
import IconUrl from "@themes/urlIcon";
import Icon from "@themes/urlIcon";
import CloseIcon from "@mui/icons-material/Close";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {NoDataCard, PaymentMobileCard} from "@features/card";
import {DesktopContainer} from "@themes/desktopConainter";
import {MobileContainer} from "@themes/mobileContainer";
import DialogTitle from "@mui/material/DialogTitle";
import MuiDialog from "@mui/material/Dialog";
import {Label} from "@features/label";
import {agendaSelector, setCurrentDate} from "@features/calendar";
import moment from "moment-timezone";
import {TriggerWithoutValidation} from "@app/swr/swrProvider";
import {useRequestMutation} from "@app/axios";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {toggleSideBar} from "@features/sideBarMenu";
import {appLockSelector} from "@features/appLock";


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
        id: "select-all",
        numeric: false,
        disablePadding: true,
        label: "checkbox",
        sortable: false,
        align: "left",
    },
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
        align: "center",
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
    const theme = useTheme() as Theme;
    const isMobile = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down("md")
    );
    const [open, setOpen] = useState<boolean>(false);
    const [collapse, setCollapse] = useState<boolean>(false);
    const [selected, setSelected] = useState<any>(null);
    const {t, ready} = useTranslation("payment");
    const [collapseDate, setCollapseData] = useState<any>(null);
    const handleClose = () => setOpen(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [day, setDay] = useState(moment().format('DD-MM-YYYY'));
    const [rows, setRows] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [select, setSelect] = useState<any[]>([]);
    const [toReceive, setToReceive] = useState(0);
    const {currentDate} = useAppSelector(agendaSelector);

    const isOpen = Boolean(anchorEl);
    const devise = process.env.NEXT_PUBLIC_DEVISE;
    const handleCloseCollapse = () => setCollapse(false);
    const handleSave = () => {
        console.log(state)
        setOpen(false)
    };
    const handleEdit = (props: any) => {
        console.log(props)
        setSelected(props);
        setOpen(true);
    };

    const [state, setState] = React.useState<any>({
        species: false,
        card: false,
        cheque: false,
        selected: "species",
        tab3Data: [
            {
                amount: "",
                carrier: "",
                bank: "",
                check_number: '',
                payment_date: new Date(),
                expiry_date: new Date(),
            }
        ]
    });

    const noCardData = {
        mainIcon: "ic-payment",
        title: "no-data.title",
        description: "no-data.description"
    };

    const handleCollapse = (props: any) => {
        setCollapseData(props);
        setCollapse(true);
    };
    const {addBilling} = useAppSelector(tableActionSelector);

    const {trigger} = useRequestMutation(null, "/agenda/appointment", {revalidate: true, populateCache: false});

    const {data: session} = useSession();
    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const router = useRouter();
    const {config: agenda} = useAppSelector(agendaSelector);
    const dispatch = useAppDispatch();
    const {lock} = useAppSelector(appLockSelector);

    useEffect(() => {
        if (!lock) {
            dispatch(toggleSideBar(false));
        }
    })

    const getAppointments = useCallback((query: string) => {

        if (query.includes("format=list")) {
            dispatch(setCurrentDate({date: moment().toDate(), fallback: false}));
        }
        trigger({
            method: "GET",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agenda?.uuid}/appointments/${router.locale}?${query}`,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        }, TriggerWithoutValidation).then((result) => {
            let amout = 0;
            const r: any[] = [];
            const appointments = (result?.data as HttpResponse)?.data.filter((app: { status: number; }) => app.status === 5)
            appointments.map((app: any) => {
                amout += Number(app.fees)
                r.push({
                    uuid: app.uuid,
                    date: app.dayDate,
                    time: app.startTime,
                    name: `${app.patient.firstName} ${app.patient.lastName}`,
                    insurance: "",
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
                })
            })
            setRows([...r])
            setTotal(amout)

        });
    }, [agenda, medical_entity.uuid, router, session, trigger, dispatch]);

    useEffect(() => {
        setDay(moment(currentDate.date).format('DD-MM-YYYY'))
    }, [currentDate])
    useEffect(() => {
        if (agenda) {
            const queryPath = `format=week&page=1&limit=50&start_date=${day}&end_date=${day}`
            getAppointments(queryPath)
        }
    }, [getAppointments, agenda, day])

    const handleChange = (action: string, selected: any, checked: boolean) => {
        let amouts = 0
        if (action === 'checkTransaction') {
            checked ? select.push(selected) : setSelect(select.filter(trans => trans.uuid !== selected.uuid));
            select.map(trans => amouts += Number(trans.amount))
            setSelect([...select])
        } else {
            selected.map((trans: { amount: any; }) => amouts += Number(trans.amount))
            setSelect(selected)
        }
        setToReceive(amouts)
    }

    return (
        <>
            <SubHeader>
                <Stack
                    direction="row"
                    width={1}
                    justifyContent="space-between"
                    alignItems="center">
                    <Typography
                        textTransform={"capitalize"}>{t("path")} {'>'} {moment(day, 'DD-MM-YYYY').format('ddd DD.MM.YYYY')}</Typography>
                    <Stack direction="row" spacing={3} alignItems="center">
                        <Typography variant="subtitle2">{t("total")}</Typography>
                        <Typography variant="h6">{total} {devise}</Typography>
                        {/*
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="h6">I</Typography>
                            <Button
                                variant="contained"
                                color="error"
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
                                    setOpen(true);
                                    setSelected(null);
                                }}>
                                + {!isMobile && t("btn_header_2")}
                            </Button>
                        </Stack>
*/}
                    </Stack>
                </Stack>
            </SubHeader>

            <Box className="container">
                <DesktopContainer>
                    {rows.length > 0 ? <Otable
                        headers={headCells}
                        rows={rows}
                        from={"payment"}
                        t={t}
                        handleChange={handleChange}
                        select={select}
                        edit={handleEdit}
                    /> : <NoDataCard t={t} ns={"payment"} data={noCardData}/>}
                </DesktopContainer>
                <MobileContainer>
                    <Stack spacing={2}>
                        {rows.map((card, idx) => (
                            <React.Fragment key={idx}>
                                <PaymentMobileCard
                                    data={card}
                                    t={t}
                                    edit={handleEdit}
                                    getCollapseData={handleCollapse}
                                />
                            </React.Fragment>
                        ))}
                    </Stack>
                    <Box pb={6}/>
                </MobileContainer>
            </Box>

            {/*<SubFooter>
                <Stack
                    spacing={3}
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    width={1}>


                    <Button variant="text-black" onClick={() => {
                        console.log(select)
                    }}>{t("receive")}
                        {toReceive > 0 && <Typography> ( {toReceive} {devise} )</Typography>}
                    </Button>

                </Stack>
            </SubFooter>*/}
            <Dialog
                action={"payment_dialog"}
                open={open}
                data={{t, selected, state, setState}}
                size={"md"}
                direction={"ltr"}
                title={t("dialog_title")}
                dialogClose={handleClose}
                actionDialog={
                    <DialogActions>
                        <Button onClick={handleClose} startIcon={<CloseIcon/>}>
                            {t("cancel")}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            startIcon={<IconUrl path="ic-dowlaodfile"/>}>
                            {t("save")}
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
                    Data
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseCollapse}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: theme.palette.grey[0],
                        }}>
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>

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
                                    <Icon path="ic-agenda-jour"/>
                                    <Typography fontWeight={600}>{col.date}</Typography>
                                </Stack>
                                <Stack spacing={0.5} direction="row" alignItems="center">
                                    <Icon path="setting/ic-time"/>
                                    <Typography fontWeight={600} className="date">
                                        {col.time}
                                    </Typography>
                                </Stack>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="flex-start"
                                    spacing={1}>
                                    {col.payment_type.map((type: any, i: number) => (
                                        <Stack
                                            key={i}
                                            direction="row"
                                            alignItems="center"
                                            spacing={1}>
                                            <Icon path={type.icon}/>
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
            </MuiDialog>
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
