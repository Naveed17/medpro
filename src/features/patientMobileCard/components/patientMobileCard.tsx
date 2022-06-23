import { useState } from "react";
import { RootStyled } from "@features/patientMobileCard";

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
import { FilterDrawer } from "@features/filterDrawer";
import { Accordion } from "@features/accordion/components";

// components
import {
  AppointmentFilter,
  PlaceFilter,
  PatientFilter,
  FilterRootStyled,
  RightActionData,
} from "@features/leftActionBar";

function PatientMobileCard({ ...props }) {
  const { PatiendData, t, ready } = props;
  const theme = useTheme();
  const [open, setopen] = useState(false);

  const handleClickOpen = () => {
    setopen(true);
  };
  const { collapse } = RightActionData.filter;

  if (!ready) return <>loading translations...</>;

  const data = collapse.map((item) => {
    return {
      heading: {
        id: item.heading.title,
        icon: item.heading.icon,
        title: t(`filter.${item.heading.title}`),
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
          name: string;
          status: string;
          addAppointment: boolean;
          nextAppointment: Date;
        }) => (
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
                  <Icon
                    path="ic-anniverssaire"
                    className="d-inline-block mr-1"
                  />
                  {new Date().toLocaleDateString()} - 32Asn
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
                      {new Date(v.nextAppointment).toLocaleDateString()}
                      <Icon path="ic-time" />
                      {new Date(v.nextAppointment)
                        .toLocaleTimeString()
                        .slice(0, 5)}
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid item md={4} sm={4} xs={1}>
                <Box display="flex" alignItems="center" height="100%">
                  <IconButton
                    sx={{ display: "block", ml: "auto" }}
                    size="small"
                  >
                    <Icon path="more-vert" />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </Paper>
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
      <FilterDrawer
        handleClose={() => setopen(false)}
        open={open}
        data="Data"
        title={t("filter.title")}
      >
        <Accordion translate={{t, ready}} badge={null} data={data} defaultValue={"Patient"} />
      </FilterDrawer>
    </RootStyled>
  );
}
export default PatientMobileCard;
