import React from "react";
import CardStyled from "./overrides/cardStyle";
import {
  CardContent,
  IconButton,
  Stack,
  Typography,
  useTheme,
  Theme,
  Link,
  Tooltip,
  Avatar,
  Divider,
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import { Label } from "@features/label";
import { ConditionalWrapper } from "@lib/hooks";
import { ImageHandler } from "@features/image";
import moment from "moment-timezone";

function UnpaidConsultationCard({ ...props }) {
  const { t, devise, row, handleEvent, insurances } = props;
  const theme: Theme = useTheme();

  return (
    <CardStyled>
      <CardContent>
        <Stack>
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <IconUrl
                  path="ic-agenda-jour"
                  width={11}
                  height={11}
                  color={theme.palette.text.primary}
                />
                <Typography variant="body2" fontWeight={500}>
                  {moment(row.dayDate, "DD-MM-YYYY").format("DD-MM-YYYY")}
                </Typography>
                <IconUrl
                  path="ic-time"
                  width={11}
                  height={11}
                  color={theme.palette.text.primary}
                />
                <Typography variant="body2" fontWeight={500}>
                  {row.startTime}
                </Typography>
              </Stack>
              <Label color="success">{t("paid")}</Label>
            </Stack>
            <IconButton
              className="btn-cash"
              onClick={(event) => {
                event.stopPropagation();
                handleEvent({ action: "PAYMENT", row, event });
              }}
            >
              <IconUrl path="ic-argent" color="white" width={20} height={20} />
            </IconButton>
          </Stack>
          <Stack mt={-0.5} alignItems="flex-start">
            <ConditionalWrapper
              condition={!row.patient?.isArchived}
              wrapper={(children: any) => (
                <Link
                  sx={{ cursor: "pointer" }}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleEvent({
                      action: "PATIENT_DETAILS",
                      row: row.patient,
                      event,
                    });
                  }}
                  underline="none"
                >
                  {children}
                </Link>
              )}
            >
              {`${row.patient.firstName} ${row.patient.lastName}`}
            </ConditionalWrapper>
          </Stack>
          <Divider sx={{ mt: 1 }} />

          <List disablePadding>
            <ListItem disablePadding>
              <ListItemIcon>
                <Typography variant="body2" fontWeight={400}>
                  {t("total")} :
                </Typography>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight={500}>
                    {row.fees ? row.fees : row.appointmentRestAmount} {devise}
                  </Typography>
                }
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>
                <Typography variant="body2" fontWeight={400}>
                  {t("paid")} :
                </Typography>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight={500}>
                    {row.fees ? row.fees - row.appointmentRestAmount : 0}{" "}
                    {devise}
                  </Typography>
                }
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>
                <Typography variant="body2" fontWeight={400}>
                  {t("table.rest")} :
                </Typography>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight={500}>
                    {row.appointmentRestAmount} {devise}
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </Stack>
      </CardContent>
    </CardStyled>
  );
}

export default UnpaidConsultationCard;
