import { SuccessCard } from "@features/card";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function AddRDVStep3() {
  const { t, ready } = useTranslation("patient", {
    keyPrefix: "add-appointment",
  });

  if (!ready) return (<LoadingScreen  button text={"loading-error"}/>);
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
