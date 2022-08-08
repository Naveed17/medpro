import { SuccessCard } from "@features/card/";
import { useTranslation } from "next-i18next";
function AddRDVStep3() {
  const { t, ready } = useTranslation("patient", {
    keyPrefix: "add-appointment",
  });
  if (!ready) return <>loading translations...</>;
  return (
    <SuccessCard
      data={{
        title: t("added"),
        description: t("description"),
      }}
    />
  );
}
export default AddRDVStep3;
