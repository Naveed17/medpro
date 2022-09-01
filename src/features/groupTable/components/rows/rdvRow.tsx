import React from "react";
// material
import { Typography, TableRow, TableCell, useMediaQuery } from "@mui/material";
// components
import { RDVCard, RDVMobileCard } from "@features/card/";
// utils
import { useTranslation } from "next-i18next";
import moment from "moment-timezone";
import _ from "lodash";
function RDVRow({ ...props }) {
  const { data, loading } = props;
  const matches = useMediaQuery("(min-width:900px)");

  const daata = [
    {
      uuid: "42d042f0-d672-4484-bbb4-7dbdd066ae3b",
      type: 1,
      dayDate: "01-09-2022",
      startTime: "08:45",
      endTime: "09:00",
      duration: 15,
      isVip: null,
      status: 1,
      consultationReason: {
        uuid: "6bc36ef1-9dd8-4260-a9f1-ed8f2a528197",
        name: "mutate",
        duration: 15,
        color: "#1BC47D",
      },
      treatments: [],
      requestedAnalyses: [],
      appointmentData: [],
    },
    {
      uuid: "42d042f0-d672-4484-bbb4-7dbdd066ae3b",
      type: 1,
      dayDate: "01-09-2021",
      startTime: "08:45",
      endTime: "09:00",
      duration: 15,
      isVip: null,
      status: 1,
      consultationReason: {
        uuid: "6bc36ef1-9dd8-4260-a9f1-ed8f2a528197",
        name: "mutate",
        duration: 15,
        color: "#1BC47D",
      },
      treatments: [],
      requestedAnalyses: [],
      appointmentData: [],
    },
    {
      uuid: "42d042f0-d672-4484-bbb4-7dbdd066ae3b",
      type: 1,
      dayDate: "01-09-2022",
      startTime: "08:45",
      endTime: "09:00",
      duration: 15,
      isVip: null,
      status: 1,
      consultationReason: {
        uuid: "6bc36ef1-9dd8-4260-a9f1-ed8f2a528197",
        name: "mutate",
        duration: 15,
        color: "#1BC47D",
      },
      treatments: [],
      requestedAnalyses: [],
      appointmentData: [],
    },
    {
      uuid: "42d042f0-d672-4484-bbb4-7dbdd066ae3b",
      type: 1,
      dayDate: "01-09-2021",
      startTime: "08:45",
      endTime: "09:00",
      duration: 15,
      isVip: null,
      status: 1,
      consultationReason: {
        uuid: "6bc36ef1-9dd8-4260-a9f1-ed8f2a528197",
        name: "mutate",
        duration: 15,
        color: "#1BC47D",
      },
      treatments: [],
      requestedAnalyses: [],
      appointmentData: [],
    },
    {
      uuid: "42d042f0-d672-4484-bbb4-7dbdd066ae3b",
      type: 1,
      dayDate: "01-09-2021",
      startTime: "08:45",
      endTime: "09:00",
      duration: 15,
      isVip: null,
      status: 1,
      consultationReason: {
        uuid: "6bc36ef1-9dd8-4260-a9f1-ed8f2a528197",
        name: "mutate",
        duration: 15,
        color: "#1BC47D",
      },
      treatments: [],
      requestedAnalyses: [],
      appointmentData: [],
    },
    {
      uuid: "42d042f0-d672-4484-bbb4-7dbdd066ae3b",
      type: 1,
      dayDate: "01-09-2020",
      startTime: "08:45",
      endTime: "09:00",
      duration: 15,
      isVip: null,
      status: 1,
      consultationReason: {
        uuid: "6bc36ef1-9dd8-4260-a9f1-ed8f2a528197",
        name: "mutate",
        duration: 15,
        color: "#1BC47D",
      },
      treatments: [],
      requestedAnalyses: [],
      appointmentData: [],
    },
    {
      uuid: "42d042f0-d672-4484-bbb4-7dbdd066ae3b",
      type: 1,
      dayDate: "01-09-2021",
      startTime: "08:45",
      endTime: "09:00",
      duration: 15,
      isVip: null,
      status: 1,
      consultationReason: {
        uuid: "6bc36ef1-9dd8-4260-a9f1-ed8f2a528197",
        name: "mutate",
        duration: 15,
        color: "#1BC47D",
      },
      treatments: [],
      requestedAnalyses: [],
      appointmentData: [],
    },
  ];
  const mapped =
    !loading &&
    data.previousAppointments?.map((v: any) => {
      return {
        ...v,
        year: v.dayDate.slice(-4),
      };
    });

  const previousAppointments = _(mapped)
    .groupBy("year")
    .map((items, year) => ({
      year: year,
      data: _.map(items),
    }))
    .value();

  const { t, ready } = useTranslation("patient", {
    keyPrefix: "patient-details",
  });
  if (!ready) return <>loading translations...</>;
  return (
    <React.Fragment>
      <TableRow>
        <TableCell colSpan={3} className="text-row">
          <Typography variant="body1" color="text.primary">
            {t("pending-appo")}{" "}
            {data.nextAppointments.length > 1 &&
              `(${data.nextAppointments.length})`}
          </Typography>
        </TableCell>
      </TableRow>
      {data.nextAppointments.map((data: PatientDetailsRDV) => (
        <React.Fragment key={Math.random()}>
          {matches ? (
            <RDVCard t={t} inner={data} />
          ) : (
            <RDVMobileCard inner={data} />
          )}
        </React.Fragment>
      ))}
      <TableRow>
        <TableCell colSpan={3} className="text-row">
          <Typography variant="body1" color="text.primary">
            {t("old-appo")}{" "}
            {data.previousAppointments.length > 1 &&
              `(${data.previousAppointments.length})`}
          </Typography>
        </TableCell>
      </TableRow>
      {previousAppointments?.map((data: any) => (
        <React.Fragment key={Math.random()}>
          <TableRow>
            <TableCell className="text-row">
              <Typography variant="body1" color="text.primary">
                {data.year}
              </Typography>
            </TableCell>
          </TableRow>
          {data.data.map((inner: any) => (
            <React.Fragment key={Math.random()}>
              {matches ? (
                <RDVCard inner={inner} key={Math.random()} />
              ) : (
                <RDVMobileCard inner={inner} key={Math.random()} />
              )}
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}
export default RDVRow;
