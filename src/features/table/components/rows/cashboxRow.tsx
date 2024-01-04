import TableCell from "@mui/material/TableCell";
import {
    Avatar,
    Box,
    Card,
    CardContent,
    CardHeader,
    Collapse,
    Divider,
    Grid,
    IconButton,
    LinearProgress,
    Link,
    List,
    ListItem,
    Stack,
    Table,
    TableBody,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import {Otable, TableRowStyled} from "@features/table";
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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {useInsurances} from "@lib/hooks/rest";
import {NoDataCard} from "@features/card";

const headCells: readonly HeadCell[] = [
    {
        id: "date",
        numeric: false,
        disablePadding: true,
        label: "date",
        sortable: false,
        align: "left",
    },
    {
        id: "total",
        numeric: true,
        disablePadding: true,
        label: "total",
        sortable: false,
        align: "center",
    },
    {
        id: "amount",
        numeric: true,
        disablePadding: true,
        label: "amount",
        sortable: false,
        align: "center",
    },
    {
        id: "rest",
        numeric: true,
        disablePadding: true,
        label: "rest",
        sortable: false,
        align: "center",
    },
];

function CashboxRow({...props}) {
    const {row, handleEvent, t, data, handleClick, isItemSelected} = props;

    const {pmList, hideName} = data;
    const {insurances} = useInsurances();

    const router = useRouter();
    const theme = useTheme();
    const {data: session} = useSession();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse)
        .medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country
        ? medical_entity.country
        : DefaultCountry;
    const devise = doctor_country.currency?.name;

    const [transaction_data, setTransaction_data] = useState<any[]>([]);
    const [transaction_loading, setTransaction_loading] =
        useState<boolean>(false);
    const {trigger: triggerPostTransaction} =
        useRequestQueryMutation("/payment/cashbox");
    const selectRow = (paymentUuid: string) => {
        setTransaction_loading(true);
        if (!isItemSelected) {
            triggerPostTransaction(
                {
                    method: "GET",
                    url: `${urlMedicalEntitySuffix}/transactions/${paymentUuid}/transaction-data/${router.locale}`,
                },
                {
                    onSuccess: (res) => {
                        setTransaction_loading(false);
                        setTransaction_data(res.data.data);
                    },
                }
            );
        }
    };
    const noCardData = {
        mainIcon: "ic-agenda-jour",
        title: "no-data.title_consult",
        description: "no-data.des_consult",
    };
    return (
        <>
            <TableRowStyled
                hover
                onClick={() => {
                    handleClick(row.uuid as string);
                    selectRow(row.uuid);
                }}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                selected={isItemSelected}
                className={`${
                    isItemSelected ? "row-cashbox row-collapse" : "row-cashbox"
                }`}
            >
                <TableCell>
                    <IconButton
                        sx={{
                            border: "none",
                            width: 27,
                            height: 27,
                            transform: isItemSelected ? "scale(-1)" : "scale(1)",
                        }}
                    >
                        <Icon path="ic-expand"/>
                    </IconButton>
                </TableCell>

                <TableCell>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Icon
                            path="ic-agenda-jour"
                            height={14}
                            width={14}
                            color={theme.palette.text.primary}
                        />
                        <Typography variant="body2" fontSize={13} fontWeight={600}>
                            {moment(row.date_transaction).format("DD-MM-YYYY")}
                        </Typography>
                        <Icon
                            path="ic-time"
                            height={14}
                            width={14}
                            color={theme.palette.text.primary}
                        />
                        <Typography variant="body2" fontSize={13} fontWeight={600}>
                            {row.payment_time}
                        </Typography>
                    </Stack>
                </TableCell>
                {/***** patient name *****/}
                {!hideName && (
                    <TableCell>
                        {row.patient && (
                            <ConditionalWrapper
                                condition={!row.patient?.isArchived}
                                wrapper={(children: any) => (
                                    <Link
                                        sx={{cursor: "pointer", fontWeight: 600, fontSize: 14}}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleEvent({
                                                action: "PATIENT_DETAILS",
                                                row: row.patient,
                                                event,
                                            });
                                        }}
                                        underline="none"
                                    >
                                        {children}
                                    </Link>
                                )}
                            >
                                {`${row.patient.firstName} ${row.patient.lastName}`}
                            </ConditionalWrapper>
                        )}
                    </TableCell>
                )}
                {/***** Insurances *****/}
                <TableCell>
                    <Stack direction={"row"} justifyContent={"center"}>
                        {row.patient && row.patient.insurances && row.patient.insurances.length > 0 ? (
                            row.patient.insurances.map((insurance: any) => (
                                <Tooltip
                                    key={insurance.insurance?.uuid + "ins"}
                                    title={insurance.insurance.name}>
                                    <Avatar variant={"circular"} sx={{width: 30, height: 30}}>
                                        <ImageHandler
                                            alt={insurance.insurance?.name}
                                            src={
                                                insurances.find(
                                                    (ins) => ins.uuid === insurance.insurance?.uuid
                                                )?.logoUrl.url
                                            }
                                        />
                                    </Avatar>
                                </Tooltip>
                            ))
                        ) : (
                            <Typography>-</Typography>
                        )}
                    </Stack>
                </TableCell>
                {/***** Payments means *****/}
                <TableCell>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        spacing={1}
                    >
                        {row.payment_means &&
                            row.payment_means.map((mean: any) => (
                                <HtmlTooltip
                                    key={mean.uuid + "pm"}
                                    title={
                                        <React.Fragment>
                                            {mean.data && (
                                                <Stack>
                                                    {mean.data.nb && (
                                                        <Typography fontSize={12}>
                                                            Chq N°
                                                            <span style={{fontWeight: "bold"}}>
                                {mean.data.nb}
                              </span>
                                                        </Typography>
                                                    )}
                                                    {mean.data.carrier && (
                                                        <Typography fontSize={12}>
                                                            {t("carrier")} :{" "}
                                                            <span style={{fontWeight: "bold"}}>
                                {mean.data.carrier}
                              </span>
                                                        </Typography>
                                                    )}
                                                    <Typography fontSize={12}>
                            <span style={{fontWeight: "bold"}}>
                              {mean.data.bank?.name}
                            </span>
                                                    </Typography>
                                                </Stack>
                                            )}
                                            <Typography
                                                fontSize={12}
                                                textAlign={"center"}
                                                fontWeight={"bold"}
                                            >
                                                {mean.amount} {devise}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        style={{width: 15}}
                                        key={mean.slug}
                                        src={
                                            pmList.find(
                                                (pm: { slug: string }) =>
                                                    pm.slug == mean.paymentMeans.slug
                                            ).logoUrl.url
                                        }
                                        alt={"payment means icon"}
                                    />
                                </HtmlTooltip>
                            ))}
                    </Stack>
                </TableCell>
                <TableCell>
                    <Typography color="text.primary" textAlign={"center"} fontWeight={700}>
                        {row.rest_amount} {devise}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography color="text.primary" textAlign={"center"} fontWeight={700}>
                        {row.amount - row.rest_amount} {devise}
                    </Typography>
                </TableCell>
                {/***** Amount *****/}
                <TableCell>
                    <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                        justifyContent={"end"}
                    >
                        <Typography fontWeight={700} textAlign={"center"}>
                            {row.amount} <span>{devise}</span>
                        </Typography>
                        <Tooltip title={t("more")}>
                            <IconButton
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleEvent({action: "OPEN-POPOVER", row, event});
                                }}
                                size="small"
                            >
                                <MoreVertIcon/>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </TableCell>
            </TableRowStyled>

            {isItemSelected && (
                <TableRowStyled className="cashbox-collapse-row">
                    <TableCell
                        colSpan={9}
                        style={{
                            backgroundColor: "transparent",
                            border: "none",
                            borderTop: "none",
                            borderBottom: "none",
                            padding: 0,
                            lineHeight: 0,
                        }}
                    >
                        <Collapse
                            in={isItemSelected}
                            timeout="auto"
                            unmountOnExit
                            sx={{mt: "-2px"}}
                        >
                            <Table>
                                <TableBody>
                                    <tr>
                                        <td colSpan={6}>
                                            <Stack className="collapse-wrapper">
                                                <Grid container spacing={1}>
                                                    <Grid item md={4}>
                                                        <Card>
                                                            <CardHeader
                                                                title={
                                                                    <>
                                                                        <Typography fontWeight={600} mb={1.2}>
                                                                            {t("table.transaction_details")}
                                                                        </Typography>
                                                                        <Divider/>
                                                                    </>
                                                                }
                                                            />
                                                            <CardContent>
                                                                <Stack spacing={2}>
                                                                    {row?.payment_means?.length > 0 &&
                                                                        row.payment_means.map(
                                                                            (item: any, idx: number) => (
                                                                                <Stack
                                                                                    width={1}
                                                                                    key={item.uuid + "pmeans"}
                                                                                    spacing={2}
                                                                                >
                                                                                    <Stack
                                                                                        direction="row"
                                                                                        alignItems="flex-start"
                                                                                        spacing={1}
                                                                                    >
                                                                                        <ImageHandler
                                                                                            src={`/static/icons/${
                                                                                                item?.paymentMeans?.slug ===
                                                                                                "cash"
                                                                                                    ? "ic-cash-light-blue"
                                                                                                    : "ic-cheque-light-blue"
                                                                                            }.svg`}
                                                                                            alt={"payment_icon"}
                                                                                            width={40}
                                                                                            height={40}
                                                                                        />
                                                                                        <Stack>
                                                                                            <Typography variant="body2">
                                                                                                {item?.paymentMeans?.name}
                                                                                                {item?.data?.nb && (
                                                                                                    <span>{` N° ${item?.data?.nb}`}</span>
                                                                                                )}
                                                                                            </Typography>
                                                                                            <Typography
                                                                                                variant="subtitle1"
                                                                                                fontWeight={700}
                                                                                            >
                                                                                                {item.amount > 0
                                                                                                    ? item.amount
                                                                                                    : 0}
                                                                                                <Typography
                                                                                                    variant="caption"
                                                                                                    fontSize={14}
                                                                                                    ml={0.2}
                                                                                                >
                                                                                                    {" "}
                                                                                                    {devise}
                                                                                                </Typography>
                                                                                            </Typography>
                                                                                        </Stack>
                                                                                    </Stack>
                                                                                    {item?.paymentMeans?.slug ===
                                                                                        "check" && (
                                                                                            <List disablePadding>
                                                                                                <ListItem
                                                                                                    disablePadding
                                                                                                    sx={{
                                                                                                        justifyContent:
                                                                                                            "space-between",
                                                                                                    }}
                                                                                                >
                                                                                                    <Typography
                                                                                                        variant="body2">
                                                                                                        {t("table.name")}
                                                                                                    </Typography>
                                                                                                    <Typography
                                                                                                        fontSize={13}
                                                                                                        fontWeight={600}
                                                                                                    >
                                                                                                        {item?.data?.carrier}
                                                                                                    </Typography>
                                                                                                </ListItem>
                                                                                                <ListItem
                                                                                                    disablePadding
                                                                                                    sx={{
                                                                                                        justifyContent:
                                                                                                            "space-between",
                                                                                                    }}
                                                                                                >
                                                                                                    <Typography
                                                                                                        variant="body2">
                                                                                                        {t("name_of_bank")}
                                                                                                    </Typography>
                                                                                                    <Typography
                                                                                                        fontSize={13}
                                                                                                        fontWeight={600}
                                                                                                    >
                                                                                                        {item?.data?.bank
                                                                                                            ?.abbreviation || "--"}
                                                                                                    </Typography>
                                                                                                </ListItem>
                                                                                                <ListItem
                                                                                                    disablePadding
                                                                                                    sx={{
                                                                                                        justifyContent:
                                                                                                            "space-between",
                                                                                                    }}
                                                                                                >
                                                                                                    <Typography
                                                                                                        variant="body2">
                                                                                                        {t("cheque_date")}
                                                                                                    </Typography>
                                                                                                    <Stack
                                                                                                        direction="row"
                                                                                                        alignItems="center"
                                                                                                        spacing={0.5}
                                                                                                    >
                                                                                                        <IconUrl
                                                                                                            path="ic-agenda-jour"
                                                                                                            width={14}
                                                                                                            height={14}
                                                                                                        />
                                                                                                        <Typography
                                                                                                            fontSize={13}
                                                                                                            fontWeight={600}
                                                                                                        >
                                                                                                            {moment(
                                                                                                                item?.data?.date
                                                                                                            ).format("DD/MM/YYYY")}
                                                                                                        </Typography>
                                                                                                    </Stack>
                                                                                                </ListItem>
                                                                                            </List>
                                                                                        )}
                                                                                    {row?.payment_means?.length - 1 !==
                                                                                        idx && <Divider/>}
                                                                                </Stack>
                                                                            )
                                                                        )}
                                                                </Stack>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                    <Grid item md={8}>
                                                        <Card>
                                                            <CardHeader
                                                                title={
                                                                    <>
                                                                        <Typography fontWeight={600} mb={1.2}>
                                                                            {t("paid_consultation")}
                                                                        </Typography>
                                                                        <Divider/>
                                                                    </>
                                                                }
                                                            />
                                                            <CardContent>
                                                                {transaction_loading ? (
                                                                    <LinearProgress/>
                                                                ) : !!transaction_data.length ? (
                                                                    <Otable
                                                                        from="paid-consultation"
                                                                        rows={transaction_data}
                                                                        headers={headCells}
                                                                        t={t}
                                                                        tableWrapperStyle={{
                                                                            "&.table-wrapper":{
                                                                                p:0,
                                                                                ".MuiTableContainer-root":{
                                                                                    p:0
                                                                                }
                                                                            }
                                                                        }}
                                                                        devise={devise}
                                                                        loading={transaction_loading}
                                                                    />
                                                                ) : (
                                                                    <Box
                                                                        sx={{
                                                                            ".no-data-card": {
                                                                                mt: 0,
                                                                                pb: 2,
                                                                                svg: {
                                                                                    "&.injected-svg": {
                                                                                        height: 56,
                                                                                    },
                                                                                },
                                                                                ".MuiTypography-root": {
                                                                                    m: 0,
                                                                                },
                                                                            },
                                                                        }}
                                                                    >
                                                                        <NoDataCard
                                                                            t={t}
                                                                            ns={"payment"}
                                                                            data={noCardData}
                                                                        />
                                                                    </Box>
                                                                )}
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                </Grid>
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
