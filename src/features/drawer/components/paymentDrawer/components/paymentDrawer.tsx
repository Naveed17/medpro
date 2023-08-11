import React from "react";
import RootStyled from "./overrides/rootStyle";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  IconButton,
  Link,
  List,
  ListItem,
  Stack,
  Typography,
  useTheme,
  Theme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import { Label } from "@features/label";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import IconUrl from "@themes/urlIcon";
function PaymentDrawer({ ...props }) {
  const { handleClose, t } = props;
  const theme = useTheme<Theme>();
  return (
    <RootStyled>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        bgcolor="common.white"
        px={2}
        py={1}
        mb={2}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </Stack>
      <Stack spacing={2} px={1}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          className="btn-group"
        >
          <Button variant="contained" size="small">
            <IconUrl path="ic-argent" />
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            endIcon={
              <Typography>
                <strong>70</strong> TND
              </Typography>
            }
          >
            {t("remainder_to_pay")}{" "}
          </Button>
          <Button
            variant="contained"
            color="warning"
            size="small"
            endIcon={
              <Typography>
                <strong>220</strong> TND
              </Typography>
            }
          >
            {t("total")}{" "}
          </Button>
        </Stack>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Label variant="filled" color="warning">
                  RDV
                </Label>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <FiberManualRecordIcon color="success" fontSize="small" />
                  <Typography>Consultation</Typography>
                </Stack>
              </Stack>
              <Stack>
                <Typography>{t("appointment_date")}</Typography>
                <Stack direction="row" alignItems="center" spacing={4}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <IconUrl path="ic-agenda-jour-b" />
                    <Typography fontWeight={600}>30/07/2022</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <IconUrl path="ic-time" />
                    <Typography fontWeight={600}>14:30</Typography>
                  </Stack>
                </Stack>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    backgroundColor: "primary.main",
                  }}
                />
                <Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <IconUrl path="ic-h" />
                    <Link underline="none">Asma Anderson</Link>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <IconUrl path="ic-anniverssaire" />
                    <Typography variant="body2" color="text.secondary">
                      07/05/2016 - 32Ans
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              pb={0.5}
            >
              <Typography fontWeight={700}>
                {t("filter.paymentType")}
              </Typography>
              <Button sx={{ minWidth: 32 }} variant="contained" size="small">
                <IconUrl path="ic-argent" />
              </Button>
            </Stack>
            <List>
              {Array.from({ length: 3 }).map((_, index) => (
                <ListItem key={index}>
                  <Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <IconUrl
                        path="ic-agenda"
                        width={11}
                        height={11}
                        color={theme.palette.text.primary}
                      />
                      <Typography variant="body2">10/10/2022</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <IconUrl
                        path="ic-time"
                        width={11}
                        height={11}
                        color={theme.palette.text.primary}
                      />
                      <Typography variant="body2">14:20</Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <IconUrl path="ic-argent" />
                    <Typography variant="body2">{t("cash")}</Typography>
                  </Stack>
                  <Typography fontWeight={700} color="success.darker">
                    100
                  </Typography>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Stack>
    </RootStyled>
  );
}

export default PaymentDrawer;
