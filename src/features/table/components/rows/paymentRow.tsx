import TableCell from "@mui/material/TableCell";
import {Avatar, AvatarGroup, IconButton, Link, Menu, Skeleton, Stack, Tooltip, Typography,} from "@mui/material";
import {addBilling, TableRowStyled} from "@features/table";
import Icon from "@themes/urlIcon";
// redux
import {useAppDispatch} from "@lib/redux/hooks";
import {alpha, Theme} from "@mui/material/styles";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";
import {PaymentFeesPopover} from "@features/popover";
import {ImageHandler} from "@features/image";

function PaymentRow({...props}) {
    const dispatch = useAppDispatch();
    const {
        row,
        isItemSelected,
        handleClick,
        handleEvent,
        t,
        loading,
        editMotif,
        data,
    } = props;
    const {insurances} = data;
    const {data: session} = useSession();

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


    useEffect(() => {
        if (!isItemSelected) {
            setSelected([]);
        }
    }, [isItemSelected]);

    useEffect(() => {
        dispatch(addBilling(selected));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected]);
    return (
        <>
            <TableRowStyled
                hover
                onClick={() => !loading && handleClick(row.uuid as string)}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                selected={isItemSelected}
                className="payment-row"
                sx={{
                    bgcolor: (theme: Theme) =>
                        alpha(
                            (row.pending && theme.palette.warning.darker) ||
                            (row.amount > 0 && theme.palette.success.main) ||
                            (row.amount < 0 && theme.palette.error.main) ||
                            theme.palette.background.paper,
                            row.amount === 0 ? 1 : 0.1
                        ),
                    cursor: row.collapse ? "pointer" : "default",
                }}>
                <TableCell>
                    {loading ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Skeleton width={20} height={30}/>
                            <Skeleton width={100}/>
                        </Stack>
                    ) : (
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
                            <Typography variant="body2">{row.date}</Typography>
                        </Stack>
                    )}
                </TableCell>
                <TableCell>
                    {loading ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Skeleton variant="circular" width={20} height={20}/>
                            <Skeleton width={100}/>
                        </Stack>
                    ) : (
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
                            <Typography variant="body2">{row.time}</Typography>
                        </Stack>
                    )}
                </TableCell>
                <TableCell>
                    {loading ? (
                        <Skeleton width={80}/>
                    ) : row.name ? (
                        <Link
                            sx={{cursor: "pointer"}}
                            onClick={(event) => {
                                event.stopPropagation();
                                handleEvent({action: "PATIENT_DETAILS", row, event});
                            }}
                            underline="none">
                            {row.name}
                        </Link>
                    ) : (
                        <Link underline="none">+</Link>
                    )}
                </TableCell>
                <TableCell align={"center"}>
                    {loading ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Skeleton width={20} height={30}/>
                            <Skeleton width={100}/>
                        </Stack>
                    ) : row.patient.insurances && row.patient.insurances.length > 0 ? (
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
                    )}
                </TableCell>
                <TableCell align={"center"}>
                    {loading ? (
                        <Skeleton width={80}/>
                    ) : row.type ? (
                        <Typography variant="body2" color="text.primary">
                            {t(row.type)}
                        </Typography>
                    ) : (
                        <Typography>--</Typography>
                    )}
                </TableCell>
                <TableCell align="center">
                    {loading ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Skeleton width={20} height={30}/>
                            <Skeleton width={20} height={30}/>
                        </Stack>
                    ) : (
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                            spacing={1}>
                            {row.payment_type.map((type: string, i: number) => (
                                <Icon key={i} path={type}/>
                            ))}
                        </Stack>
                    )}
                </TableCell>
                {/*
                <TableCell align="center">
                    {loading ? (
                        <Skeleton width={40} height={40}/>

                    ) : (

                        row.billing_status ?

                            <Label className="label" variant="ghost"
                                   color={row.billing_status === "yes" ? "success" : 'error'}>{t('table.' + row.billing_status)}</Label>
                            : <Typography>--</Typography>
                    )}
                </TableCell>
*/}
                <TableCell align="center">
                    {loading ? (
                        <Skeleton width={40} height={20}/>
                    ) : row.pending ? (
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography
                                color={(theme) => theme.palette.warning.darker}
                                fontWeight={600}>
                                {row.amount}/{row.pending}
                            </Typography>
                            <IconButton
                                color="primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    editMotif(row);
                                }}>
                                <Icon path="ic-argent"/>
                            </IconButton>
                        </Stack>
                    ) : (
                        <>
                            <Typography
                                {...(row.amount !== "0" && {sx: {cursor: "zoom-in"}})}
                                id={"popover-button"}
                                aria-controls={open ? "popover-menu" : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                                {...(row.amount !== "0" && {onClick: openFeesPopover})}
                                color={
                                    (row.amount > 0 && "success.main") ||
                                    (row.amount < 0 && "error.main") ||
                                    "text.primary"
                                }
                                fontWeight={700}>
                                {row.amount} {devise}
                            </Typography>

                            <Menu
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
                                <PaymentFeesPopover uuid={row.uuid}/>
                            </Menu>
                        </>
                    )}
                </TableCell>
            </TableRowStyled>
        </>
    );
}

export default PaymentRow;
