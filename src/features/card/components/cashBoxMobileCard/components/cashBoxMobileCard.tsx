import React, {useState, useEffect} from "react";
import CardStyled from "./overrides/cardStyle";
import {
    CardContent,
    alpha,
    Theme,
    useTheme,
    Link,
    Stack,
    Tooltip,
    Avatar,
    Typography,
    IconButton,
    Menu,
    Button,
    DialogActions,
} from "@mui/material";
import {ImageHandler} from "@features/image";
import {useRouter} from "next/router";
import moment from "moment-timezone";
import {addBilling} from "@features/table";
import Icon from "@themes/urlIcon";
import IconUrl from "@themes/urlIcon";
// redux
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";
import {cashBoxSelector} from "@features/leftActionBar/components/cashbox";
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import {configSelector, dashLayoutSelector} from "@features/base";
import {useSnackbar} from "notistack";
import {useRequestMutation, useRequestQueryMutation} from "@lib/axios";
import {LoadingButton} from "@mui/lab";
import {useInvalidateQueries, useMedicalEntitySuffix} from "@lib/hooks";
import {PaymentFeesPopover} from "@features/popover";
import {useSWRConfig} from "swr";
import {useTransactionEdit} from "@lib/hooks/rest";

function CashBoxMobileCard({...props}) {
    const {
        data,
        hideName = false,
        handleEvent,
        insurances,
        t,
        mutateTransctions,
        pmList,
    } = props;
    const theme = useTheme<Theme>();
    const router = useRouter();
    const {data: session} = useSession();
    const dispatch = useAppDispatch();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {trigger: triggerTransactionEdit} = useTransactionEdit();
    const {trigger: invalidateQueries} = useInvalidateQueries();
    const {enqueueSnackbar} = useSnackbar();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;

    const [selected, setSelected] = useState<any>([]);
    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [openPaymentDialog, setOpenPaymentDialog] = useState<boolean>(false);
    const [loadingRequest, setLoadingRequest] = useState<boolean>(false);
    const [loadingDeleteTransaction, setLoadingDeleteTransaction] = useState(false);
    const [openDeleteTransactionDialog, setOpenDeleteTransactionDialog] = useState(false);
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const {paymentTypesList} = useAppSelector(cashBoxSelector);
    const {direction} = useAppSelector(configSelector);
    const {selectedBoxes} = useAppSelector(cashBoxSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const {trigger: triggerPostTransaction} = useRequestQueryMutation("/payment/cashbox");

    const resetDialog = () => {
        setOpenPaymentDialog(false);
    }

    const mutatePatientWallet = () => {
        medicalEntityHasUser && invalidateQueries(
            [`${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${data.appointment.patient?.uuid}/wallet/${router.locale}`]);
    }

    const handleSubmit = () => {
        setLoadingRequest(true);
        triggerTransactionEdit(
            selectedPayment,
            data,
            () => {
                mutateTransctions().then(() => {
                    mutatePatientWallet();
                    enqueueSnackbar(t("addsuccess"), {variant: "success"});
                    setOpenPaymentDialog(false);
                    setLoadingRequest(false);
                });
            }
        );
    }

    const deleteTransaction = () => {
        const form = new FormData();
        form.append("cash_box", selectedBoxes[0]?.uuid);

        triggerPostTransaction({
            method: "DELETE",
            url: `${urlMedicalEntitySuffix}/transactions/${data?.uuid}/${router.locale}`,
            data: form,
        }, {
            onSuccess: () => {
                mutateTransctions();
                mutatePatientWallet();
                setLoadingDeleteTransaction(false);
                setOpenDeleteTransactionDialog(false);
            }
        });
    }

    const handleClose = () => {
        setContextMenu(null);
    }

    const openFeesPopover = (event: React.MouseEvent<any>) => {
        event.stopPropagation();
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                }
                : null
        );
    }

    useEffect(() => {
        dispatch(addBilling(selected));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected]);

    const openPutTransactionDialog = () => {
        let payments: any[] = [];
        let payed_amount = 0;

        data.transaction_data.map((td: any) => {
            payed_amount += td.amount;
            let pay: any = {
                uuid: td.uuid,
                amount: td.amount,
                payment_date: moment().format("DD-MM-YYYY HH:mm"),
                status_transaction: td.status_transaction_data,
                type_transaction: td.type_transaction_data,
                data: td.data,
            };
            if (td.insurance) pay["insurance"] = td.insurance.uuid;
            if (td.payment_means)
                pay["payment_means"] = paymentTypesList.find(
                    (pt: { slug: string }) => pt.slug === td.payment_means.slug
                );
            payments.push(pay);
        });

        setSelectedPayment({
            uuid: data.appointment.uuid,
            payments,
            payed_amount,
            appointment: data.appointment,
            patient: data.appointment.patient,
            total: data?.amount,
            isNew: false,
        });
        setOpenPaymentDialog(true);
    }

    return (
        <>
            <CardStyled
                sx={{
                    position: "relative",
                    bgcolor: (theme: Theme) =>
                        alpha(
                            (data.type_transaction === 2 && theme.palette.error.main) ||
                            (data.rest_amount > 0 && theme.palette.expire.main) ||
                            (data.rest_amount <= 0 && theme.palette.success.main) ||
                            theme.palette.background.paper,
                            0.1
                        ),
                    cursor: data.collapse ? "pointer" : "default",
                }}>
                <CardContent>
                    <Stack direction="row" alignItems="center">
                        <Stack spacing={1.5} width={{xs: 1, sm: 'auto'}}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={{xs: 1, sm: 6}}>
                                {!hideName && data.appointment ? (
                                    <Link
                                        sx={{
                                            cursor: "pointer",
                                            width: 100,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleEvent({
                                                action: "PATIENT_DETAILS",
                                                row: data.appointment.patient,
                                                event,
                                            });
                                        }}
                                        underline="none">
                                        {`${data.appointment.patient.firstName} ${data.appointment.patient.lastName}`}
                                    </Link>
                                ) : data.patient ? (
                                    <Link
                                        sx={{
                                            cursor: "pointer",
                                            width: 100,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleEvent({
                                                action: "PATIENT_DETAILS",
                                                row: data.patient,
                                                event,
                                            });
                                        }}
                                        underline="none">
                                        {`${data.patient.firstName} ${data.patient.lastName}`}
                                    </Link>
                                ) : (
                                    <Link
                                        sx={{
                                            width: 100,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                        underline="none">
                                        {data.transaction_data[0].data.label || "-"}
                                    </Link>
                                )}
                                {data.transaction_data.filter((td: any) => td.insurance)
                                    .length > 0 ? (
                                    data.transaction_data
                                        .filter((td: any) => td.insurance)
                                        .map((td: any) => (
                                            <Tooltip
                                                key={td.insurance.insurance?.uuid}
                                                title={td.insurance.insurance?.name}>
                                                <Avatar variant={"circular"}>
                                                    {insurances?.find(
                                                        (insurance: any) =>
                                                            insurance.uuid === td.insurance?.insurance.uuid
                                                    ) && (
                                                        <ImageHandler
                                                            alt={td.insurance.insurance?.name}
                                                            src={
                                                                insurances.find(
                                                                    (insurance: any) =>
                                                                        insurance.uuid ===
                                                                        td.insurance?.insurance.uuid
                                                                ).logoUrl.url
                                                            }
                                                        />
                                                    )}
                                                </Avatar>
                                            </Tooltip>
                                        ))
                                ) : (
                                    <Typography>--</Typography>
                                )}
                                {data.type_transaction ? (
                                    data.appointment ? (
                                        <Link
                                            sx={{cursor: "pointer", minWidth: {xs: 0, sm: 100}}}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                router
                                                    .push(
                                                        `/dashboard/consultation/${data.appointment.uuid}`
                                                    )
                                                    .then(() => {
                                                    });
                                            }}
                                            underline="none">
                                            {data.appointment.type.name}
                                        </Link>
                                    ) : (
                                        <Typography
                                            sx={{
                                                minWidth: {xs: 0, sm: 100},
                                            }}
                                            variant="body2"
                                            color="text.primary">
                                            {t("table." + data.type_transaction)}
                                        </Typography>
                                    )
                                ) : (
                                    <Typography
                                        sx={{
                                            minWidth: {xs: 0, sm: 100},
                                        }}>
                                        --
                                    </Typography>
                                )}

                                <Stack
                                    sx={{
                                        minWidth: {xs: 0, sm: 100},
                                        '& > span': {
                                            mr: '4px !important',
                                            '&:last-child': {
                                                m: '0 !important'

                                            }

                                        }
                                    }}
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="center">
                                    {data.transaction_data &&
                                        data.transaction_data.map(
                                            (td: TransactionDataModel) =>
                                                td.payment_means && (
                                                    <ImageHandler
                                                        style={{width: 15}}
                                                        key={td.uuid}
                                                        src={
                                                            pmList.find(
                                                                (pm: { slug: string }) =>
                                                                    pm.slug == td.payment_means.slug
                                                            ).logoUrl.url
                                                        }
                                                        alt={"payment means icon"}/>)
                                        )}
                                </Stack>
                                <Stack
                                    direction={"row"}
                                    alignItems={"center"}
                                    spacing={1}
                                    justifyContent={"center"}
                                    ml={{xs: 'auto !important', sm: 1}}>
                                    <Typography
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            openFeesPopover(event);
                                        }}
                                        color={
                                            data.type_transaction === 2
                                                ? "error.main"
                                                : data.rest_amount > 0
                                                    ? "expire.main"
                                                    : "success.main"
                                        }
                                        fontWeight={700}>
                                        {data.rest_amount > 0
                                            ? `${data.amount - data.rest_amount} / ${data.amount}`
                                            : data.amount}{" "}
                                        <span style={{fontSize: 10}}>{devise}</span>
                                    </Typography>

                                    {data?.appointment && (
                                        <Menu
                                            open={contextMenu !== null}
                                            onClose={handleClose}
                                            anchorReference="anchorPosition"
                                            anchorPosition={
                                                contextMenu !== null
                                                    ? {
                                                        top: contextMenu.mouseY,
                                                        left: contextMenu.mouseX,
                                                    }
                                                    : undefined
                                            }
                                            anchorOrigin={{
                                                vertical: "top",
                                                horizontal: "right",
                                            }}
                                            transformOrigin={{
                                                vertical: "top",
                                                horizontal: "right",
                                            }}>
                                            <PaymentFeesPopover uuid={data?.appointment.uuid}/>
                                        </Menu>
                                    )}
                                </Stack>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1}
                                    sx={{
                                        ".react-svg": {
                                            svg: {
                                                width: 11,
                                                height: 11,
                                                path: {
                                                    fill: (theme) => theme.palette.text.primary,
                                                },
                                            },
                                        },
                                    }}>
                                    <Icon path="ic-agenda"/>
                                    <Typography variant="body2">
                                        {moment(data.date_transaction).format("DD-MM-YYYY")}
                                    </Typography>
                                </Stack>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1}
                                    sx={{
                                        ".react-svg": {
                                            svg: {
                                                width: 11,
                                                height: 11,
                                                path: {
                                                    fill: (theme) => theme.palette.text.primary,
                                                },
                                            },
                                        },
                                    }}>
                                    <Icon path="ic-time"/>
                                    <Typography variant="body2">
                                        {moment(data.date_transaction).format("HH:mm")}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Stack
                            direction={"row"}
                            ml="auto"
                            sx={{
                                position: {xs: "absolute", sm: "static"},
                                right: 2,
                                bottom: 2,
                            }}>
                            {data.rest_amount > 0 && (
                                <Tooltip title={t("settlement")}>
                                    <IconButton

                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openPutTransactionDialog();
                                        }}>
                                        <Icon path={"ic-argent"}/>
                                    </IconButton>
                                </Tooltip>
                            )}
                            <Tooltip title={t("more")}>
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEvent({action: "PATIENT_PAYMENT", row: data, e});
                                    }}>
                                    <Icon path={"setting/ic-voir"}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={t("edit")}>
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openPutTransactionDialog();
                                    }}>
                                    <IconUrl path="setting/edit"/>
                                </IconButton>
                            </Tooltip>


                            <Tooltip title={t("delete")}>
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenDeleteTransactionDialog(true);
                                    }}>
                                    <IconUrl path="setting/icdelete"/>
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Stack>
                </CardContent>
            </CardStyled>
            <Dialog
                action={"payment_dialog"}
                {...{
                    direction,
                    sx: {
                        minHeight: 380,
                        padding: {xs: 1, md: 2}
                    },
                }}
                open={openPaymentDialog}
                data={{
                    selectedPayment,
                    setSelectedPayment,
                    appointment:
                        selectedPayment && selectedPayment.appointment
                            ? selectedPayment.appointment
                            : null,
                    patient:
                        selectedPayment && selectedPayment.appointment
                            ? selectedPayment.appointment.patient
                            : null,
                }}
                size={"md"}
                title={t("payment_dialog_title")}
                dialogClose={resetDialog}
                actionDialog={
                    <DialogActions>
                        <Button onClick={resetDialog} startIcon={<CloseIcon/>}>
                            {t("config.cancel", {ns: "common"})}
                        </Button>
                        <LoadingButton
                            disabled={
                                selectedPayment && selectedPayment.payments.length === 0
                            }
                            loading={loadingRequest}
                            variant="contained"
                            onClick={handleSubmit}
                            startIcon={<IconUrl path="ic-dowlaodfile"/>}>
                            {t("config.save", {ns: "common"})}
                        </LoadingButton>
                    </DialogActions>
                }
            />

            <Dialog
                action="delete-transaction"
                title={t("dialogs.delete-dialog.title")}
                open={openDeleteTransactionDialog}
                size="sm"
                data={{t}}
                color={theme.palette.error.main}
                actionDialog={
                    <Stack direction="row" spacing={1}>
                        <Button
                            onClick={() => {
                                setLoadingDeleteTransaction(false);
                                setOpenDeleteTransactionDialog(false);
                            }}
                            startIcon={<CloseIcon/>}>
                            {t("cancel")}
                        </Button>
                        <LoadingButton
                            variant="contained"
                            loading={loadingDeleteTransaction}
                            color="error"
                            onClick={deleteTransaction}
                            startIcon={<Icon path="setting/icdelete" color="white"/>}>
                            {t("delete")}
                        </LoadingButton>
                    </Stack>
                }
            />
        </>
    );
}

export default CashBoxMobileCard;
