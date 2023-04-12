import React from "react";
import RootStyled from "./overrides/rootStyled";
import { Grid, Typography, Stack, Switch, IconButton } from "@mui/material";
import IconUrl from "@themes/urlIcon";
function FileTemplateMobileCard({ ...props }) {
  const { data, handleChange, edit } = props;

  return (
    <RootStyled
      sx={{
        "&:before": {
          bgcolor: data?.color,
          width: ".4rem",
        },
      }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={8}>
          <Typography>{data.label}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="flex-end">
            <Switch
              name="active"
              onChange={(e) => handleChange(data, "active", "")}
              checked={data.isEnabled}
            />
            <IconButton
              size="small"
              sx={{ mr: { md: 1 } }}
              onClick={() => edit(data, "see")}>
              <IconUrl path="setting/ic-voir" />
            </IconButton>
          </Stack>
        </Grid>
      </Grid>
    </RootStyled>
  );
}

export default FileTemplateMobileCard;
