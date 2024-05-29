import React from "react";
import CardStyled from "./overrides/cardStyle";
import {
    Card,
    CardContent,
    IconButton,
    LinearProgress,
    Paper,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import moment from "moment-timezone";
import {Label} from "@features/label";
import CollapseStyled from "./overrides/collapseStyle";

export default function TransactionMobileCard({...props}) {
    const {
        row,
        theme,
        setOpenDeleteTransactionDialog,
        setSelected,
        devise,
        pmList,
        setCollapse,
        selectedRow,
        collapse,
        t,
        transaction_data,
        transaction_loading,
    } = props;

    return (
        <Stack width={1}>
            <CardStyled
                className={row.uuid === collapse ? "row-collapse" : ""}
                onClick={() => {
                    setCollapse(collapse === row.uuid ? null : row.uuid);
                    selectedRow(row.uuid);
                }}>
                <CardContent>
                    <Stack spacing={1}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between">
                            <Stack>
                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                    <IconUrl
                                        path="ic-agenda"
                                        width={12}
                                        height={12}
                                        color={theme.palette.text.primary}
                                    />
                                    <Typography variant="body2">
                                        {moment(row.date_transaction).format("DD/MM/YYYY")}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                    <IconUrl path="ic-time"/>
                                    <Typography variant="body2">
                                        {moment(row.date_transaction).format("HH:mm")}
                                    </Typography>
                                </Stack>
                            </Stack>
                            <IconButton
                                className="btn-del"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setSelected(row);
                                    setOpenDeleteTransactionDialog(true);
                                }}>
                                <IconUrl
                                    path="ic-delete"
                                    color={theme.palette.secondary.main}
                                />
                            </IconButton>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={3}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                                spacing={1}>
                                {row.payment_means &&
                                    row.payment_means.map((mean: any,index) => (
                                        <Tooltip key={mean.slug+index} title={`${mean.amount} ${devise}`}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                style={{width: 15}}
                                                src={
                                                    pmList.find(
                                                        (pm: { slug: string }) =>
                                                            pm.slug == mean.paymentMeans.slug
                                                    )?.logoUrl.url
                                                }
                                                alt={"payment means icon"}
                                            />
                                        </Tooltip>
                                    ))}
                                <Tooltip title={t("used")}>
                                    <Typography fontWeight={700} color="secondary">
                                        {row.amount - row.rest_amount} {devise}
                                    </Typography>
                                </Tooltip>
                                <Tooltip title={t("amount")}>
                                    <Typography fontWeight={700} color="secondary">
                                        {row.amount} {devise}
                                    </Typography>
                                </Tooltip>
                            </Stack>
                        </Stack>
                    </Stack>
                </CardContent>
            </CardStyled>
            <CollapseStyled in={row.uuid === collapse}>
                <Stack
                    spacing={0.5}
                    width={1}
                    className="collapse-wrapper"
                    {...(transaction_data.length < 1 && {
                        sx: {
                            "&:before": {
                                display: "none",
                            },
                        },
                    })}>
                    <Paper className="means-wrapper">
                        <Stack spacing={0.5}>
                            {row?.payment_means?.length > 0 &&
                                row.payment_means.map((item: any) => (
                                    <Stack
                                        key={item.uuid}
                                        spacing={1}
                                        border={1}
                                        borderColor="divider"
                                        borderRadius={0.5}
                                        padding={0.5}>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="space-between">
                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                <IconUrl
                                                    path="ic-agenda"
                                                    width={12}
                                                    height={12}
                                                    color={theme.palette.text.primary}
                                                />
                                                <Typography variant="body2">
                                                    {moment(item?.data?.date).format("DD/MM/YYYY")}
                                                </Typography>
                                            </Stack>

                                            <Typography variant="body2">
                                                {item?.data?.carrier}
                                            </Typography>
                                            <Typography variant="body2">
                                                {item.amount ? (
                                                    <>
                                                        {item.amount} {devise}
                                                    </>
                                                ) : (
                                                    ""
                                                )}
                                            </Typography>
                                        </Stack>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="space-between">
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Tooltip title={`${item.amount} ${devise}`}>
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        style={{width: 15}}
                                                        src={
                                                            pmList.find(
                                                                (pm: { slug: string }) =>
                                                                    pm.slug == item?.paymentMeans?.slug
                                                            )?.logoUrl.url
                                                        }
                                                        alt={"payment means icon"}
                                                    />
                                                </Tooltip>
                                                <Typography variant="body2">
                                                    {item?.paymentMeans?.name || ""}
                                                </Typography>
                                            </Stack>
                                            <Typography variant="body2">
                                                {item?.data?.bank?.abbreviation || ""}
                                            </Typography>
                                            <Typography variant="body2">
                                                {item?.data?.nb ? ` N° ${item?.data?.nb}` : ""}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                ))}
                        </Stack>
                    </Paper>
                    {transaction_loading && <LinearProgress/>}
                    {transaction_data.length > 0 &&
                        transaction_data.map((transaction: any) => (
                            <Card className="consultation-card" key={transaction.uuid}>
                                <CardContent>
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="flex-start">
                                        <Stack
                                            spacing={1}
                                            width={1}
                                            alignItems="flex-start"
                                            direction={"column"}>
                                            <Typography fontWeight={700}>
                                                {transaction?.appointment?.type?.name}
                                            </Typography>
                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                <IconUrl
                                                    path="ic-agenda"
                                                    width={12}
                                                    height={12}
                                                    color={theme.palette.text.primary}
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
                                            }}>
                                            <Label
                                                variant="filled"
                                                color={
                                                    transaction?.amount ===
                                                    transaction?.amount?.restAmount
                                                        ? "error"
                                                        : "success"
                                                }>
                                                {t("total")}
                                                <strong>{transaction?.amount}</strong>
                                                {devise}
                                            </Label>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))}
                </Stack>
            </CollapseStyled>
        </Stack>
    );
}
