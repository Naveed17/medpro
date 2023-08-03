import TableCell from "@mui/material/TableCell";
import {
    Avatar,
    Collapse,
    IconButton,
    Link,
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
import {cashBoxSelector} from "@features/leftActionBar/components/cashbox";
import {ImageHandler} from "@features/image";

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
    const {insurances, pmList} = data;
    const {data: session} = useSession();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;

    const [selected, setSelected] = useState<any>([]);
    const [openDeleteCollapseDialog, setOpenDeleteCollapseDialog] = useState(false);

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const open = Boolean(anchorEl);

    const theme = useTheme();

    const {selectedBoxes, filterCB} = useAppSelector(cashBoxSelector);
    const openFeesPopover = (event: React.MouseEvent<any>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                  // Other native context menus might behave different.
                  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                null
        );
    };

    const handleClose = () => {
        setAnchorEl(null);
        setContextMenu(null);
    };

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
    };
    const openDialogDeleteCollapseDialog = (idCollapse: string) => {
        /*        setCollapseID(idCollapse)
                setSelectedPayment({
                    uuid: row?.uuid,
                    date: moment().format("DD-MM-YYYY"),
                    time: row?.time,
                    patient: row?.patient,
                    insurance: row?.patient?.insurances,
                    type: row?.appointement_type,
                    amount: row?.amount,//wallet patient  ,
                    total: row?.amount + row?.rest, // consultation fees +- wallet patient,
                    payments: []
                });*/
        setOpenDeleteCollapseDialog(true)
    }

    const removeCollapse = () => {
        /*        setLoadingDeleteCollapse(true);
                const filteredCollapses = [...row.collapse].filter((payment: any) => payment.uuid !== collapseID);
                const deleteCollapses = [...row.collapse].filter((payment: any) => payment.uuid === collapseID);
                const totalAmountFiltredCollapses = filteredCollapses.reduce((i: any, transaction: any) => i + transaction.amount, 0);
                if (totalAmountFiltredCollapses === 0) {
                    const form = new FormData();
                    form.append("cash_box", selectedBoxes[0]?.uuid);
                    triggerDeleteTransaction({
                        method: "DELETE",
                        url: `${urlMedicalEntitySuffix}/transactions/${row?.uuid}/${router.locale}`,
                        headers: {Authorization: `Bearer ${session?.accessToken}`},
                        data: form

                    }).then(() => {
                        const filterQuery = generateFilter({filterCB});
                        mutate(`${urlMedicalEntitySuffix}/transactions/${router.locale}${filterQuery}`).then(data => console.log(data))
                        setLoadingDeleteTransaction(false);
                        setOpenDeleteTransactionDialog(false);
                    });
                }
                else {*/
        /*
                    const totalRestData = deleteCollapses[0].amount + deleteCollapses[0].data.rest ;
                    const transData: any =
                        filteredCollapses.map((payment: any) => ({
                            payment_means: payment.payment_means?.uuid,
                            insurance: payment.data.insurances  === 0 ? "" : payment.data.insurances[0]?.uuid,
                            amount: payment.amount,
                            status_transaction: TransactionStatus[1].value,
                            type_transaction: TransactionType[2].value,
                            payment_date: payment.date,
                            data: {
                                patient: payment.data.patient,
                                insurances: payment.data.insurances,
                                rest:totalRestData,
                                total:payment.amount,
                                type:selectedPayment.type,
                            },
                        }));
                    const totalAmountForm = transData.reduce((total: number, transaction: any) => {
                        if (transaction.data.insurances.length === 0) {
                            return total + transaction.amount;
                        }
                        return total;
                    }, 0);

                    const form = new FormData();
                    form.append("type_transaction", TransactionType[2].value);
                    form.append("status_transaction", TransactionStatus[1].value);
                    form.append("cash_box", selectedBoxes[0]?.uuid);
                    form.append("amount", totalAmountForm.toString());
                    form.append("rest_amount", transData[transData.length - 1].data.rest.toString());
                    form.append("appointment", row?.appointement_uuid);
                    form.append("transaction_data", JSON.stringify(transData));
                    triggerPutTransaction({
                        method: "PUT",
                        url: `${urlMedicalEntitySuffix}/transactions/${selectedPayment.uuid}/${router.locale}`,
                        data: form,
                        headers: {
                            Authorization: `Bearer ${session?.accessToken}`,
                        },
                    }).then(() => {

                        const filterQuery = generateFilter({filterCB});
                        mutate(`${urlMedicalEntitySuffix}/transactions/${router.locale}${filterQuery}`).then(data => console.log(data))
                    });
        */
    }
    /*
            setOpenDeleteCollapseDialog(false);
            setCollapseID(null)
        };
    */


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

                            (row.rest_amount > 0 && theme.palette.warning.main) ||
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
                        <Typography variant="body2">{moment(row.date_transaction).format('HH:mm')}</Typography>
                    </Stack>

                </TableCell>
                <TableCell>
                    {row.appointment ? (
                        <Link
                            sx={{cursor: "pointer"}}
                            onClick={(event) => {
                                event.stopPropagation();
                                handleEvent({action: "PATIENT_DETAILS", row, event});
                            }}
                            underline="none">
                            {`${row.appointment.patient.firstName} ${row.appointment.patient.lastName}`}
                        </Link>
                    ) : (
                        <Link underline="none">+</Link>
                    )}
                </TableCell>
                <TableCell align={"center"}>
                    {
                        row.transaction_data.filter((td:any)=> td.insurance).length > 0 ?row.transaction_data.filter((td:any)=> td.insurance).map((td:any) => (
                            <Tooltip
                                key={td.insurance.insurance?.uuid}
                                title={td.insurance.insurance?.name}>
                                <Avatar variant={"circular"}>
                                    {insurances?.find((insurance: any) => insurance.uuid === td.insurance?.insurance.uuid) &&
                                        <ImageHandler
                                            alt={td.insurance.insurance?.name}
                                            src={insurances.find(
                                                (insurance: any) =>
                                                    insurance.uuid ===
                                                    td.insurance?.insurance.uuid
                                            ).logoUrl.url}
                                        />}
                                </Avatar>
                            </Tooltip>
                        )): <Typography>--</Typography>
                    }
                </TableCell>
                <TableCell align={"center"}>
                    {row.type_transaction ? (
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

                    {/* <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                            spacing={1}>
                            {row.payment_type.map((type: string, i: number) => (
                                <Icon key={i} path={type}/>
                            ))}
                        </Stack>*/}
                </TableCell>
                <TableCell align="center">
                    <Typography
                        color={row.type_transaction === 2 ? "error.main" : row.rest_amount > 0 ? "black.main" : "success.main"}
                        fontWeight={700}>
                        {row.rest_amount > 0 ? `${row.amount - row.rest_amount} ${devise} / ${row.amount}` : row.amount} {devise}
                    </Typography>
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
                                                        variant="body2">{moment(row.date_transaction).format('HH:mm')}</Typography>
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
                                                        </Typography>}

                                                        {!col.payment_means && col.insurance && <Typography
                                                            color="text.primary"
                                                            variant="body2">
                                                            {col.insurance.insurance.name}
                                                        </Typography>}
                                                    </Stack>

                                                </Stack>

                                            </TableCell>
                                            {/* <TableCell
                                                align="left"
                                                style={{
                                                    backgroundColor: "transparent",
                                                    border: "none",
                                                }}>
                                                {col.status_transaction ? (
                                                    <Label
                                                        className="label"
                                                        variant="ghost"
                                                        color={
                                                            col.status_transaction === 1 ? "success" : col.status_transaction === 2 ? "warning" : "error"
                                                        }>
                                                        {t("table." + TransactionStatus.find(ts => ts.value == col.status_transaction)?.key)}
                                                    </Label>
                                                ) : (
                                                    <Typography>--</Typography>
                                                )}
                                            </TableCell>*/}
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
                                                    fontWeight={700}>
                                                    {col.amount} {devise}
                                                </Typography>
                                            </TableCell>

                                            <TableCell align="left"
                                                       style={{backgroundColor: 'transparent', border: 'none'}}>

                                                {/* <IconButton
                                                    size="small"

                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openDialogEditTransactionDialog(col.uuid)
                                                    }}>
                                                    <IconUrl path="setting/edit"/>
                                                </IconButton> */}
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openDialogDeleteCollapseDialog(col.uuid)
                                                    }}>
                                                    <IconUrl path="setting/icdelete"/>
                                                </IconButton>

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

            {/*  <Dialog
                action="delete-transaction"
                title={t("dialogs.delete-dialog.title")}
                open={openDeleteCollapseDialog}
                size="sm"
                data={{t}}
                color={theme.palette.error.main}
                actionDialog={
                    <Stack direction="row" spacing={1}>
                        <Button
                            onClick={() => {
                                setLoadingDeleteCollapse(false);
                                setOpenDeleteCollapseDialog(false);
                            }}
                            startIcon={<CloseIcon/>}>
                            {t("cancel")}
                        </Button>
                        <LoadingButton
                            variant="contained"
                            loading={loadingDeleteTransaction}
                            color="error"
                            onClick={removeCollapse}
                            startIcon={<Icon path="setting/icdelete" color="white"/>}>
                            {t("delete")}
                        </LoadingButton>
                    </Stack>
                }
            />*/}
        </>
    );
}

export default PaymentRow;
