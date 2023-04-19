import {
  CardContent,
  Link,
  Theme,
  Stack,
  Typography,
  IconButton,
  Skeleton,
  AvatarGroup,
  Tooltip,
  Avatar,
  Menu,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Icon from "@themes/urlIcon";
import { Label } from "@features/label";
import React, { useState } from "react";
import PaymentMobileCardStyled from "./overrides/paymentMobileCardStyle";
import Image from "next/image";
import { ModelDot } from "@features/modelDot";
import { PaymentFeesPopover } from "@features/popover";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { DefaultCountry } from "@app/constants";
function PaymentMobileCard({ ...props }) {
  const {
    data,
    t,
    edit,
    loading = false,
    insurances,
    handleEvent,
    editMotif,
  } = props;
  const theme = useTheme() as Theme;
  const { data: session } = useSession();
  const { data: user } = session as Session;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const medical_entity = (user as UserDataResponse)
    .medical_entity as MedicalEntityModel;
  const doctor_country = medical_entity.country
    ? medical_entity.country
    : DefaultCountry;
  const devise = doctor_country.currency?.name;
  const openFeesPopover = (event: React.MouseEvent<any>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
  };
  const handleClose = () => {
    setAnchorEl(null);
    setContextMenu(null);
  };
  return (
    <PaymentMobileCardStyled
      sx={{
        borderLeft: `6px solid ${
          (data.pending && theme.palette.warning.darker) ||
          (data.amount > 0 && theme.palette.success.main) ||
          (data.amount < 0 && theme.palette.error.main) ||
          theme.palette.divider
        }`,
      }}>
      <CardContent>
        <Stack spacing={2}>
          {loading ? (
            <Skeleton width={80} />
          ) : data.name ? (
            <Link
              sx={{ cursor: "pointer" }}
              onClick={(event) => {
                event.stopPropagation();
                handleEvent({ action: "PATIENT_DETAILS", row: data, event });
              }}
              underline="none">
              {data.name}
            </Link>
          ) : (
            <Link underline="none">+</Link>
          )}
          <Stack
            className="date-time"
            spacing={4}
            direction="row"
            alignItems="center">
            <Stack spacing={0.5} direction="row" alignItems="center">
              <Icon path="ic-agenda-jour" />
              <Typography fontWeight={600}>{data.date}</Typography>
            </Stack>
            <Stack spacing={0.5} direction="row" alignItems="center">
              <Icon path="setting/ic-time" />
              <Typography fontWeight={600} className="date">
                {data.time}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.2} style={{ marginLeft: "auto" }}>
              <ModelDot
                color={"#0696D6"}
                selected={false}
                size={21}
                sizedot={13}
                padding={3}
                marginRight={4}
              />
              {data.type ? (
                <Typography variant="body2" color="text.primary">
                  {t(data.type)}
                </Typography>
              ) : (
                <Typography>--</Typography>
              )}
            </Stack>
          </Stack>
          <Stack direction="row" alignItems="center">
            <Stack
              spacing={4}
              direction="row"
              alignItems="center"
              className="insurrence">
              {loading ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Skeleton width={20} height={30} />
                  <Skeleton width={100} />
                </Stack>
              ) : data.patient.insurances &&
                data.patient.insurances.length > 0 ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AvatarGroup
                    max={3}
                    sx={{
                      "& .MuiAvatarGroup-avatar": { width: 24, height: 24 },
                    }}>
                    {data.patient.insurances.map(
                      (insuranceItem: { insurance: InsuranceModel }) => (
                        <Tooltip
                          key={insuranceItem.insurance?.uuid}
                          title={insuranceItem.insurance?.name}>
                          <Avatar variant={"circular"}>
                            <Image
                              style={{ borderRadius: 2 }}
                              alt={insuranceItem.insurance?.name}
                              src="static/icons/Med-logo.png"
                              width={20}
                              height={20}
                              loader={({ src, width, quality }) => {
                                return insurances?.find(
                                  (insurance: any) =>
                                    insurance.uuid ===
                                    insuranceItem.insurance?.uuid
                                )?.logoUrl;
                              }}
                            />
                          </Avatar>
                        </Tooltip>
                      )
                    )}
                  </AvatarGroup>
                </Stack>
              ) : (
                <Typography>--</Typography>
              )}
              {loading ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Skeleton width={20} height={30} />
                  <Skeleton width={20} height={30} />
                </Stack>
              ) : (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  spacing={1}>
                  {data.payment_type.map((type: string, i: number) => (
                    <Icon key={i} path={type} />
                  ))}
                </Stack>
              )}
            </Stack>
            <Stack
              ml="auto"
              spacing={3}
              direction="row"
              alignItems="center"
              className="insurrence">
              <Stack spacing={1} direction="row" alignItems="center">
                {data.billing_status ? (
                  <Label
                    className="label"
                    variant="ghost"
                    color={data.billing_status === "yes" ? "success" : "error"}>
                    {t("table." + data.billing_status)}
                  </Label>
                ) : (
                  <Typography>--</Typography>
                )}
              </Stack>
              {data.pending ? (
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography
                    color={(theme) => theme.palette.warning.darker}
                    fontWeight={600}>
                    {data.amount}/{data.pending}
                  </Typography>
                  <IconButton color="primary" onClick={() => edit(data)}>
                    <Icon path="ic-argent" />
                  </IconButton>
                </Stack>
              ) : loading ? (
                <Skeleton width={40} height={20} />
              ) : data.pending ? (
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography
                    color={(theme) => theme.palette.warning.darker}
                    fontWeight={600}>
                    {data.amount}/{data.pending}
                  </Typography>
                  <IconButton
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      editMotif(data);
                    }}>
                    <Icon path="ic-argent" />
                  </IconButton>
                </Stack>
              ) : (
                <>
                  <Typography
                    {...(data.amount !== "0" && { sx: { cursor: "zoom-in" } })}
                    id={"popover-button"}
                    aria-controls={open ? "popover-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    {...(data.amount !== "0" && { onClick: openFeesPopover })}
                    color={
                      (data.amount > 0 && "success.main") ||
                      (data.amount < 0 && "error.main") ||
                      "text.primary"
                    }
                    fontWeight={700}>
                    {data.amount} {devise}
                  </Typography>

                  <Menu
                    open={contextMenu !== null}
                    onClose={handleClose}
                    anchorReference="anchorPosition"
                    anchorPosition={
                      contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                    }
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}>
                    <PaymentFeesPopover uuid={data.uuid} />
                  </Menu>
                </>
              )}
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </PaymentMobileCardStyled>
  );
}

export default PaymentMobileCard;
