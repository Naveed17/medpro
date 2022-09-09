import React from "react";
// material
import {
  Typography,
  TableRow,
  TableCell,
  useMediaQuery,
  Skeleton,
} from "@mui/material";
// components
import { RDVCard, RDVMobileCard } from "@features/card/";
// utils
import { useTranslation } from "next-i18next";
import _ from "lodash";
function RDVRow({ ...props }) {
  const { data, loading } = props;
  const matches = useMediaQuery("(min-width:900px)");

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
    .value()
    .reverse();

  const { t, ready } = useTranslation("patient", {
    keyPrefix: "patient-details",
  });
  if (!ready) return <>loading translations...</>;
  return (
    <React.Fragment>
      <TableRow>
        <TableCell colSpan={3} className="text-row">
          <Typography variant="body1" color="text.primary">
            {loading ? (
              <Skeleton variant="text" sx={{ maxWidth: 200 }} />
            ) : (
              <>
                {t("pending-appo")}{" "}
                {data.nextAppointments.length > 1 &&
                  `(${data.nextAppointments.length})`}
              </>
            )}
          </Typography>
        </TableCell>
      </TableRow>
      {(loading ? Array.from(new Array(3)) : data.nextAppointments).map(
        (data: PatientDetailsRDV) => (
          <React.Fragment key={Math.random()}>
            {matches ? (
              <RDVCard t={t} loading={loading} inner={data} />
            ) : (
              <RDVMobileCard loading={loading} inner={data} />
            )}
          </React.Fragment>
        )
      )}
      <TableRow>
        <TableCell colSpan={3} className="text-row">
          <Typography variant="body1" color="text.primary">
            {loading ? (
              <Skeleton variant="text" sx={{ maxWidth: 200 }} />
            ) : (
              <>
                {t("old-appo")}{" "}
                {data.previousAppointments.length > 1 &&
                  `(${data.previousAppointments.length})`}
              </>
            )}
          </Typography>
        </TableCell>
      </TableRow>
      {(loading ? Array.from(new Array(1)) : previousAppointments).map(
        (data: any) => (
          <React.Fragment key={Math.random()}>
            <TableRow>
              <TableCell className="text-row">
                <Typography variant="body1" color="text.primary">
                  {loading ? (
                    <Skeleton variant="text" sx={{ maxWidth: 200 }} />
                  ) : (
                    <>{data.year}</>
                  )}
                </Typography>
              </TableCell>
            </TableRow>
            {(loading ? Array.from(new Array(4)) : data.data).map(
              (inner: any) => (
                <React.Fragment key={Math.random()}>
                  {matches ? (
                    <RDVCard
                      inner={inner}
                      loading={loading}
                      key={Math.random()}
                    />
                  ) : (
                    <RDVMobileCard inner={inner} key={Math.random()} />
                  )}
                </React.Fragment>
              )
            )}
          </React.Fragment>
        )
      )}
    </React.Fragment>
  );
}
export default RDVRow;
