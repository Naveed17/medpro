import {
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
  TextField,
  Grid,
  Autocomplete,
  Divider,
  MenuItem,
  Collapse,
  FormControl,
  Theme,
  Select,
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import React, { useState } from "react";
import CheckBoxIcon from "@mui/icons-material/Check";
import useBanks from "@lib/hooks/rest/useBanks";
import { DatePicker } from "@features/datepicker";
import { filterReasonOptions } from "@lib/hooks";
import moment from "moment-timezone";
function CheckCard({ ...props }) {
  const { t, idx, check, devise, formik, i, wallet, paymentTypesList } = props;
  const { getFieldProps, values, setFieldValue } = formik;
  const [expand, setExpand] = useState(true);
  const { banks } = useBanks();
  return (
    <Stack className="check-container">
      <Collapse in={expand}>
        <Stack spacing={2}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            width={{ xs: 1, sm: "100%" }}
          >
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
                          bgcolor: (theme: Theme) => theme.palette.primary.main,
                          color: (theme: Theme) => theme.palette.common.white,
                          img: {
                            filter: "brightness(0) invert(1)",
                          },
                        },
                      },
                    },
                  },
                }}
                onChange={(e) =>
                  setFieldValue(`paymentMethods.${i}.selected`, e.target.value)
                }
                renderValue={(selected) => {
                  const payment = paymentTypesList?.find(
                    (payment: any) => payment?.slug === selected
                  );
                  if (selected === "wallet") {
                    return (
                      <Stack direction="row" alignItems="center" spacing={1}>
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
              variant="outlined"
              placeholder={t("amount")}
              {...getFieldProps(`paymentMethods[${i}].check[${idx}].amount`)}
              fullWidth
              type="number"
              required
            />
            <Typography>{devise}</Typography>
            {i > 0 && idx === 0 && (
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
              className="btn-check-success"
              onClick={() => setExpand(false)}
            >
              <CheckBoxIcon />
            </IconButton>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            spacing={2}
          >
            <Stack spacing={0.5} width={1}>
              <Typography variant="body2" color="text.secondary">
                {t("carrier")}
              </Typography>
              <TextField
                variant="outlined"
                placeholder={t("carrier")}
                fullWidth
                type="text"
                {...getFieldProps(`paymentMethods[${i}].check[${idx}].carrier`)}
                required
              />
            </Stack>
            <Stack spacing={0.5} width={1}>
              <Typography variant="body2" color="text.secondary">
                {t("bank")}
              </Typography>
              <Autocomplete
                id={"banks"}
                freeSolo
                fullWidth
                autoHighlight
                disableClearable
                placeholder={t("bank")}
                size="small"
                value={values[`paymentMethods[${i}].check[${idx}].bank`]}
                onChange={(e, newValue: any) => {
                  e.stopPropagation();
                  let res: string;
                  if (newValue.inputValue) res = newValue.inputValue;
                  else res = newValue.name;
                  setFieldValue(`paymentMethods[${i}]check[${idx}].bank`, res);
                }}
                filterOptions={(options, params) =>
                  filterReasonOptions(options, params, t)
                }
                sx={{ color: "text.secondary" }}
                options={banks ? banks : []}
                loading={banks?.length === 0}
                getOptionLabel={(option) => {
                  return option.name;
                }}
                isOptionEqualToValue={(option: any, value) =>
                  option.name === value?.name
                }
                renderOption={(props, option) => (
                  <Stack key={option.uuid ? option.uuid : "-1"}>
                    {!option.uuid && <Divider />}
                    <MenuItem {...props} value={option.uuid}>
                      {!option.uuid && <AddOutlinedIcon />}
                      {option.name}
                    </MenuItem>
                  </Stack>
                )}
                renderInput={(params) => (
                  <TextField
                    color={"info"}
                    {...params}
                    placeholder={"--"}
                    sx={{ paddingLeft: 0 }}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Stack>
          </Stack>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            spacing={2}
          >
            <Stack spacing={0.5} width={1}>
              <Typography variant="body2" color="text.secondary">
                {t("check_number")}
              </Typography>
              <TextField
                variant="outlined"
                placeholder={t("check_number")}
                fullWidth
                type="number"
                {...getFieldProps(
                  `paymentMethods[${i}].check[${idx}].check_number`
                )}
                required
              />
            </Stack>
            <Stack spacing={0.5} width={1}>
              <Typography variant="body2" color="text.secondary">
                {t("payment_date")}
              </Typography>
              <DatePicker
                value={values.paymentMethods[i].check[idx].payment_date}
                onChange={(newValue: any) => {
                  setFieldValue(
                    `paymentMethods[${i}].check[${idx}].payment_date`,
                    new Date(newValue)
                  );
                }}
              />
            </Stack>
          </Stack>
        </Stack>
      </Collapse>
      <Collapse in={!expand}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems="center"
                justifyContent="space-between"
                spacing={{ xs: 1, sm: 0 }}
              >
                <Typography
                  display="inline-flex"
                  alignItems="center"
                  variant="subtitle2"
                >
                  #{idx + 1}
                  <Typography variant="body1" ml={2}>
                    {t("check_title")}
                  </Typography>
                </Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <IconButton
                    size="small"
                    className="btn-action"
                    onClick={() => setExpand(true)}
                  >
                    <IconUrl path="ic-edit" />
                  </IconButton>
                  {idx > 0 && (
                    <IconButton
                      size="small"
                      className="btn-action"
                      onClick={() =>
                        setFieldValue(
                          `paymentMethods[${i}].check`,
                          values.paymentMethods[i].check.splice(0, idx)
                        )
                      }
                    >
                      <IconUrl path="setting/icdelete" />
                    </IconButton>
                  )}
                </Stack>
              </Stack>
              <table>
                <tbody>
                  <tr>
                    <td align="left">
                      {moment(check.payment_date, "DD-MM-YYYY HH:mm").format(
                        "DD-MM-YYYY"
                      )}
                    </td>
                    <td className="bank-data" align="center">
                      {check.bank ? check.bank : "--"}
                    </td>
                    <td align="center">
                      {check.carrier ? check.carrier : "--"}
                    </td>
                    <td align="center">
                      {check.check_number ? "N° " + check.check_number : "--"}
                    </td>
                    <td align="right">
                      {check.amount ? check.amount + " DT" : "--"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Stack>
          </CardContent>
        </Card>
      </Collapse>
    </Stack>
  );
}

export default CheckCard;
