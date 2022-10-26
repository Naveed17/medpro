import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { SettingsTabs } from "@features/tabPanel";
import { PractitionerForm } from "@features/forms";
import { DashLayout } from "@features/base";

const TabData = [
  {
    icon: "ic-docotor",
    label: "Practitioner",
    content:
      "Exemple : ORL , Gynécologue, Dentiste, Généraliste, Pédiatre, Ophtalmologue",
  },
  {
    icon: "ic-salle-tab",
    label: "Consultation room",
    content:
      "Exemple : Salle de consultation, Salle de prélèvement, salle de radiologue, salle d’echographie",
  },
  {
    icon: "ic-hosipital-bed",
    label: "Equipment room",
    content:
      "Exemple : Salle de consultation, Salle de prélèvement, salle de radiologue, salle d’echographie",
  },
];
function AddAgenda() {
  const [state, setstate] = useState({
    activeTab: null,
  });
  const { t, ready } = useTranslation("settings", {
    keyPrefix: "agenda",
  });
  return (
    <div className="container">
      <SettingsTabs data={TabData} getIndex={setstate} />
      {state.activeTab === 0 && <PractitionerForm />}
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
