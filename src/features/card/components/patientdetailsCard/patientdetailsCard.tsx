//material-ui
import {
  Box,
  Button,
  Typography,
  Badge,
  Skeleton,
  TextField,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
// styled
import { RootStyled } from "./overrides";

// utils
import Icon from "@themes/urlIcon";
import { pxToRem } from "@themes/formatFontSize";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "@app/redux/hooks";
import moment from "moment-timezone";
import { timerSelector } from "@features/card";
import { QrCodeScanner } from "@features/qrCodeScanner";
import { useState } from "react";

function PatientDetailsCard({ ...props }) {
  const { patient, onConsultation, loading } = props;
  const { isActive } = useAppSelector(timerSelector);
  const [state, setState] = useState<any>({
    name: !loading && `${patient.firstName} ${patient.lastName}`,
    nameEdit: false,
  });
  const { name, nameEdit } = state;
  const { t, ready } = useTranslation("patient", {
    keyPrefix: "patient-details",
  });

  if (!ready) return <>loading translations...</>;
  return (
    <RootStyled>
      <Badge
        color="success"
        variant="dot"
        invisible={patient?.nextAppointments.length === 0}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}>
        {loading ? (
          <Skeleton
            variant="rectangular"
            width={pxToRem(59)}
            height={pxToRem(59)}
            sx={{ borderRadius: pxToRem(10), mb: pxToRem(10), mr: 1 }}
          />
        ) : (
          <Box
            component="img"
            src={
              patient?.gender === "M"
                ? "/static/icons/men-avatar.svg"
                : "/static/icons/women-avatar.svg"
            }
            width={pxToRem(59)}
            height={pxToRem(59)}
            sx={{ borderRadius: pxToRem(10), mb: pxToRem(10), mr: 1 }}
          />
        )}
      </Badge>
      <Box mx={1}>
        <Typography
          color="text.primary"
          sx={{
            fontFamily: "Poppins",
            fontSize: 19,
            mb: 1,
            textAlign: { md: "left", sm: "center", xs: "center" },
          }}>
          {loading ? (
            <Skeleton variant="text" width={150} />
          ) : (
            <TextField
              variant="standard"
              InputProps={{
                style: {
                  background: "white",
                },
                disableUnderline: true,
              }}
              inputProps={{
                style: {
                  background: "white",
                  fontSize: pxToRem(14),
                },
                readOnly: !nameEdit,
              }}
              placeholder={"name"}
              onChange={(ev) => {
                setState({
                  ...state,
                  name: ev.target.value,
                });
              }}
              id={"name"}
              onClick={() => {
                setState({
                  ...state,
                  nameEdit: true,
                });
              }}
              value={name}
            />
          )}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          component="span"
          className="date-birth">
          {loading ? (
            <Skeleton variant="text" width={150} />
          ) : (
            <>
              <Icon path="ic-anniverssaire" />
              {patient?.birthdate} -{" "}
              {patient?.birthdate &&
                `${moment().diff(
                  moment(patient?.birthdate, "DD-MM-YYYY"),
                  "years"
                )} ${t("years")}`}
            </>
          )}
        </Typography>
      </Box>
      <div>
        {loading ? (
          <Skeleton variant="text" width={150} />
        ) : (
          <Typography
            visibility={"hidden"}
            variant="body2"
            component="span"
            className="alert">
            <Icon path="danger" />
            {t("duplicate")}
          </Typography>
        )}

        <Typography
          variant="body2"
          color="primary"
          component="span"
          className="email-link">
          {loading ? (
            <Skeleton variant="text" width={100} />
          ) : (
            patient?.email && (
              <>
                <Icon path="ic-message-contour" />
                {patient?.email}
              </>
            )
          )}
        </Typography>
      </div>
      <Box
        display="flex"
        alignItems="center"
        sx={{ ml: { md: 1, sm: 0, xs: 0 }, mt: { md: 4, sm: 1, xs: 1 } }}>
        {loading ? (
          <Skeleton variant="text" width={100} />
        ) : (
          <>
            {patient?.telephone && (
              <>
                <Icon path="ic-tel" />
                <Typography variant="body2">{patient?.telephone}</Typography>
              </>
            )}
          </>
        )}
      </Box>
      {onConsultation && (
        <>
          {loading ? (
            <Skeleton
              variant="rectangular"
              sx={{
                ml: { md: "auto", xs: 0 },
                maxWidth: { md: 193, xs: "100%" },
                minHeight: { md: 60, xs: 40 },
                width: 153,
                my: 2,
                borderRadius: "4px",
              }}
            />
          ) : (
            <Button
              onClick={onConsultation}
              variant="contained"
              color="warning"
              startIcon={<PlayCircleIcon />}
              sx={{
                ml: { md: "auto", sm: 0, xs: 0 },
                maxWidth: { md: 193, xs: "100%" },
                my: 2,
                display: isActive ? "none" : "inline-flex",
              }}>
              {t("start-consultation")}
            </Button>
          )}
        </>
      )}
      {patient && (
        <Box ml={{ lg: "auto", xs: 0 }}>
          <QrCodeScanner value={patient?.uuid} width={100} height={100} />
        </Box>
      )}
    </RootStyled>
  );
}

export default PatientDetailsCard;
