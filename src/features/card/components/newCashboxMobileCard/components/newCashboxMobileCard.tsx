import React, {useState} from "react";
import CardStyled from "./overrides/cardStyle";
import {
    Card,
    CardContent,
    Divider,
    IconButton,
    LinearProgress,
    Link,
    List,
    ListItem,
    Paper,
    Stack,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import moment from "moment-timezone";
import {Label} from "@features/label";
import CollapseStyled from "./overrides/collapseStyle";
import {useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {ConditionalWrapper, useMedicalEntitySuffix} from "@lib/hooks";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {ImageHandler} from "@features/image";

export default function NewCashboxMobileCard({...props}) {
    const {row, devise, pmList, t, handleEvent} = props;
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const [collapse, setCollapse] = useState<any>(null);
    const theme = useTheme();
    const [transaction_data, setTransaction_data] = useState<any[]>([]);
    const [transaction_loading, setTransaction_loading] = useState<boolean>(false);
    const {trigger} = useRequestQueryMutation("/payment/cashbox");
    const selectedRow = (props: string) => {
        setTransaction_data([]);
        setTransaction_loading(true);
        trigger(
            {
                method: "GET",
                url: `${urlMedicalEntitySuffix}/transactions/${props}/transaction-data/${router.locale}`,
            },
            {
                onSuccess: (res) => {
                    setTransaction_data(res.data.data);
                    setTransaction_loading(false);
                },
            }
        );
    };
    return (
        <Stack width={1}>
            <CardStyled
                className={row.uuid === collapse ? "row-collapse" : ""}
                onClick={() => {
                    setCollapse(collapse === row.uuid ? null : row.uuid);
                    selectedRow(row.uuid);
                }}
            >
                <CardContent>
                    <Stack spacing={1}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                    <IconUrl
                                        path="ic-agenda-jour"
                                        width={12}
                                        height={12}
                                        color={theme.palette.text.primary}
                                    />
                                    <Typography variant="body2">
                                        {moment(row.date_transaction).format("DD/MM/YYYY")}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                    <IconUrl path="ic-time" width={12} height={12}/>
                                    <Typography variant="body2">
                                        {moment(row.date_transaction).format("HH:mm")}
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Tooltip title={t("more")}>
                                <IconButton size="small" disableRipple>
                                    <ExpandMoreIcon
                                        sx={{
                                            transform: collapse === row.uuid ? "rotate(180deg)" : "",
                                            transition: "transform 0.2s ease-in-out",
                                            borderRadius: 1,
                                            border: 1,
                                            borderColor: "divider",
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            {row.patient && (
                                <ConditionalWrapper
                                    condition={!row.patient?.isArchived}
                                    wrapper={(children: any) => (
                                        <Link
                                            sx={{cursor: "pointer", fontSize: 14}}
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

                            {row.payment_means &&
                                row.payment_means.map((mean: any) => (
                                    <Stack key={`${mean.uuid}-mobile`} direction="row" alignItems="center"
                                           spacing={0.5}>
                                        <Tooltip
                                            key={mean.uuid + "mobile"}
                                            title={`${mean.amount} ${devise}`}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                style={{width: 15}}
                                                key={mean.slug}
                                                src={
                                                    pmList.find(
                                                        (pm: { slug: string }) =>
                                                            pm.slug == mean.paymentMeans.slug
                                                    )?.logoUrl.url
                                                }
                                                alt={"payment means icon"}
                                            />
                                        </Tooltip>
                                        <Tooltip title={t("amount")}>
                                            <Typography fontWeight={700} color="secondary">
                                                {mean.amount || 0} {devise}
                                            </Typography>
                                        </Tooltip>
                                    </Stack>
                                ))}
                        </Stack>
                    </Stack>
                </CardContent>
            </CardStyled>
            <CollapseStyled in={row.uuid === collapse}>
                <Stack spacing={0.5} width={1} className="collapse-wrapper">
                    <Paper className="means-wrapper">
                        <Stack
                            spacing={2}
                            mb={transaction_data.length > 0 || transaction_loading ? 2.5 : 0}
                        >
                            {row?.payment_means?.length > 0 &&
                                row.payment_means.map((item: any, idx: number) => (
                                    <Stack width={1} key={item.uuid + "pmeans"} spacing={2}>
                                        <Stack direction="row" alignItems="flex-start" spacing={1}>
                                            <ImageHandler
                                                src={`/static/icons/${
                                                    item?.paymentMeans?.slug === "cash"
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
                                                <Typography variant="subtitle1" fontWeight={700}>
                                                    {item.amount > 0 ? item.amount : 0}
                                                    <Typography variant="caption" fontSize={14} ml={0.2}>
                                                        {" "}
                                                        {devise}
                                                    </Typography>
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        {item?.paymentMeans?.slug === "check" && (
                                            <List disablePadding>
                                                <ListItem
                                                    disablePadding
                                                    sx={{
                                                        justifyContent: "space-between",
                                                    }}
                                                >
                                                    <Typography variant="body2">
                                                        {t("table.name")}
                                                    </Typography>
                                                    <Typography fontSize={13} fontWeight={600}>
                                                        {item?.data?.carrier}
                                                    </Typography>
                                                </ListItem>
                                                <ListItem
                                                    disablePadding
                                                    sx={{
                                                        justifyContent: "space-between",
                                                    }}
                                                >
                                                    <Typography variant="body2">
                                                        {t("name_of_bank")}
                                                    </Typography>
                                                    <Typography fontSize={13} fontWeight={600}>
                                                        {item?.data?.bank?.abbreviation || "--"}
                                                    </Typography>
                                                </ListItem>
                                                <ListItem
                                                    disablePadding
                                                    sx={{
                                                        justifyContent: "space-between",
                                                    }}
                                                >
                                                    <Typography variant="body2">
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
                                                        <Typography fontSize={13} fontWeight={600}>
                                                            {moment(item?.data?.date).format("DD/MM/YYYY")}
                                                        </Typography>
                                                    </Stack>
                                                </ListItem>
                                            </List>
                                        )}
                                        {row?.payment_means?.length - 1 !== idx && <Divider/>}
                                    </Stack>
                                ))}
                        </Stack>
                        {collapse && transaction_loading && <LinearProgress/>}
                        {transaction_data.length > 0 &&
                            transaction_data.map((transaction: any) => (
                                <Card
                                    className="consultation-card"
                                    key={transaction.uuid + "mobile"}
                                >
                                    <CardContent>
                                        <Stack
                                            direction={{xs: "column", sm: "row"}}
                                            spacing={{xs: 0.5, sm: 0}}
                                            justifyContent={{xs: "flex-start", sm: "space-between"}}
                                        >
                                            <Stack
                                                spacing={1}
                                                alignItems="flex-start"
                                                direction={"row"}
                                            >
                                                <Typography fontWeight={700}>
                                                    {transaction?.appointment?.type?.name}
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
                                                        color={theme.palette.text.primary}
                                                    />
                                                    <Typography variant="body2">
                                                        {transaction?.payment_date}
                                                    </Typography>
                                                    <IconUrl path="ic-time" width={12} height={12}/>
                                                    <Typography variant="body2">
                                                        {transaction?.payment_time}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                            <Stack
                                                spacing={1}
                                                alignItems="center"
                                                direction="row"
                                                justifyContent="flex-start"
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
                                                        transaction?.amount?.restAmount
                                                            ? "error"
                                                            : "success"
                                                    }
                                                >
                                                    {t("total")}
                                                    <strong>{transaction?.amount}</strong>
                                                    {devise}
                                                </Label>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            ))}
                    </Paper>
                </Stack>
            </CollapseStyled>
        </Stack>
    );
}
