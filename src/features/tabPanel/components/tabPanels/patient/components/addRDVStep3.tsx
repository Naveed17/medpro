import { SuccessCard } from "@features/card";
import { useTranslation } from "next-i18next";
import {LoadingScreen} from "@features/loadingScreen";
function AddRDVStep3() {
  const { t, ready } = useTranslation("patient", {
    keyPrefix: "add-appointment",
  });

  if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);
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
