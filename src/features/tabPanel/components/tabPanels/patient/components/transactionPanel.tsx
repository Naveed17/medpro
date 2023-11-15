import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  useTheme,
  Theme,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PanelStyled from "./overrides/panelStyle";
import { useTranslation } from "next-i18next";
import { useRequestQuery, useRequestQueryMutation } from "@lib/axios";
import { useAppSelector } from "@lib/redux/hooks";
import { useInvalidateQueries, useMedicalEntitySuffix } from "@lib/hooks";
import { useInsurances } from "@lib/hooks/rest";
import { cashBoxSelector } from "@features/leftActionBar/components/cashbox";
import { configSelector, dashLayoutSelector } from "@features/base";
import { ReactQueryNoValidateConfig } from "@lib/axios/useRequestQuery";
import { Label } from "@features/label";
import IconUrl from "@themes/urlIcon";
import moment from "moment-timezone";
import CloseIcon from "@mui/icons-material/Close";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog } from "@features/dialog";
import { LoadingButton } from "@mui/lab";
interface StateProps {
  from: Date | null;
  to: Date | null;
}
function TransactionPanel({ ...props }) {
  const { patient, rest, devise, router } = props;
  const theme: Theme = useTheme();
  const { insurances } = useInsurances();
  const { urlMedicalEntitySuffix } = useMedicalEntitySuffix();
  const { medicalEntityHasUser } = useAppSelector(dashLayoutSelector);
  const { trigger: invalidateQueries } = useInvalidateQueries();
  const [collapse, setCollapse] = useState<any>(null);
  const { t } = useTranslation(["payment", "common"]);
  const { selectedBoxes } = useAppSelector(cashBoxSelector);
  const [transaction_data, setTransaction_data] = useState<any[]>([]);
  const [transaction_loading, setTransaction_loading] =
    useState<boolean>(false);
  const [loadingDeleteTransaction, setLoadingDeleteTransaction] =
    useState(false);
  const [openDeleteTransactionDialog, setOpenDeleteTransactionDialog] =
    useState(false);
  const [selected, setSelected] = useState<any>(null);
  const { trigger } = useRequestQueryMutation("/payment/cashbox");
  const variants = {
    open: { height: "auto", opacity: 1 },
    closed: { height: 0, opacity: 0 },
  };
  const mutatePatientWallet = () => {
    medicalEntityHasUser &&
      selected.appointment &&
      invalidateQueries([
        `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${selected.appointment.patient?.uuid}/wallet/${router.locale}`,
      ]);
  };
  const { data: paymentMeansHttp } = useRequestQuery(
    {
      method: "GET",
      url: `/api/public/payment-means/${router.locale}`,
    },
    ReactQueryNoValidateConfig
  );

  const {
    data: httpTransactionsResponse,
    mutate: mutateTransactions,
    isLoading,
  } = useRequestQuery(
    patient
      ? {
          method: "GET",
          url: `${urlMedicalEntitySuffix}/transactions/${router.locale}`,
        }
      : null,
    {
      keepPreviousData: true,
      ...(patient && {
        variables: {
          query: `?cashboxes=${selectedBoxes[0].uuid}&patient=${patient.uuid}`,
        },
      }),
    }
  );
  const deleteTransaction = () => {
    const form = new FormData();
    form.append("cash_box", selectedBoxes[0]?.uuid);

    trigger(
      {
        method: "DELETE",
        url: `${urlMedicalEntitySuffix}/transactions/${selected?.uuid}/${router.locale}`,
        data: form,
      },
      {
        onSuccess: () => {
          mutateTransactions();
          mutatePatientWallet();
          setLoadingDeleteTransaction(false);
          setOpenDeleteTransactionDialog(false);
        },
      }
    );
  };
  const pmList = (paymentMeansHttp as HttpResponse)?.data ?? [];
  const rows =
    (httpTransactionsResponse as HttpResponse)?.data?.transactions ?? [];
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
    <PanelStyled>
      {isLoading && <LinearProgress />}
      {!isLoading && (
        <CardContent>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            borderBottom={1}
            borderColor="divider"
            pb={1.2}
            mb={1.2}
          >
            <Typography fontWeight={600}>{t("transactions")}</Typography>
            <Button
              startIcon={<IconUrl path="ic-argent" />}
              variant="contained"
            >
              {t("add_payment")}
            </Button>
          </Stack>
          {rows.length > 0 && (
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box width={50} />
              <table className="payment-table">
                <thead>
                  <tr>
                    <th></th>
                    <th align="left">{t("date_time")}</th>
                    <th>{t("payment_method")}</th>
                    <th>{t("used")}</th>
                    <th>{t("amount")}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows?.map((row: any, index: number) => (
                    <React.Fragment key={row.uuid}>
                      <tr
                        className={`payment-table-row ${
                          row.uuid === collapse ? "row-collapse" : ""
                        }`}
                        key={row.uuid}
                        onClick={() => {
                          setCollapse(collapse === row.uuid ? null : row.uuid);
                          selectedRow(row.uuid);
                        }}
                      >
                        <td>
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
                              {moment(row.date_transaction).format(
                                "DD/MM/YYYY"
                              )}
                            </Typography>
                            <IconUrl path="ic-time" />
                            <Typography variant="body2">
                              {moment(row.date_transaction).format("HH:mm")}
                            </Typography>
                          </Stack>
                        </td>
                        <td>
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                            spacing={1}
                          >
                            {row.payment_means &&
                              row.payment_means.map((mean: any) => (
                                <Tooltip
                                  key={mean.slug}
                                  title={`${mean.amount} ${devise}`}
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    style={{ width: 15 }}
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
                              ))}
                          </Stack>
                        </td>
                        <td>
                          <Typography fontWeight={700} color="secondary">
                            {row.rest_amount}
                          </Typography>
                        </td>
                        <td>
                          <Typography fontWeight={700} color="secondary">
                            {row.amount} {devise}
                          </Typography>
                        </td>
                        <td>
                          <IconButton
                            className="btn-del"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelected(row);
                              setOpenDeleteTransactionDialog(true);
                            }}
                          >
                            <IconUrl
                              path="ic-delete"
                              color={theme.palette.secondary.main}
                            />
                          </IconButton>
                        </td>
                      </tr>

                      {row.uuid === collapse && (
                        <motion.tr
                          key={row.uuid}
                          animate={collapse === row.uuid ? "open" : "closed"}
                          variants={variants}
                          initial="closed"
                          transition={{ duration: 0.3 }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <td colSpan={6}>
                            <Stack
                              spacing={1.2}
                              mt={-1.2}
                              ml={0.2}
                              mr={-0.05}
                              className="collapse-wrapper"
                              {...(transaction_data.length < 1 && {
                                sx: {
                                  "&:before": {
                                    display: "none",
                                  },
                                },
                              })}
                            >
                              <Paper className="means-wrapper">
                                <Stack spacing={0.5}>
                                  {row?.payment_means?.length > 0 &&
                                    row.payment_means.map((item: any) => (
                                      <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        width={1}
                                        key={item.uuid}
                                      >
                                        <Stack
                                          direction="row"
                                          alignItems="center"
                                          spacing={4}
                                          width={1}
                                          sx={{ flex: 1 }}
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
                                                style={{ width: 15 }}
                                                src={
                                                  pmList.find(
                                                    (pm: { slug: string }) =>
                                                      pm.slug ==
                                                      item?.paymentMeans?.slug
                                                  )?.logoUrl.url
                                                }
                                                alt={"payment means icon"}
                                              />
                                            </Tooltip>
                                            <Typography variant="body2">
                                              {item?.paymentMeans?.name || "--"}
                                            </Typography>
                                          </Stack>
                                          <Typography variant="body2" width={1}>
                                            {item?.data?.bank?.abbreviation ||
                                              "--"}
                                          </Typography>
                                          <Typography variant="body2" width={1}>
                                            {item?.data?.nb
                                              ? ` N° ${item?.data?.nb}`
                                              : "--"}
                                          </Typography>
                                        </Stack>
                                        <Stack
                                          sx={{ flex: 1 }}
                                          direction="row"
                                          alignItems="center"
                                          spacing={4}
                                          width={1}
                                        >
                                          <Typography variant="body2" width={1}>
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
                                              color={theme.palette.text.primary}
                                            />
                                            <Typography variant="body2">
                                              {moment(item?.data?.date).format(
                                                "DD/MM/YYYY"
                                              ) || "--"}
                                            </Typography>
                                          </Stack>
                                          <Typography variant="body2" width={1}>
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
                              </Paper>
                              {transaction_loading && <LinearProgress />}
                              {transaction_data.length > 0 &&
                                transaction_data.map((transaction) => (
                                  <Card
                                    className="consultation-card"
                                    key={transaction.uuid}
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
                                          <Typography fontWeight={700}>
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
                                              color={theme.palette.text.primary}
                                            />
                                            <Typography variant="body2">
                                              {transaction?.payment_date}
                                            </Typography>
                                            <IconUrl path="ic-time" />
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
                                          sx={{
                                            span: {
                                              fontSize: 14,
                                              strong: {
                                                mx: 0.5,
                                              },
                                            },
                                          }}
                                        >
                                          <Label variant="filled" color="info">
                                            {t("total")}
                                            <strong>
                                              {transaction?.amount}
                                            </strong>
                                            {devise}
                                          </Label>
                                          <Label
                                            variant="filled"
                                            color="success"
                                          >
                                            {t("paid_amount")}
                                            <strong>400</strong>
                                            {devise}
                                          </Label>
                                        </Stack>
                                      </Stack>
                                    </CardContent>
                                  </Card>
                                ))}
                            </Stack>
                          </td>
                        </motion.tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </Stack>
          )}
        </CardContent>
      )}
      <Dialog
        action="delete-transaction"
        title={t("dialogs.delete-dialog.title")}
        open={openDeleteTransactionDialog}
        size="sm"
        data={{ t }}
        color={theme.palette.error.main}
        actionDialog={
          <Stack direction="row" spacing={1}>
            <Button
              onClick={() => {
                setLoadingDeleteTransaction(false);
                setOpenDeleteTransactionDialog(false);
              }}
              startIcon={<CloseIcon />}
            >
              {t("cancel")}
            </Button>
            <LoadingButton
              variant="contained"
              loading={loadingDeleteTransaction}
              color="error"
              onClick={deleteTransaction}
              startIcon={<IconUrl path="setting/icdelete" color="white" />}
            >
              {t("delete")}
            </LoadingButton>
          </Stack>
        }
      />
    </PanelStyled>
  );
}

export default TransactionPanel;
