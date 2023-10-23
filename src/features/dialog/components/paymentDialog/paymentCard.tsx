import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import AddIcon from "@mui/icons-material/Add";
import { motion } from "framer-motion";
import CheckCard from "./checkCard";
import CheckBoxIcon from "@mui/icons-material/Check";
import moment from "moment-timezone";
function PaymentCard({ ...props }) {
  const { t, paymentTypesList, item, i, formik, devise, wallet } = props;
  const { setFieldValue, values } = formik;
  const theme: Theme = useTheme();
  const [cashCollapse, setCashCollapse] = useState(true);
  const [walletCollapse, setWalletCollapse] = useState(true);
  const addCheck = () =>
    setFieldValue(`paymentMethods[${i}].check`, [
      ...values.paymentMethods[i].check,
      {
        amount: "",
        carrier: "",
        bank: "",
        check_number: "",
        payment_date: new Date(),
        expiry_date: new Date(),
      },
    ]);
  return (
    <Card className={cashCollapse && walletCollapse ? "payment-card" : ""}>
      <CardContent>
        <Stack spacing={2}>
          <Stack
            component={motion.div}
            animate={{ opacity: item?.selected === "cash" ? 1 : 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: item?.selected === "cash" ? "block" : "none" }}
          >
            <Collapse in={cashCollapse} timeout="auto" unmountOnExit>
              <Stack direction="row" alignItems="center" spacing={1}>
                <FormControl
                  size="small"
                  sx={{
                    minWidth: 60,

                    ".MuiInputBase-root": {
                      bgcolor: (theme: Theme) =>
                        theme.palette.primary.main + "!important",
                      svg: {
                        path: {
                          fill: (theme: Theme) => theme.palette.common.white,
                        },
                      },
                      img: {
                        filter: "brightness(0) invert(1)",
                      },
                      "&:focus": {
                        bgcolor: "primary.main",
                      },
                    },
                  }}
                >
                  <Select
                    labelId="select-type"
                    id="select-type"
                    value={values.paymentMethods[i].selected}
                    displayEmpty
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: (theme: Theme) => theme.palette.back.main,
                          p: 1,
                          ".MuiMenuItem-root": {
                            "&:not(:last-child)": {
                              mb: 1,
                            },
                            borderRadius: 1,
                            border: 1,
                            borderColor: "divider",
                            "&:hover": {
                              bgcolor: (theme: Theme) =>
                                theme.palette.primary.main,
                              color: (theme: Theme) =>
                                theme.palette.common.white,
                              img: {
                                filter: "brightness(0) invert(1)",
                              },
                              ".MuiTypography-root": {
                                color: theme.palette.common.white,
                              },
                            },
                          },
                        },
                      },
                    }}
                    onChange={(e) =>
                      setFieldValue(
                        `paymentMethods.${i}.selected`,
                        e.target.value
                      )
                    }
                    renderValue={(selected) => {
                      const payment = paymentTypesList?.find(
                        (payment: any) => payment?.slug === selected
                      );
                      if (selected === "wallet") {
                        return (
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              style={{ width: 16 }}
                              src={"/static/icons/ic-wallet-money.svg"}
                              alt={"payment means"}
                            />
                          </Stack>
                        );
                      }

                      return (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            style={{ width: 16 }}
                            src={payment?.logoUrl?.url}
                            alt={"payment means"}
                          />
                        </Stack>
                      );
                    }}
                  >
                    {paymentTypesList?.map((payment: any) => (
                      <MenuItem value={payment.slug} key={payment.uuid}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            style={{ width: 16 }}
                            src={payment?.logoUrl?.url}
                            alt={"payment means"}
                          />
                          <Typography>{t(payment?.name)}</Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                    {wallet > 0 ? (
                      <MenuItem value={"wallet"}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            style={{ width: 16 }}
                            src={"/static/icons/ic-wallet-money.svg"}
                            alt={"payment means"}
                          />
                          <Typography>{t("wallet")}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {wallet} {devise}
                          </Typography>
                        </Stack>
                      </MenuItem>
                    ) : null}
                  </Select>
                </FormControl>
                <TextField
                  sx={{
                    input: {
                      fontWeight: 700,
                    },
                  }}
                  size="small"
                  fullWidth
                  value={values.paymentMethods[i].cash.amount}
                  onChange={(e) =>
                    setFieldValue(
                      `paymentMethods.${i}.cash.amount`,
                      e.target.value
                    )
                  }
                  type="number"
                  InputProps={{
                    inputProps: {
                      min: 0,
                    },
                  }}
                />
                <Typography>{devise}</Typography>
                {i > 0 && (
                  <IconButton
                    className="btn-del"
                    onClick={() => {
                      setFieldValue(
                        "paymentMethods",
                        values.paymentMethods.filter(
                          (payment: any, index: number) => index !== i
                        )
                      );
                    }}
                  >
                    <IconUrl path={"setting/icdelete"} />
                  </IconButton>
                )}
                <IconButton
                  onClick={() => {
                    setCashCollapse(false);
                  }}
                  className="btn-check-success"
                >
                  <CheckBoxIcon />
                </IconButton>
              </Stack>
            </Collapse>
            <Collapse in={!cashCollapse} timeout="auto" unmountOnExit>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>{t("payment_info")}</Typography>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <IconButton
                      size="small"
                      className="btn-action"
                      onClick={() => setCashCollapse(true)}
                    >
                      <IconUrl path="ic-edit" />
                    </IconButton>
                    {i > 0 && (
                      <IconButton
                        size="small"
                        className="btn-action"
                        onClick={() =>
                          setFieldValue(
                            `paymentMethods`,
                            values.paymentMethods.splice(0, i)
                          )
                        }
                      >
                        <IconUrl path="setting/icdelete" />
                      </IconButton>
                    )}
                  </Stack>
                </Stack>
                <table className="method-table">
                  <thead>
                    <tr>
                      <th align="left">{t("table.date")}</th>
                      <th align="center">{t("method")}</th>
                      <th align="right">{t("amount")} (DT)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td align="left">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}
                          >
                            <IconUrl
                              path={"ic-agenda"}
                              width={12}
                              height={12}
                              color={theme.palette.text.secondary}
                            />
                            <Typography variant="body2">
                              {moment(new Date(), "DD-MM-YYYY HH:mm").format(
                                "DD-MM-YYYY"
                              )}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}
                          >
                            <IconUrl
                              path={"ic-time"}
                              width={12}
                              height={12}
                              color={theme.palette.text.secondary}
                            />
                            <Typography variant="body2">
                              {moment(new Date(), "DD-MM-YYYY HH:mm").format(
                                "HH:MM"
                              )}
                            </Typography>
                          </Stack>
                        </Stack>
                      </td>
                      <td align="center">{t(item.selected)}</td>
                      <td align="right">{item.cash.amount}</td>
                    </tr>
                  </tbody>
                </table>
              </Stack>
            </Collapse>
          </Stack>
          <Stack
            spacing={2}
            component={motion.div}
            animate={{ opacity: item?.selected === "check" ? 1 : 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: item?.selected === "check" ? "block" : "none" }}
          >
            {item?.check.map((check: any, idx: any) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CheckCard
                  {...{
                    formik,
                    i,
                    t,
                    devise,
                    item,
                    idx,
                    check,
                    paymentTypesList,
                    wallet,
                  }}
                />
              </motion.div>
            ))}

            <Button size="small" startIcon={<AddIcon />} onClick={addCheck}>
              {t("add_check")}
            </Button>
          </Stack>
          <Stack
            component={motion.div}
            animate={{ opacity: item?.selected === "wallet" ? 1 : 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: item?.selected === "wallet" ? "block" : "none" }}
          >
            <Collapse in={walletCollapse} timeout="auto" unmountOnExit>
              <Stack direction="row" alignItems="center" spacing={1}>
                <FormControl
                  size="small"
                  sx={{
                    minWidth: 60,

                    ".MuiInputBase-root": {
                      bgcolor: (theme: Theme) =>
                        theme.palette.primary.main + "!important",
                      svg: {
                        path: {
                          fill: (theme: Theme) => theme.palette.common.white,
                        },
                      },
                      img: {
                        filter: "brightness(0) invert(1)",
                      },
                      "&:focus": {
                        bgcolor: "primary.main",
                      },
                    },
                  }}
                >
                  <Select
                    labelId="select-type"
                    id="select-type"
                    value={values.paymentMethods[i].selected}
                    displayEmpty
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: (theme: Theme) => theme.palette.back.main,
                          p: 1,
                          ".MuiMenuItem-root": {
                            "&:not(:last-child)": {
                              mb: 1,
                            },
                            borderRadius: 1,
                            border: 1,
                            borderColor: "divider",
                            "&:hover": {
                              bgcolor: (theme: Theme) =>
                                theme.palette.primary.main,
                              color: (theme: Theme) =>
                                theme.palette.common.white,
                              img: {
                                filter: "brightness(0) invert(1)",
                              },
                            },
                          },
                        },
                      },
                    }}
                    onChange={(e) =>
                      setFieldValue(
                        `paymentMethods.${i}.selected`,
                        e.target.value
                      )
                    }
                    renderValue={(selected) => {
                      const payment = paymentTypesList?.find(
                        (payment: any) => payment?.slug === selected
                      );
                      if (selected === "wallet") {
                        return (
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              style={{ width: 16 }}
                              src={"/static/icons/ic-wallet-money.svg"}
                              alt={"payment means"}
                            />
                          </Stack>
                        );
                      }

                      return (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            style={{ width: 16 }}
                            src={payment?.logoUrl?.url}
                            alt={"payment means"}
                          />
                        </Stack>
                      );
                    }}
                  >
                    {paymentTypesList?.map((payment: any) => (
                      <MenuItem value={payment.slug} key={payment.uuid}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            style={{ width: 16 }}
                            src={payment?.logoUrl?.url}
                            alt={"payment means"}
                          />
                          <Typography>{t(payment?.name)}</Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                    {wallet > 0 ? (
                      <MenuItem value={"wallet"}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            style={{ width: 16 }}
                            src={"/static/icons/ic-wallet-money.svg"}
                            alt={"payment means"}
                          />
                          <Typography>{t("wallet")}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {wallet} {devise}
                          </Typography>
                        </Stack>
                      </MenuItem>
                    ) : null}
                  </Select>
                </FormControl>
                <TextField
                  sx={{
                    input: {
                      fontWeight: 700,
                    },
                  }}
                  size="small"
                  fullWidth
                  value={values.paymentMethods[i].wallet}
                  onChange={(e) =>
                    setFieldValue(`paymentMethods.${i}.wallet`, e.target.value)
                  }
                  type="number"
                  InputProps={{
                    inputProps: {
                      min: 0,
                    },
                  }}
                />
                <Typography>{devise}</Typography>
                {i > 0 && (
                  <IconButton
                    className="btn-del"
                    onClick={() => {
                      setFieldValue(
                        "paymentMethods",
                        values.paymentMethods.filter(
                          (payment: any, index: number) => index !== i
                        )
                      );
                    }}
                  >
                    <IconUrl path={"setting/icdelete"} />
                  </IconButton>
                )}
                <IconButton
                  onClick={() => setWalletCollapse(!walletCollapse)}
                  className="btn-check-success"
                >
                  <CheckBoxIcon />
                </IconButton>
              </Stack>
            </Collapse>
            <Collapse in={!walletCollapse} timeout="auto" unmountOnExit>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>{t("payment_info")}</Typography>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <IconButton
                      size="small"
                      className="btn-action"
                      onClick={() => setWalletCollapse(true)}
                    >
                      <IconUrl path="ic-edit" />
                    </IconButton>
                    {i > 0 && (
                      <IconButton
                        size="small"
                        className="btn-action"
                        onClick={() =>
                          setFieldValue(
                            `paymentMethods`,
                            values.paymentMethods.splice(0, i)
                          )
                        }
                      >
                        <IconUrl path="setting/icdelete" />
                      </IconButton>
                    )}
                  </Stack>
                </Stack>
                <table className="method-table">
                  <thead>
                    <tr>
                      <th align="left">{t("table.date")}</th>
                      <th align="center">{t("method")}</th>
                      <th align="right">{t("amount")} (DT)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td align="left">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}
                          >
                            <IconUrl
                              path={"ic-agenda"}
                              width={12}
                              height={12}
                              color={theme.palette.text.secondary}
                            />
                            <Typography variant="body2">
                              {moment(new Date(), "DD-MM-YYYY HH:mm").format(
                                "DD-MM-YYYY"
                              )}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}
                          >
                            <IconUrl
                              path={"ic-time"}
                              width={12}
                              height={12}
                              color={theme.palette.text.secondary}
                            />
                            <Typography variant="body2">
                              {moment(new Date(), "DD-MM-YYYY HH:mm").format(
                                "HH:MM"
                              )}
                            </Typography>
                          </Stack>
                        </Stack>
                      </td>
                      <td align="center">{t(item.selected)}</td>
                      <td align="right">{item.wallet}</td>
                    </tr>
                  </tbody>
                </table>
              </Stack>
            </Collapse>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default PaymentCard;
