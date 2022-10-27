import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { SettingsTabs } from "@features/tabPanel";
import { Box, Button, Stack, Typography } from "@mui/material";
import {
  PractitionerForm,
  ConsultationForm,
  EquipmentForm,
} from "@features/forms";
import { DashLayout } from "@features/base";
import { SubFooter } from "@features/subFooter";

const TabData = [
  {
    icon: "ic-docotor",
    label: "practitioner",
    content: "content-1",
  },
  {
    icon: "ic-salle-tab",
    label: "consultation-room",
    content: "content-2",
  },
  {
    icon: "ic-hosipital-bed",
    label: "equipment-room",
    content: "content-3",
  },
];
function AddAgenda() {
  const [state, setstate] = useState({
    activeTab: null,
  });
  const { t, ready } = useTranslation("settings", {
    keyPrefix: "addAgenda",
  });
  if (!ready) return <>Loading Translation...</>;
  return (
    <div className="container">
      <Typography gutterBottom>
        {state.activeTab === 1 || state.activeTab === 2
          ? t("title-2")
          : t("title-1")}
      </Typography>
      <SettingsTabs data={TabData} getIndex={setstate} t={t} />
      {state.activeTab === 0 && <PractitionerForm t={t} />}
      {state.activeTab === 1 && <ConsultationForm t={t} />}
      {state.activeTab === 2 && <EquipmentForm t={t} />}
      <Box pt={8} />
      <SubFooter>
        <Stack
          width={1}
          direction="row"
          alignItems="center"
          spacing={2}
          justifyContent="flex-end">
          <Button variant="text-black">{t("cancel")}</Button>
          <Button variant="contained" disabled={state.activeTab === null}>
            {t("save")}
          </Button>
        </Stack>
      </SubFooter>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (context) => ({
  props: {
    fallback: false,
    ...(await serverSideTranslations(context.locale as string, [
      "common",
      "menu",
      "settings",
    ])),
  },
});

export default AddAgenda;

AddAgenda.auth = true;

AddAgenda.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};
