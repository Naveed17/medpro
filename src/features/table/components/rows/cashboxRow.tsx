import TableCell from "@mui/material/TableCell";
import {
    Avatar,
    Button,
    Collapse,
    DialogActions,
    IconButton,
    Link,
    Menu,
    Stack,
    Table,
    TableRow,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import {addBilling, TableRowStyled} from "@features/table";
import Icon from "@themes/urlIcon";
import IconUrl from "@themes/urlIcon";
// redux
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {alpha, Theme} from "@mui/material/styles";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";
import moment from "moment-timezone";
import {ImageHandler} from "@features/image";
import {cashBoxSelector} from "@features/leftActionBar/components/cashbox";
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import {configSelector, dashLayoutSelector} from "@features/base";
import {useRouter} from "next/router";
import {useSnackbar} from "notistack";
import {useRequestQueryMutation} from "@lib/axios";
import {LoadingButton} from "@mui/lab";
import {useInvalidateQueries, useMedicalEntitySuffix} from "@lib/hooks";
import {PaymentFeesPopover} from "@features/popover";
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import {useTransactionEdit} from "@lib/hooks/rest";

function PaymentRow({...props}) {
    const dispatch = useAppDispatch();
    const {
        row,
        handleEvent,
        t,
        data,
        handleClick,
        isItemSelected
    } = props;
    const {insurances, mutateTransactions, pmList, hideName} = data;
    const router = useRouter();
    const theme = useTheme();
    const {enqueueSnackbar} = useSnackbar();
    const {data: session} = useSession();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {trigger: triggerTransactionEdit} = useTransactionEdit();
    const {trigger: invalidateQueries} = useInvalidateQueries();

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

    const handleChildSelect = (id: any) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly string[] = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    }

    const resetDialog = () => {
        setOpenPaymentDialog(false);
    }

    const mutatePatientWallet = () => {
        medicalEntityHasUser && row.appointment && invalidateQueries([`${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${row.appointment.patient?.uuid}/wallet/${router.locale}`]);
    }

    const handleSubmit = () => {
        setLoadingRequest(true)
        triggerTransactionEdit(
            selectedPayment,
            row,
            () => {
                mutateTransactions().then(() => {
                    mutatePatientWallet();
                    enqueueSnackbar(t("addsuccess"), {variant: 'success'});
                    setOpenPaymentDialog(false);
                    setTimeout(() => setLoadingRequest(false));
                });

            }
        );
    }

    const deleteTransaction = () => {
        const form = new FormData();
        form.append("cash_box", selectedBoxes[0]?.uuid);

        triggerPostTransaction({
            method: "DELETE",
            url: `${urlMedicalEntitySuffix}/transactions/${row?.uuid}/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                mutateTransactions()
                mutatePatientWallet()
                setLoadingDeleteTransaction(false);
                setOpenDeleteTransactionDialog(false);
            }
        });

    }
    const openPutTransactionDialog = () => {

        let payments: any[] = [];
        let payed_amount = 0

        row.transaction_data.map((td: any) => {
            payed_amount += td.amount;
            let pay: any = {
                uuid: td.uuid,
                amount: td.amount,
                payment_date: td.payment_date,
                payment_time: td.payment_time,
                status_transaction: td.status_transaction_data,
                type_transaction: td.type_transaction_data,
                data: td.data
            }
            if (td.insurance)
                pay["insurance"] = td.insurance.uuid
            if (td.payment_means)
                pay["payment_means"] = paymentTypesList.find((pt: {
                    slug: string;
                }) => pt.slug === td.payment_means.slug)
            payments.push(pay)
        })
        setSelectedPayment({
            uuid: row.uuid,
            payments,
            payed_amount,
            appointment: row.appointment,
            patient: row.patient,
            total: row?.amount,
            isNew: false
        });
        setOpenPaymentDialog(true);
    }
    const handleClose = () => {
        setContextMenu(null);
    };
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
    };

    const getInsurances = () => {
        let _res: string[] = [];
        row.transaction_data.filter((td: any) => td.insurance).map((insc: any) => _res.push(insc.insurance.insurance.uuid))
        return insurances.filter((insurance: { uuid: string; }) => _res.includes(insurance.uuid))
    }

    useEffect(() => {
        dispatch(addBilling(selected));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected]);

    return (
        <>
            <TableRowStyled
                hover
                onClick={() => handleClick(row.uuid as string)}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                selected={isItemSelected}
                className="payment-row"
                sx={{
                    bgcolor: (theme: Theme) =>
                        alpha(
                            (row.type_transaction === 2 && theme.palette.error.main) ||
                            (row.rest_amount > 0 && theme.palette.expire.main) ||
                            (row.rest_amount <= 0 && theme.palette.success.main) ||
                            theme.palette.background.paper, 0.1),
                    cursor: row.collapse ? "pointer" : "default",
                }}>
                <TableCell>
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
                        <Typography variant="body2">{moment(row.date_transaction).format('DD-MM-YYYY')}</Typography>
                    </Stack>
                </TableCell>
                <TableCell>

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
                        <Typography
                            variant="body2">{moment(row.date_transaction).add(1, "hour").format('HH:mm')}</Typography>
                    </Stack>

                </TableCell>
                {!hideName &&

                    <TableCell>
                        {row.appointment ? (
                            <Link
                                sx={{cursor: "pointer"}}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleEvent({action: "PATIENT_DETAILS", row: row.appointment.patient, event});
                                }}
                                underline="none">
                                {`${row.appointment.patient.firstName} ${row.appointment.patient.lastName}`}
                            </Link>
                        ) : row.patient ? (
                            <Link
                                sx={{cursor: "pointer"}}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleEvent({action: "PATIENT_DETAILS", row: row.patient, event});
                                }}
                                underline="none">
                                {`${row.patient.firstName} ${row.patient.lastName}`}
                            </Link>
                        ) : (
                            <Link underline="none">{row.transaction_data[0].data.label}</Link>
                        )}
                    </TableCell>}
                <TableCell align={"center"}>
                    <Stack direction={"row"} justifyContent={"center"}>
                        {
                            row.transaction_data.filter((td: any) => td.insurance).length > 0 ? getInsurances().map((insurance: any) => (
                                <Tooltip
                                    key={insurance?.uuid}
                                    title={insurance?.name}>
                                    <Avatar variant={"circular"}>
                                        <ImageHandler
                                            alt={insurance?.name}
                                            src={insurance.logoUrl.url}
                                        />
                                    </Avatar>
                                </Tooltip>
                            )) : <Typography>--</Typography>
                        }
                    </Stack>
                </TableCell>
                <TableCell align={"center"}>
                    {row.type_transaction ? row.appointment ? (
                        <Link sx={{cursor: "pointer"}}
                              onClick={(event) => {
                                  event.stopPropagation();
                                  router.push(`/dashboard/consultation/${row.appointment.uuid}`).then(() => {

                                  })
                              }}
                              underline="none">
                            {row.appointment.type.name}
                        </Link>
                    ) : (
                        <Typography variant="body2" color="text.primary">
                            {t('table.' + row.type_transaction)}
                        </Typography>
                    ) : (
                        <Typography>--</Typography>
                    )}
                </TableCell>
                <TableCell align="center">
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        spacing={1}>
                        {row.transaction_data && row.transaction_data.map((td: TransactionDataModel) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            td.payment_means && <img style={{width: 15}} key={td.uuid}
                                                     src={pmList.find((pm: {
                                                         slug: string;
                                                     }) => pm.slug == td.payment_means.slug).logoUrl.url}
                                                     alt={"payment means icon"}/>
                        ))}
                    </Stack>
                </TableCell>
                <TableCell align="center">
                    <Stack direction={"row"} alignItems={"center"} spacing={1} justifyContent={"center"}>
                        <Typography
                            onClick={(event) => {
                                event.stopPropagation();
                                openFeesPopover(event)
                            }}
                            color={row.type_transaction === 2 ? "error.main" : row.rest_amount > 0 ? "expire.main" : "success.main"}
                            fontWeight={700}>
                            {row.rest_amount != 0 ? `${(row.amount - row.rest_amount).toFixed(3)} / ${row.amount}` : row.amount}
                            <span
                                style={{fontSize: 10}}>{devise}</span>
                        </Typography>

                        {row?.appointment && <Menu
                            open={contextMenu !== null}
                            onClose={handleClose}
                            anchorReference="anchorPosition"
                            anchorPosition={
                                contextMenu !== null
                                    ? {top: contextMenu.mouseY, left: contextMenu.mouseX}
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
                            <PaymentFeesPopover {...{row, t}}/>
                        </Menu>}

                        <Stack direction={"row"}>
                            {row.rest_amount > 0 && <Tooltip title={t('settlement')}>
                                <IconButton sx={!isItemSelected ? {
                                    background: theme.palette.expire.main,
                                    borderRadius: 1,
                                    "&:hover": {
                                        background: theme.palette.expire.main
                                    },
                                } : {}} onClick={(e) => {
                                    e.stopPropagation();
                                    openPutTransactionDialog()
                                }}>
                                    <Icon path={"ic-argent"}/>
                                </IconButton>
                            </Tooltip>}
                            {isItemSelected && row.appointment && <Tooltip title={t('edit')}>
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openPutTransactionDialog()
                                    }}>
                                    <IconUrl path="setting/edit"/>
                                </IconButton>
                            </Tooltip>}
                            {isItemSelected && !row.appointment && <Tooltip title={t('delete')}>
                                <IconButton
                                    size="small"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setOpenDeleteTransactionDialog(true);
                                    }}>
                                    <IconUrl path="setting/icdelete"/>
                                </IconButton>
                            </Tooltip>}
                        </Stack>
                    </Stack>
                </TableCell>
            </TableRowStyled>
            {row.transaction_data && (
                <TableRow>
                    <TableCell
                        colSpan={9}
                        style={{
                            backgroundColor: "transparent",
                            border: "none",
                            borderTop: "none",
                            borderBottom: "none",
                            padding: 0,
                            lineHeight: 0,
                        }}>
                        <Collapse
                            in={isItemSelected}
                            timeout="auto"
                            unmountOnExit
                            sx={{pl: 6}}>
                            <Table>
                                {row.transaction_data.map((col: any, idx: number) => {
                                    return (
                                        <tbody key={idx}>
                                        <TableRow
                                            hover
                                            onClick={() => handleChildSelect(col)}
                                            role="checkbox"

                                            className="collapse-row"
                                            sx={{
                                                bgcolor: (theme: Theme) =>
                                                    theme.palette.background.paper,
                                                "&::before": {
                                                    ...(idx > 0 && {
                                                        height: "calc(100% + 8px)",
                                                        top: '-70%'

                                                    })
                                                }
                                            }}>
                                            <TableCell style={{
                                                backgroundColor: "transparent",
                                                border: "none",
                                            }}>
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
                                                    <Typography
                                                        variant="body2">{moment(col.payment_date.date).format('DD-MM-YYYY')}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell style={{
                                                backgroundColor: "transparent",
                                                border: "none",
                                            }}>
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
                                                    <Typography
                                                        variant="body2">{col.payment_time}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell
                                                style={{
                                                    backgroundColor: "transparent",
                                                    border: "none",
                                                }}>
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    justifyContent="flex-start"
                                                    spacing={1}>
                                                    <Stack
                                                        direction="row"
                                                        alignItems="center"
                                                        spacing={1}>
                                                        {/*<Icon path={type.icon}/>*/}
                                                        {col.payment_means && <Typography
                                                            color="text.primary"
                                                            variant="body2">
                                                            {t(col.payment_means.name)}
                                                            {col.status_transaction_data === 3 &&
                                                                <CheckCircleOutlineRoundedIcon style={{fontSize: 15}}
                                                                                               color={"success"}/>}
                                                        </Typography>}

                                                        {!col.payment_means && col.insurance && <Typography
                                                            color="text.primary"
                                                            variant="body2">
                                                            {col.insurance.insurance.name}
                                                        </Typography>}
                                                        {!col.payment_means && !col.insurance && <Typography
                                                            color="text.primary"
                                                            variant="body2">
                                                            {t('wallet')}
                                                        </Typography>}
                                                    </Stack>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                {col.data.check_number &&
                                                    <Typography>{col.data.check_number}</Typography>}
                                            </TableCell>
                                            <TableCell>
                                                {col.data.carrier && <Typography>{col.data.carrier}</Typography>}
                                            </TableCell>
                                            <TableCell>
                                                {col.data.bank && <Typography>{col.data.bank}</Typography>}
                                            </TableCell>
                                            {/*
                                            <TableCell
                                                align="left"
                                                style={{
                                                    backgroundColor: "transparent",
                                                    border: "none",
                                                }}>
                                                {col.status_transaction_data ? (
                                                    <Label
                                                        className="label"
                                                        variant="ghost"
                                                        color={
                                                            col.status_transaction_data === 3 ? "success" : col.status_transaction_data === 2 ? "warning" : "error"
                                                        }>
                                                        {t("table." + TransactionStatus.find(ts => ts.value == col.status_transaction_data)?.key)}
                                                    </Label>
                                                ) : (
                                                    <Typography>--</Typography>
                                                )}
                                            </TableCell>
*/}
                                            <TableCell
                                                style={{
                                                    backgroundColor: "transparent",
                                                    border: "none",
                                                }}>
                                                <Typography
                                                    color={
                                                        (col.amount > 0 && "success.main") ||
                                                        (col.amount < 0 && "error.main") ||
                                                        "text.primary"
                                                    }
                                                    textAlign={"center"}
                                                    fontWeight={700}>
                                                    {col.amount} <span style={{fontSize: 10}}>{devise}</span>
                                                </Typography>
                                            </TableCell>

                                        </TableRow>
                                        </tbody>
                                    );
                                })}
                            </Table>
                        </Collapse>
                    </TableCell>
                </TableRow>
            )}

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
                    appointment: selectedPayment && selectedPayment.appointment ? selectedPayment.appointment : null,
                    patient: selectedPayment && selectedPayment.appointment ? selectedPayment.appointment.patient : null,
                }}
                size={"lg"}
                fullWidth
                title={t('payment_dialog_title')}
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

export default PaymentRow;
