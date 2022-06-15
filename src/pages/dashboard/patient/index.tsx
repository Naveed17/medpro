import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";
import DashLayout from "@features/base/dashLayout";
import { PatientTable } from "@features/patientTable";
import SubHeader from "@features/subHeader/components/subHeader";

function Patient() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const { t, ready } = useTranslation("common");
  if (!ready) return <>loading translations...</>;

  return (
    <>
      <SubHeader>
        <Typography variant="h6" color="primary.main">
          Hello
        </Typography>
      </SubHeader>
      <Box
        bgcolor="#F0FAFF"
        sx={{ p: { xs: "40px 8px", sm: "30px 8px", md: 2 } }}
      >
        <PatientTable />
      </Box>
    </>
  );
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, [
      "common",
      "menu",
      "agenda",
    ])),
  },
});
export default Patient;

Patient.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};
