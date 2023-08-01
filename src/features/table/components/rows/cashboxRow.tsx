import TableCell from "@mui/material/TableCell";
import {Collapse, Link, Stack, Table, TableRow, Typography,} from "@mui/material";
import {addBilling, TableRowStyled} from "@features/table";
import Icon from "@themes/urlIcon";
// redux
import {useAppDispatch} from "@lib/redux/hooks";
import {alpha, Theme} from "@mui/material/styles";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";
import moment from "moment-timezone";

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

    console.log(row);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;

    const [selected, setSelected] = useState<any>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const open = Boolean(anchorEl);

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
                            (row.type_transaction === 2  && theme.palette.error.main) ||

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
                    {/*  row.patient.insurances && row.patient.insurances.length > 0 ? (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <AvatarGroup
                                max={3}
                                sx={{"& .MuiAvatarGroup-avatar": {width: 24, height: 24}}}>
                                {row.patient.insurances.map((insuranceItem: InsuranceModel) => (
                                        <Tooltip
                                            key={insuranceItem?.uuid}
                                            title={insuranceItem?.name}>
                                            <Avatar variant={"circular"}>
                                                {insurances?.find((insurance: any) => insurance.uuid === insuranceItem?.uuid) &&
                                                    <ImageHandler
                                                        alt={insuranceItem?.name}
                                                        src={insurances.find(
                                                            (insurance: any) =>
                                                                insurance.uuid ===
                                                                insuranceItem?.uuid
                                                        ).logoUrl.url}
                                                    />}
                                            </Avatar>
                                        </Tooltip>
                                    )
                                )}
                            </AvatarGroup>
                        </Stack>
                    ) : (
                        <Typography>--</Typography>
                    )}*/}
                    <Typography>--</Typography>

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
                        color={row.type_transaction === 2 ? "error.main":row.rest_amount > 0 ? "black.main" : "success.main"}
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
                                                    <Typography variant="body2">{moment(col.payment_date.date).format('DD-MM-YYYY')}</Typography>
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

                                                        {!col.payment_means && Array.isArray(col.data.insurances) && <Typography
                                                            color="text.primary"
                                                            variant="body2">

                                                            {insurances.find((ins:any) => ins.uuid === col.data.insurances[0].uuid).name}

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
                                        </TableRow>
                                        </tbody>

                                    );
                                })}
                            </Table>
                        </Collapse>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}

export default PaymentRow;
