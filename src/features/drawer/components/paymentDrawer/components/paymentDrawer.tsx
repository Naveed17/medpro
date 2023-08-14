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
import { AppointmentStatus } from "@features/calendar";
import moment from "moment-timezone";
import {cashBoxSelector} from "@features/leftActionBar/components/cashbox";
import {useAppSelector} from "@lib/redux/hooks";
function PaymentDrawer({ ...props }) {
  const { handleClose, t, data, pmList ,setAction,setActionDialog,setOpenPaymentDialog,setSelectedPayment} = props;
  const status = AppointmentStatus[data?.appointment?.status];
  const theme = useTheme<Theme>();
  const {paymentTypesList} = useAppSelector(cashBoxSelector);
  const openPutTransactionDialog = () => {
        let payments: any[] = [];
        let payed_amount = 0
        data.transaction_data.map((td: any) => {
            payed_amount += td.amount;
            let pay: any = {
                uuid: td.uuid,
                amount: td.amount,
                payment_date: moment().format('DD-MM-YYYY HH:mm'),
                status_transaction: td.status_transaction_data,
                type_transaction: td.type_transaction_data,
                data: td.data
            }
            if (td.insurance)
                pay["insurance"] = td.insurance.uuid
            if (td.payment_means)
                pay["payment_means"] = paymentTypesList.find((pt: {
                    slug: string;
                }) => pt.slug === td.payment_means.slug)
            payments.push(pay)
        })

        setSelectedPayment({
            uuid: data.appointment.uuid,
            payments,
            payed_amount,
            appointment: data.appointment,
            patient:data.appointment.patient,
            total: data?.amount,
            isNew: false
        });
            setActionDialog("payment_dialog");
            setAction("payment_dialog_title");
            setOpenPaymentDialog(true)
    }
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
          <Button variant="contained" size="small" 
          onClick={() => {
            openPutTransactionDialog()
            }}
          >
            <IconUrl path="ic-argent" />
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            endIcon={
              <Typography>
                <strong>{data?.rest_amount}</strong> TND
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
                <strong>{data?.amount}</strong> TND
              </Typography>
            }
          >
            {t("total")}{" "}
          </Button>
        </Stack>
        {(status || data.patient) && (
          <Card>
            <CardContent>
              <Stack spacing={2}>
                {status && (
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Label
                      variant="filled"
                      sx={{
                        bgcolor: status.color,
                      }}
                    >
                      {t("appointment-status." + status.key, { ns: "common" })}
                    </Label>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <FiberManualRecordIcon
                        sx={{
                          color: data?.appointment?.type?.color,
                        }}
                        fontSize="small"
                      />
                      <Typography>{data?.appointment?.type?.name}</Typography>
                    </Stack>
                  </Stack>
                )}
                {data.appointment && (
                  <Stack>
                    <Typography>{t("appointment_date")}</Typography>
                    <Stack direction="row" alignItems="center" spacing={4}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <IconUrl path="ic-agenda-jour-b" />
                        <Typography fontWeight={600}>
                          {moment(
                            data?.appointment?.dayDate,
                            "DD-MM-YYYY"
                          ).format("DD/MM/YYYY")}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <IconUrl path="ic-time" />
                        <Typography fontWeight={600}>
                          {data?.appointment?.startTime}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                )}

                {(data?.appointment || data?.patient) && (
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
                        <IconUrl
                          path={
                            data?.appointment?.patient?.gender === "M"
                              ? "ic-h"
                              : "ic-f"
                          }
                        />
                        <Link underline="none">
                          {data?.patient?.firstName} {data?.patient?.lastName}
                        </Link>
                      </Stack>
                      {data.appointment &&
                        data.appointment.patient.birthdate && (
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}
                          >
                            <IconUrl path="ic-anniverssaire" />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              textTransform="capitalize"
                            >
                              {data.appointment.patient.birthdate &&
                                moment(
                                  data.appointment.patient.birthdate,
                                  "DD-MM-YYYY"
                                ).format("DD/MM/YYYY")}{" "}
                              -{" "}
                              {data.appointment.patient.birthdate &&
                                moment().diff(
                                  moment(
                                    data.appointment.patient.birthdate,
                                    "DD-MM-YYYY"
                                  ),
                                  "years"
                                )}{" "}
                              <Typography
                                textTransform="capitalize"
                                component="span"
                                variant="body2"
                              >
                                {t("times.years", { ns: "common" })}
                              </Typography>
                            </Typography>
                          </Stack>
                        )}
                    </Stack>
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>
        )}
        {data.transaction_data.length > 0 && (
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" pb={0.5}>
                <Typography fontWeight={700}>
                  {t("filter.paymentType")}
                </Typography>
              </Stack>
              <List>
                {data.transaction_data.map((item: any) => (
                  <ListItem key={item.uuid}>
                    <Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <IconUrl
                          path="ic-agenda"
                          width={11}
                          height={11}
                          color={theme.palette.text.primary}
                        />
                        <Typography variant="body2">
                          {moment(item?.payment_date, "DD-MM-YYYY").format(
                            "DD/MM/YYYY"
                          )}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <IconUrl
                          path="ic-time"
                          width={11}
                          height={11}
                          color={theme.palette.text.primary}
                        />
                        <Typography variant="body2">{item?.time}</Typography>
                      </Stack>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      spacing={1}
                    >
                      <img
                        style={{ width: 15 }}
                        src={
                          pmList.find(
                            (pm: { slug: string }) =>
                              pm?.slug == item.payment_means?.slug
                          )?.logoUrl.url
                        }
                        alt={"payment_icon"}
                      />
                      <Typography variant="body2">
                        {t(item?.payment_means?.slug)}
                      </Typography>
                    </Stack>
                    <Typography
                      fontWeight={700}
                      color="success.darker"
                      textAlign="right"
                    >
                      {item?.amount}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}
      </Stack>
    </RootStyled>
  );
}

export default PaymentDrawer;
