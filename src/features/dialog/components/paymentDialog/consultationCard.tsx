import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Collapse,
  Divider,
  IconButton,
  Stack,
  TextField,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Label } from "@features/label";
import IconUrl from "@themes/urlIcon";
function ConsultationCard({ ...props }) {
  const { t, devise,appointment,addTransactions,rest } = props;
  const theme: Theme = useTheme();
  const [collapse, setCollapse] = useState<boolean>(false);

  return (
    <Card className="consultation-card">
      <CardContent>
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center">
            <Typography fontWeight={700}>{t("consultation")}</Typography>
            <Typography ml={0.5} color="text.secondary" variant="body2">
              {t("today")}
            </Typography>
            <IconButton
              size="small"
              className="btn-collapse"
              onClick={() => setCollapse(!collapse)}
            >
              <ExpandMoreIcon
                sx={{
                  transform: collapse ? "scaleY(-1)" : "scaleY(1)",
                  transition: "all .3s ease",
                }}
              />
            </IconButton>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Label
              color="warning"
              variant="filled"
              sx={{ alignItems: "center" }}
            >
              {t("total")}{" "}
              <Typography
                mx={0.5}
                variant="body2"
                fontWeight={700}
                component="strong"
              >
                {appointment?.fees}
              </Typography>{" "}
              {devise}
            </Label>
            <Label
              color="error"
              variant="filled"
              sx={{ alignItems: "center" }}
            >
              {t("amount_paid")}{" "}
              <Typography mx={0.5} variant="body2" component="strong">
                {appointment?.rest_amount}
              </Typography>{" "}
              {devise}
            </Label>
          </Stack>
          <Stack spacing={0.4}>
            <Typography color="text.secondary" variant="body2">
              {t("pay_now")}
            </Typography>
            <Stack width={1} direction="row" alignItems="center" spacing={1}>
              <TextField
                fullWidth
                value={rest > appointment?.rest_amount ?appointment?.rest_amount:rest}
                size="small"
                type="number"
                sx={{ input: { fontWeight: 700 } }}
              />
              <Typography>{devise}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
      {collapse && <Divider />}

      <Collapse in={collapse}>
        <CardContent>
          <table className="data-table">
            <thead>
              <tr>
                <th align="left">{t("act")}</th>
                <th>{t("qte")}</th>
                <th align="right">{t("amount")}(DT)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td align="left">Consultation</td>
                <td align="center">1</td>
                <td align="right">70</td>
              </tr>
              <tr>
                <td align="right" colSpan={2}>
                  {t("total")} (DT)
                </td>
                <td align="right">100</td>
              </tr>
              <tr>
                <td align="right" colSpan={2}>
                  {t("amount_paid")}
                </td>
                <td align="right">100</td>
              </tr>
              <tr>
                <td align="right" colSpan={2}>
                  <Typography fontWeight={600} variant="subtitle1">
                    {t("rest_pay")}
                  </Typography>
                </td>
                <td align="right">100</td>
              </tr>
            </tbody>
          </table>
          <Stack alignItems="flex-end" mt={2}>
            <Button
              className="btn-print"
              variant="outlined"
              startIcon={<IconUrl path="ic-printer" />}
            >
              {t("print")}
            </Button>
          </Stack>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default ConsultationCard;
