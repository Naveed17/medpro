import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactElement, useState } from "react";
import { Box, Typography, Button, Drawer } from "@mui/material";
import { DashLayout } from "@features/base";
import { PatientTable, PatiendData } from "@features/patientTable";
import { PatientAddForm } from "@features/patientAddForm";
import { PatientMobileCard } from "@features/patientMobileCard";
import SubHeader from "@features/subHeader/components/subHeader";
import useMediaQuery from "@mui/material/useMediaQuery";
import { configSelector } from "@features/base";
import { useAppSelector } from "@app/redux/hooks";
function Patient() {
  const isDesktop = useMediaQuery("(min-width:900px)");
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const { direction } = useAppSelector(configSelector);
  const { t, ready } = useTranslation("patient");
  if (!ready) return <>loading translations...</>;

  return (
    <>
      <SubHeader>
        <Typography variant="subtitle2" color="text.primary">
          {t("sub-header.title")}
        </Typography>
        <Button
          onClick={() => setOpenDrawer(true)}
          variant="contained"
          color="success"
          sx={{ ml: "auto" }}
        >
          {t("sub-header.add-patient")}
        </Button>
      </SubHeader>
      <Box className="container">
        <PatientTable PatiendData={PatiendData} />
        <PatientMobileCard t={t} ready={ready} PatiendData={PatiendData} />
        <Drawer
          anchor={"right"}
          open={openDrawer}
          dir={direction}
          onClose={() => {
            setOpenDrawer(false);
          }}
        >
          {/* <EditMotifDialog data={selected} close={ () => { setEdit(false) }}/> */}
          <PatientAddForm />
        </Drawer>
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
