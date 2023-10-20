import React from "react";
import CardStyled from "./overrides/cardStyle";
import { CardContent, IconButton, Stack, Typography } from "@mui/material";
import IconUrl from "@themes/urlIcon";
function InventoryMobileCard({ ...props }) {
  const { data, t, edit, devise } = props;
  return (
    <CardStyled>
      <CardContent>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight={500}>
            {data.name}
          </Typography>
          <Typography fontWeight={600}>
            {data.qte * data.after_amount} {devise}
          </Typography>
        </Stack>
        <Stack spacing={0.5} width={1}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            width={1}
          >
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography variant="caption" fontWeight={600}>
                {t("table.quality")}:
              </Typography>
              <Typography variant="subtitle2">{data.qte}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <IconButton size="small" onClick={() => edit(data, "edit")}>
                <IconUrl path="setting/edit" />
              </IconButton>
              <IconButton size="small" onClick={() => edit(data, "delete")}>
                <IconUrl path="setting/icdelete" />
              </IconButton>
            </Stack>
          </Stack>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography variant="caption" fontWeight={600}>
                {t("table.before_amount")}:
              </Typography>
              <Typography variant="subtitle2">{data.before_amount}</Typography>
              <Typography variant="caption">{devise}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography variant="caption" fontWeight={600}>
                {t("table.after_amount")}:
              </Typography>
              <Typography variant="subtitle2">{data.after_amount}</Typography>
              <Typography variant="caption">{devise}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </CardStyled>
  );
}

export default InventoryMobileCard;
