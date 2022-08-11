import { SuccessCard } from "@features/card/";
import { useTranslation } from "next-i18next";
function AddPatientStep3() {
  const { t, ready } = useTranslation("patient", { keyPrefix: "add-patient" });
  if (!ready) return <>loading translations...</>;
  return (
    <SuccessCard
      data={{
        title: t("added"),
        description: t("description"),
        icon: "ic-agenda-+",
        addRDV: t("add-appo"),
        addPatient: t("add-new"),
      }}
    />
  );
}
export default AddPatientStep3;
