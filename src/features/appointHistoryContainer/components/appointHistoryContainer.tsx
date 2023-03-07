import { Container, Toolbar, Stack, Typography, Button } from "@mui/material";
import IconUrl from "@themes/urlIcon";
import React from "react";
import AppointHistoryContainerStyled from "./overrides/appointHistoryContainerStyle";
function AppointHistoryContainer({ ...props }) {
  const { children, data, handleAction } = props;
  return (
    <AppointHistoryContainerStyled>
      <Toolbar>
        <Stack spacing={1.5} direction="row" alignItems="center">
          <IconUrl path={data.icon} />
          <Typography>{data.title}</Typography>
          <Button
            onClick={() => handleAction(data.action)}
            className="btn-action"
            color="warning"
            size="small"
            startIcon={<IconUrl path="ic-retour" />}>
            {data.action}
          </Button>
        </Stack>
      </Toolbar>
      <Container maxWidth={false} disableGutters>
        {children}
      </Container>
    </AppointHistoryContainerStyled>
  );
}

export default AppointHistoryContainer;
