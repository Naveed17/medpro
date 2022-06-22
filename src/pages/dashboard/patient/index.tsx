import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactElement } from "react";
import { Box, Typography, Button } from "@mui/material";
import { DashLayout } from "@features/base";
import { PatientTable, PatiendData } from "@features/patientTable";
import { PatientMobileCard } from "@features/patientMobileCard";
import SubHeader from "@features/subHeader/components/subHeader";
import useMediaQuery from "@mui/material/useMediaQuery";
function Patient() {
  const isDesktop = useMediaQuery("(min-width:900px)");
  const { t, ready } = useTranslation("patient");
  if (!ready) return <>loading translations...</>;

  return (
    <>
      <SubHeader>
        <Typography variant="subtitle2" color="text.primary">
          {t("sub-header.title")}
        </Typography>
        <Button variant="contained" color="success" sx={{ ml: "auto" }}>
          {t("sub-header.add-patient")}
        </Button>
      </SubHeader>
      <Box
        bgcolor="#F0FAFF"
        sx={{ p: { xs: "40px 8px", sm: "30px 8px", md: 2 } }}
      >
        {isDesktop ? (
          <PatientTable PatiendData={PatiendData} />
        ) : (
          <PatientMobileCard t={t} ready={ready} PatiendData={PatiendData} />
        )}
      </Box>
    </>
  );
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["patient", "menu"])),
  },
});
export default Patient;

Patient.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};
