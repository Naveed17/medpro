import { SuccessCard } from "@features/card/";
import { useTranslation } from "next-i18next";
function AddPatientStep3({ ...props }) {
  const { t, ready } = useTranslation("patient", { keyPrefix: "add-patient" });
  if (!ready) return <>loading translations...</>;
  return <SuccessCard t={t} />;
}
export default AddPatientStep3;
