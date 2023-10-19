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
  const { t, idx, check, devise, formik, i } = props;
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
            justifyContent="space-between"
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
            <IconButton
              className="expand-icon"
              onClick={() => setExpand(false)}
            >
              <CheckBoxIcon />
            </IconButton>
          </Stack>
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              {t("amount")}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              width={{ xs: 1, sm: "100%" }}
            >
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
            </Stack>
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
                direction="row"
                alignItems="center"
                justifyContent="space-between"
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
