import React from "react";
// material
import { Typography, TableRow, TableCell, useMediaQuery } from "@mui/material";
// components
import { RDVCard, RDVMobileCard } from "@features/card/";
// utils
import { useTranslation } from "next-i18next";

function RDVRow({ ...props }) {
  const { row } = props;
  const matches = useMediaQuery("(min-width:900px)");
  const { t, ready } = useTranslation("patient", {
    keyPrefix: "patient-details",
  });
  if (!ready) return <>loading translations...</>;
  return (
    <React.Fragment key={Math.random()}>
      <TableRow>
        <TableCell colSpan={3} className="text-row">
          {row.pending ? (
            <Typography variant="body1" color="text.primary">
              {t(row.title)} {row.data.length > 1 && `(${row.data.length})`}
            </Typography>
          ) : (
            <Typography variant="body1" color="text.primary">
              {t(row.title)}{" "}
              {row.data.length > 1
                ? `(${row.data.reduce(
                    (
                      previousValue: PatientDetailsRDV,
                      currentValue: PatientDetailsRDV
                    ) => previousValue.data.length + currentValue.data.length
                  )})`
                : row.data[0].data.length > 1 && `(${row.data[0].data.length})`}
            </Typography>
          )}
        </TableCell>
      </TableRow>
      {row.data.map((data: PatientDetailsRDV) => (
        <React.Fragment key={Math.random()}>
          {data.data ? (
            <>
              <TableRow>
                <TableCell className="text-row">
                  <Typography variant="body1" color="text.primary">
                    {data.title}
                  </Typography>
                </TableCell>
              </TableRow>
              {data.data.map((inner) =>
                matches ? (
                  <RDVCard inner={inner} />
                ) : (
                  <RDVMobileCard inner={inner} />
                )
              )}
            </>
          ) : matches ? (
            <RDVCard t={t} inner={data} />
          ) : (
            <RDVMobileCard inner={data} />
          )}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}
export default RDVRow;
