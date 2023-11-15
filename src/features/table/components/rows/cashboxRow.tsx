import TableCell from "@mui/material/TableCell";
import {
    Avatar,
    Button,
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
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";
import moment from "moment-timezone";
import {cashBoxSelector} from "@features/leftActionBar/components/cashbox";
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import {dashLayoutSelector} from "@features/base";
import {useRouter} from "next/router";
import {useRequestQueryMutation} from "@lib/axios";
import {LoadingButton} from "@mui/lab";
import {ConditionalWrapper, useInvalidateQueries, useMedicalEntitySuffix} from "@lib/hooks";
import {alpha} from "@mui/material/styles";
import {HtmlTooltip} from "@features/tooltip";
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

    const {mutateTransactions, pmList, hideName} = data;
    const router = useRouter();
    const theme = useTheme();
    const {data: session} = useSession();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {trigger: invalidateQueries} = useInvalidateQueries();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;

    const [selected, setSelected] = useState<any>([]);
    const [transaction_data, setTransaction_data] = useState<any[]>([]);
    const [loadingDeleteTransaction, setLoadingDeleteTransaction] = useState(false);
    const [openDeleteTransactionDialog, setOpenDeleteTransactionDialog] = useState(false);

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

    const mutatePatientWallet = () => {
        medicalEntityHasUser && row.appointment && invalidateQueries([`${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${row.appointment.patient?.uuid}/wallet/${router.locale}`]);
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

    const selectRow = (paymentUuid: string) => {
        if (!isItemSelected) {
            triggerPostTransaction({
                method: "GET",
                url: `${urlMedicalEntitySuffix}/transactions/${paymentUuid}/transaction-data/${router.locale}`,
            }, {
                onSuccess: (res) => {
                    setTransaction_data(res.data.data)
                }
            })
        }
    }

    useEffect(() => {
        dispatch(addBilling(selected));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected]);

    return (
        <>
            <TableRowStyled
                hover
                onClick={() => {
                    handleClick(row.uuid as string)
                    selectRow(row.uuid)
                }}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                selected={isItemSelected}
                className="payment-row"
                sx={{bgcolor: alpha(theme.palette.success.main, 0.1)}}>

                {/***** date_transaction *****/}
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
                {/***** time_transaction *****/}
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
                            variant="body2">{row.payment_time}</Typography>
                    </Stack>

                </TableCell>
                {/***** patient name *****/}
                {!hideName && <TableCell>
                    {row.patient && (
                        <ConditionalWrapper
                            condition={!row.patient?.isArchived}
                            wrapper={(children: any) => <Link
                                sx={{cursor: "pointer"}}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleEvent({action: "PATIENT_DETAILS", row: row.patient, event});
                                }}
                                underline="none">{children}</Link>}>
                            {`${row.patient.firstName} ${row.patient.lastName}`}
                        </ConditionalWrapper>
                    )}
                </TableCell>}
                {/***** Insurances *****/}
                <TableCell>

                    <Stack direction={"row"} justifyContent={"center"}>
                        {
                            row.patient.insurances ? row.patient.insurances.map((insurance: any) => (
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
                            )) : <Typography>-</Typography>
                        }
                    </Stack>
                </TableCell>
                {/***** Payments means *****/}
                <TableCell>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        spacing={1}>
                        {row.payment_means && row.payment_means.map((mean: any) => (
                            <HtmlTooltip key={mean.slug} title={<React.Fragment>
                                {
                                    mean.data && <Stack>
                                        {mean.data.nb && <Typography fontSize={12}>Chq N°<span
                                            style={{fontWeight: "bold"}}>{mean.data.nb}</span></Typography>}
                                        {mean.data.carrier && <Typography fontSize={12}>{t('carrier')} : <span
                                            style={{fontWeight: "bold"}}>{mean.data.carrier}</span></Typography>}
                                        <Typography fontSize={12}><span
                                            style={{fontWeight: "bold"}}>{mean.data.bank?.name}</span></Typography>
                                    </Stack>
                                }
                                <Typography fontSize={12} textAlign={"center"}
                                            fontWeight={"bold"}>{mean.amount} {devise}</Typography>
                            </React.Fragment>}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img style={{width: 15}} key={mean.slug}
                                     src={pmList.find((pm: {
                                         slug: string;
                                     }) => pm.slug == mean.paymentMeans.slug).logoUrl.url}
                                     alt={"payment means icon"}/>
                            </HtmlTooltip>
                        ))
                        }
                    </Stack>

                </TableCell>
                {/***** Amount *****/}
                <TableCell>
                    <Stack direction={"row"} spacing={1} alignItems={"center"} justifyContent={"center"}>
                        <Typography color={"success.main"} fontWeight={700} textAlign={"center"}>
                            {row.amount}
                            <span style={{fontSize: 10}}>{devise}</span>
                        </Typography>
                        {isItemSelected && <IconButton
                            size="small"
                            onClick={(event) => {
                                event.stopPropagation();
                                setOpenDeleteTransactionDialog(true);
                            }}>
                            <IconUrl path="setting/icdelete"/>
                        </IconButton>}

                    </Stack>
                </TableCell>

            </TableRowStyled>

            {transaction_data && (
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
                                {transaction_data.map((col: any, idx: number) => {
                                    return (
                                        <tbody key={idx}>
                                        <TableRow
                                            hover
                                            onClick={() => handleChildSelect(col)}
                                            role="checkbox"
                                            className="collapse-row"
                                            sx={{
                                                "&::before": {
                                                    ...(idx > 0 && {
                                                        height: "calc(100% + 8px)",
                                                        top: '-70%'
                                                    })
                                                },
                                                background: alpha((col.appointment && col.appointment.restAmount) ? theme.palette.warning.main : theme.palette.success.main, 0.1)
                                            }}>
                                            <TableCell sx={{background: "transparent"}}>
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
                                                    <Typography variant="body2">{col.payment_date}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell sx={{background: "transparent"}}>
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
                                            {col.appointment && <TableCell sx={{background: "transparent"}}>
                                                <Link sx={{cursor: "pointer"}}
                                                      onClick={(event) => {
                                                          event.stopPropagation();
                                                          router.push(`/dashboard/consultation/${col.appointment.uuid}`);
                                                      }}
                                                      underline="none">
                                                    {col.appointment.type.name}
                                                </Link>
                                            </TableCell>}
                                            <TableCell sx={{background: "transparent"}}>
                                                <HtmlTooltip
                                                    title={
                                                        <React.Fragment>
                                                            <Typography
                                                                color="inherit">{col.appointment.type.name} :<span
                                                                style={{fontWeight: "bold"}}>{col.appointment.fees}</span><span
                                                                style={{fontSize: 9}}>{devise}</span></Typography>
                                                            {col.appointment.acts.map((act: {
                                                                act_uuid: string;
                                                                name: string;
                                                                price: number
                                                            }) => (<Typography
                                                                key={act.act_uuid}>{act.name} :<span
                                                                style={{fontWeight: "bold"}}>{act.price}</span><span
                                                                style={{fontSize: 9}}>{devise}</span></Typography>))}
                                                        </React.Fragment>
                                                    }>
                                                    <Typography style={{cursor: "pointer"}}
                                                                color={(col.appointment && col.appointment.restAmount) ? "black.main" : "success.main"}
                                                                fontWeight={700} textAlign={"center"}>
                                                        {(col.appointment && col.appointment.restAmount) ? `${col.amount} /${col.appointment.fees}` : col.amount}
                                                        <span style={{fontSize: 10}}>{devise}</span>
                                                    </Typography>
                                                </HtmlTooltip>
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
