import { ReactElement, useState } from "react";
import { RootStyled } from "@features/patientMobileCard";

// next-i18next
import { useTranslation } from "next-i18next";

// material
import {
  Grid,
  Typography,
  IconButton,
  Button,
  Box,
  Paper,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Icon from "@themes/urlIcon";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

// components
import {
  AppointmentFilter,
  PlaceFilter,
  PatientFilter,
  FilterRootStyled,
  RightActionData,
} from "@features/leftActionBar";
import { Popover } from "@features/popover";
import { DrawerBottom } from "@features/drawerBottom";
import { Accordion } from "@features/accordion/components";
import moment from "moment-timezone";

// redux
import { useAppDispatch } from "@app/redux/hooks";
import { onOpenDetails } from "@features/table";

const menuList = [
  {
    title: "Patient Details",
    icon: <CheckRoundedIcon />,
    action: "onOpenDetails",
  },
  {
    title: "Edit Patient",
    icon: <CheckRoundedIcon />,
    action: "onOpenEditPatient",
  },
  {
    title: "Cancel",
    icon: <CheckRoundedIcon />,
    action: "onCancel",
  },
];

const CardSection = ({ ...props }) => {
  const { v, theme, onOpenDetails } = props;

  const [openTooltip, setOpenTooltip] = useState(false);
  const onClickTooltipItem = (item: {
    title: string;
    icon: ReactElement;
    action: string;
  }) => {
    switch (item.action) {
      case "onOpenDetails":
        onOpenDetails({ patientId: v.id });
        break;

      default:
        break;
    }
  };
  return (
    <Paper key={Math.random()} className="card-main">
      <Grid container>
        <Grid item md={8} sm={8} xs={11}>
          <Typography className="heading" variant="body1" component="div">
            <Icon path={v.status === "pending" ? "ic-f" : "ic-h"} />
            {v.name}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            component="div"
            lineHeight="18px"
          >
            <Icon path="ic-anniverssaire" className="d-inline-block mr-1" />
            {v.nextAppointment} - {moment().diff(v.dateOfBirth, "years")}
          </Typography>
          <Box
            className="border-left-sec"
            sx={{
              borderLeft: `5px solid ${
                v.status === "success"
                  ? theme.palette.success.main
                  : theme.palette.warning.main
              }`,
            }}
          >
            <Button
              size="small"
              className="button"
              startIcon={
                v.addAppointment ? (
                  <Icon path="ic-agenda" />
                ) : (
                  <Icon path="ic-historique" />
                )
              }
              sx={{
                color: v.addAppointment ? "primary" : "text.secondary",
              }}
            >
              {v.addAppointment ? "Add Apointment" : "Next Appointment"}
            </Button>
            {v.status === "success" && (
              <Typography
                display="inline"
                variant="body2"
                color="text.primary"
                className="date-time-text"
                component="div"
              >
                <Icon path="ic-agenda" />
                {v.nextAppointment}
                <Icon path="ic-time" />
                {v.time}
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item md={4} sm={4} xs={1}>
          <Box display="flex" alignItems="center" height="100%">
            <Popover
              open={openTooltip}
              handleClose={() => setOpenTooltip(false)}
              menuList={menuList}
              onClickItem={onClickTooltipItem}
              button={
                <IconButton
                  onClick={() => {
                    setOpenTooltip(true);
                  }}
                  sx={{ display: "block", ml: "auto" }}
                  size="small"
                >
                  <Icon path="more-vert" />
                </IconButton>
              }
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
function PatientMobileCard({ ...props }) {
  const { PatiendData } = props;
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const [open, setopen] = useState(false);

  const handleClickOpen = () => {
    setopen(true);
  };
  const { collapse } = RightActionData.filter;
  const { t, ready } = useTranslation("patient", { keyPrefix: "filter" });

  if (!ready) return <>loading translations...</>;

  const data = collapse.map((item) => {
    return {
      heading: {
        id: item.heading.title,
        icon: item.heading.icon,
        title: item.heading.title,
      },
      children: (
        <FilterRootStyled>
          {item.heading.title === "patient" ? (
            <PatientFilter item={item} t={t} />
          ) : item.heading.title === "place" ? (
            <PlaceFilter item={item} t={t} />
          ) : (
            <AppointmentFilter item={item} t={t} />
          )}
        </FilterRootStyled>
      ),
    };
  });

  return (
    <RootStyled>
      {PatiendData.map(
        (v: {
          id: number | string;
          name: string;
          status: string;
          addAppointment: boolean;
          nextAppointment: Date;
        }) => (
          <CardSection
            v={v}
            key={Math.random()}
            theme={theme}
            onOpenDetails={(val: { patientId: number | string }) =>
              dispatch(onOpenDetails(val))
            }
          />
        )
      )}
      <Button
        variant="filter"
        onClick={handleClickOpen}
        className="filter-btn"
        startIcon={<Icon path="ic-filter" />}
      >
        Filtrer (0)
      </Button>
      <DrawerBottom
        handleClose={() => setopen(false)}
        open={open}
        data="Data"
        title={t("title")}
      >
        <Accordion
          translate={{ t, ready }}
          badge={null}
          data={data}
          defaultValue={"patient"}
        />
      </DrawerBottom>
    </RootStyled>
  );
}
export default PatientMobileCard;
