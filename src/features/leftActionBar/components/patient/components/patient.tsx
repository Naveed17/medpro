import { Typography } from "@mui/material";
import { Accordion } from "@features/accordion";
import rightActionData from "./data";
import { useTranslation } from "next-i18next";
import {
  AppointmentFilter,
  PlaceFilter,
  PatientFilter,
  FilterContainerStyles,
  FilterRootStyled,
} from "./overrides";

function Patient() {
  const { collapse } = rightActionData.filter;
  const { t, ready } = useTranslation("patient");


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

  if (!ready) return <>loading translations...</>;

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
        <Accordion translate={{ t, ready }} badge={null} data={data} defaultValue={"Patient"} />
      </FilterContainerStyles>
    </div>
  );
}
export default Patient;
