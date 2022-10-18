import React from "react";
import {
  CardContent,
  Stack,
  Skeleton,
  Card,
  List,
  ListItem,
  ListItemIcon,
  Box,
} from "@mui/material";
import Icon from "@themes/urlIcon";
import CIPPatientHistoryNoDataCardStyled from "./overrides/PatientHistoryNoDataCardStyle";
import CircleIcon from "@mui/icons-material/Circle";
function PatientHistoryCard() {
  return (
    <CIPPatientHistoryNoDataCardStyled>
      <Stack className="card-header" direction="row" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Icon path={"ic-doc"} />
          <Skeleton width={100} />
        </Stack>
        <Skeleton width={100} sx={{ ml: "auto" }} />
      </Stack>
      <CardContent>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          spacing={3}>
          {Array.from({ length: 2 }).map((_, i) => (
            <Card className="motif-card" key={i}>
              <CardContent>
                <Box my={1}>
                  <Skeleton width={100} />
                </Box>
                <List
                  dense
                  style={{ marginLeft: 20, textTransform: "capitalize" }}>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <ListItem key={"modelData" + idx}>
                      <ListItemIcon>
                        <CircleIcon />
                      </ListItemIcon>
                      <Skeleton width={100} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          ))}
        </Stack>
        <Stack spacing={1} mt={4}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <Card
              key={idx}
              sx={{ borderRadius: 0, borderLeft: 0, borderRight: 0 }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ p: 0.5 }}>
                <Skeleton variant="rounded" width={20} height={20} />
                <Skeleton width={100} />
              </Stack>
            </Card>
          ))}
        </Stack>
      </CardContent>
    </CIPPatientHistoryNoDataCardStyled>
  );
}

export default PatientHistoryCard;
