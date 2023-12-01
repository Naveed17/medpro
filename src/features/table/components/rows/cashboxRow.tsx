import TableCell from "@mui/material/TableCell";
import {
    Avatar,
    Card,
    CardContent,
    Collapse,
    IconButton,
    LinearProgress,
    Link,
    Paper,
    Stack,
    Table,
    TableBody,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import {TableRowStyled} from "@features/table";
import Icon from "@themes/urlIcon";
import IconUrl from "@themes/urlIcon";
// redux
import React, {useState} from "react";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";
import moment from "moment-timezone";
import {useRouter} from "next/router";
import {useRequestQueryMutation} from "@lib/axios";
import {ConditionalWrapper, useMedicalEntitySuffix} from "@lib/hooks";
import {HtmlTooltip} from "@features/tooltip";
import {ImageHandler} from "@features/image";
import {Label} from "@features/label";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {useInsurances} from "@lib/hooks/rest";

function CashboxRow({...props}) {

    const {
        row,
        handleEvent,
        t,
        data,
        handleClick,
        isItemSelected
    } = props;

    const {pmList, hideName} = data;
    const {insurances} = useInsurances();

    const router = useRouter();
    const theme = useTheme();
    const {data: session} = useSession();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;

    const [transaction_data, setTransaction_data] = useState<any[]>([]);

    const [transaction_loading, setTransaction_loading] = useState<boolean>(false)
    const {trigger: triggerPostTransaction} = useRequestQueryMutation("/payment/cashbox");

    const selectRow = (paymentUuid: string) => {
        setTransaction_loading(true)
        if (!isItemSelected) {
            triggerPostTransaction({
                method: "GET",
                url: `${urlMedicalEntitySuffix}/transactions/${paymentUuid}/transaction-data/${router.locale}`,
            }, {
                onSuccess: (res) => {
                    setTransaction_loading(false)
                    setTransaction_data(res.data.data)
                }
            })
        }
    }

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
                className={`row-cashbox ${isItemSelected ? "row-collapse" : ""}`}>
                <TableCell>
                    <IconButton sx={{
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: .7,
                        width: 27,
                        height: 27,
                        transform: isItemSelected ? "scale(-1)" : "scale(1)"
                    }}>
                        <Icon path="ic-expand"/>
                    </IconButton>
                </TableCell>

                <TableCell>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={.5}>
                        <Icon path="ic-agenda" height={11} width={11} color={theme.palette.text.primary}/>
                        <Typography variant="body2">{moment(row.date_transaction).format('DD-MM-YYYY')}</Typography>
                        <Icon path="ic-time" height={11} width={11} color={theme.palette.text.primary}/>
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
                                    key={insurance.insurance?.uuid + "ins"}
                                    title={insurance.insurance.name}>
                                    <Avatar variant={"circular"}>
                                        <ImageHandler
                                            alt={insurance.insurance?.name}
                                            src={insurances.find(ins => ins.uuid === insurance.insurance?.uuid)?.logoUrl.url}
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
                            <HtmlTooltip key={mean.slug + "pm"} title={<React.Fragment>
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
                <TableCell>
                    <Typography color='secondary' fontWeight={700}>
                        {row.rest_amount} {devise}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography color='secondary' fontWeight={700}>
                        {row.amount - row.rest_amount} {devise}
                    </Typography>
                </TableCell>
                {/***** Amount *****/}
                <TableCell>
                    <Stack direction={"row"} spacing={1} alignItems={"center"} justifyContent={"space-between"}>
                        <Typography color={"secondary"} fontWeight={700} textAlign={"center"}>
                            {row.amount} {" "}
                            <span>{devise}</span>
                        </Typography>
                        <Tooltip title={t('more')}>
                            <IconButton
                                onClick={event => {
                                    event.stopPropagation();
                                    handleEvent({action: "OPEN-POPOVER", row, event});
                                }}
                                size="small">
                                <MoreVertIcon/>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </TableCell>

            </TableRowStyled>

            {isItemSelected && (
                <TableRowStyled>
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
                        >
                            <Table>


                                <TableBody>
                                    <tr
                                    >
                                        <td colSpan={6}>
                                            <Stack
                                                spacing={1.2}
                                                mt={-1.2}
                                                ml={0.2}
                                                mr={-0.05}
                                                className="collapse-wrapper"
                                            >
                                                <Paper className="means-wrapper">
                                                    <Stack spacing={0.5}
                                                           mb={(transaction_data.length > 0 || transaction_loading) ? 2.5 : 0}>
                                                        {row?.payment_means?.length > 0 &&
                                                            row.payment_means.map((item: any) => (
                                                                <Stack
                                                                    direction="row"
                                                                    alignItems="center"
                                                                    justifyContent="space-between"
                                                                    width={1}
                                                                    key={item.uuid + "pmeans"}
                                                                >
                                                                    <Stack
                                                                        direction="row"
                                                                        alignItems="center"
                                                                        spacing={4}
                                                                        width={1}
                                                                        sx={{flex: 1}}
                                                                    >
                                                                        <Stack
                                                                            direction="row"
                                                                            alignItems="center"
                                                                            spacing={1}
                                                                        >
                                                                            <Tooltip
                                                                                title={`${item.amount} ${devise}`}
                                                                            >
                                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                                <img
                                                                                    style={{width: 15}}
                                                                                    src={
                                                                                        pmList.find(
                                                                                            (pm: {
                                                                                                slug: string;
                                                                                            }) =>
                                                                                                pm.slug ==
                                                                                                item?.paymentMeans
                                                                                                    ?.slug
                                                                                        )?.logoUrl.url
                                                                                    }
                                                                                    alt={"payment means icon"}
                                                                                />
                                                                            </Tooltip>
                                                                            <Typography variant="body2">
                                                                                {item?.paymentMeans?.name ||
                                                                                    "--"}
                                                                            </Typography>
                                                                        </Stack>
                                                                        <Typography
                                                                            variant="body2"
                                                                            width={1}
                                                                        >
                                                                            {item?.data?.bank
                                                                                ?.abbreviation || "--"}
                                                                        </Typography>
                                                                        <Typography
                                                                            variant="body2"
                                                                            width={1}
                                                                        >
                                                                            {item?.data?.nb
                                                                                ? ` N° ${item?.data?.nb}`
                                                                                : "--"}
                                                                        </Typography>
                                                                    </Stack>
                                                                    <Stack
                                                                        sx={{flex: 1}}
                                                                        direction="row"
                                                                        alignItems="center"
                                                                        spacing={4}
                                                                        width={1}
                                                                    >
                                                                        <Typography
                                                                            variant="body2"
                                                                            width={1}
                                                                        >
                                                                            {item?.data?.carrier || "--"}
                                                                        </Typography>
                                                                        <Stack
                                                                            direction="row"
                                                                            alignItems="center"
                                                                            spacing={0.5}
                                                                            width={1}
                                                                        >
                                                                            <IconUrl
                                                                                path="ic-agenda"
                                                                                width={12}
                                                                                height={12}
                                                                                color={
                                                                                    theme.palette.text.primary
                                                                                }
                                                                            />
                                                                            <Typography variant="body2">
                                                                                {moment(
                                                                                        item?.data?.date
                                                                                    ).format("DD/MM/YYYY") ||
                                                                                    "--"}
                                                                            </Typography>
                                                                        </Stack>
                                                                        <Typography
                                                                            variant="body2"
                                                                            width={1}
                                                                            textAlign='right'
                                                                        >
                                                                            {item.amount ? (
                                                                                <>
                                                                                    {item.amount} {devise}
                                                                                </>
                                                                            ) : (
                                                                                "--"
                                                                            )}
                                                                        </Typography>
                                                                    </Stack>
                                                                </Stack>
                                                            ))}
                                                    </Stack>
                                                    {transaction_loading && <LinearProgress/>}
                                                    {transaction_data.length > 0 &&
                                                        transaction_data.map((transaction) => (
                                                            <Card
                                                                className="consultation-card"
                                                                key={transaction.uuid + "td"}
                                                            >
                                                                <CardContent>
                                                                    <Stack
                                                                        direction="row"
                                                                        justifyContent="space-between"
                                                                        alignItems="center"
                                                                    >
                                                                        <Stack
                                                                            spacing={1}
                                                                            width={1}
                                                                            alignItems="center"
                                                                            direction="row"
                                                                        >
                                                                            <Typography
                                                                                fontWeight={700}
                                                                                minWidth={95}
                                                                            >
                                                                                {
                                                                                    transaction?.appointment?.type
                                                                                        ?.name
                                                                                }
                                                                            </Typography>
                                                                            <Stack
                                                                                direction="row"
                                                                                alignItems="center"
                                                                                spacing={0.5}
                                                                            >
                                                                                <IconUrl
                                                                                    path="ic-agenda"
                                                                                    width={12}
                                                                                    height={12}
                                                                                    color={
                                                                                        theme.palette.text.primary
                                                                                    }
                                                                                />
                                                                                <Typography variant="body2">
                                                                                    {transaction?.payment_date}
                                                                                </Typography>
                                                                                <IconUrl path="ic-time"/>
                                                                                <Typography variant="body2">
                                                                                    {transaction?.payment_time}
                                                                                </Typography>
                                                                            </Stack>
                                                                        </Stack>
                                                                        <Stack
                                                                            spacing={1}
                                                                            width={1}
                                                                            alignItems="center"
                                                                            direction="row"
                                                                            justifyContent="flex-end"
                                                                            sx={{
                                                                                span: {
                                                                                    fontSize: 14,
                                                                                    strong: {
                                                                                        mx: 0.5,
                                                                                    },
                                                                                },
                                                                            }}
                                                                        >
                                                                            <Label
                                                                                variant="filled"
                                                                                color={
                                                                                    transaction?.amount ===
                                                                                    transaction?.amount
                                                                                        ?.restAmount
                                                                                        ? "error"
                                                                                        : "success"
                                                                                }
                                                                            >
                                                                                {t("total")}
                                                                                <strong>
                                                                                    {transaction?.amount}
                                                                                </strong>
                                                                                {devise}
                                                                            </Label>
                                                                        </Stack>
                                                                    </Stack>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                </Paper>

                                            </Stack>
                                        </td>
                                    </tr>
                                </TableBody>

                            </Table>
                        </Collapse>
                    </TableCell>
                </TableRowStyled>
            )}


        </>
    );
}

export default CashboxRow;
