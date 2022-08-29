import { SuccessCard } from "@features/card/";
import { useTranslation } from "next-i18next";
import { useAppDispatch } from "@app/redux/hooks";
import { onAddPatient } from "@features/tabPanel";

function AddPatientStep3({ ...props }) {
  const { onNext } = props;
  const dispatch = useAppDispatch();
  const initialStep = {
    patient_group: "",
    first_name: "",
    last_name: "",
    birthdate: "",
    phone: "",
    gender: "",
  };

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
      onClickTextButton={() => {
        dispatch(onAddPatient({ step1: initialStep }));
        onNext(0);
      }}
    />
  );
}
export default AddPatientStep3;
