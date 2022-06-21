import { Fragment } from "react";
import { Typography } from "@mui/material";
import { Accordion } from "@features/accordion/components";
import { rightActionData } from "./data";
import { useTranslation } from "next-i18next";
import {
  AppointmentFilter,
  PlaceFilter,
  PatientFilter,
  FilterContainerStyles,
} from "./overrides";
function PatientListActionBar() {
  const { collapse } = rightActionData.filter;

  const { t, ready } = useTranslation("patient");
  if (!ready) return <>loading translations...</>;

  const data = collapse.map((item) => {
    return {
      heading: {
        id: item.heading.title,
        icon: item.heading.icon,
        title: t(`filter.${item.heading.title}`),
      },
      children: (
        <Fragment>
          {item.heading.title === "patient" ? (
            <PatientFilter item={item} t={t} />
          ) : item.heading.title === "place" ? (
            <PlaceFilter item={item} t={t} />
          ) : (
            <AppointmentFilter item={item} t={t} />
          )}
        </Fragment>
      ),
    };
  });
  return (
    <div>
      <FilterContainerStyles>
        <Typography
          variant="h6"
          color="text.primary"
          sx={{ py: 5, pl: "10px", mb: "0.21em" }}
          gutterBottom
        >
          {t(`filter.title`)}
        </Typography>
        <Accordion t={t} badge={null} data={data} />
      </FilterContainerStyles>
    </div>
  );
}
export default PatientListActionBar;
