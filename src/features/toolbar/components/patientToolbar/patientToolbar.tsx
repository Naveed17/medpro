import { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { CustomStepper } from "@features/customStepper";
// import { DuplicateDetected } from "@features/duplicateDetected";
// import IconUrl from "@themes/urlIcon";
// import { Dialog } from "@features/dialog";
import { Typography, Button, Drawer, Stack } from "@mui/material";
import { useAppSelector, useAppDispatch } from "@app/redux/hooks";
import { configSelector } from "@features/base";
import {
  AddPatientStep1,
  AddPatientStep2,
  AddPatientStep3,
} from "@features/tabPanel";
// redux
import { tableActionSelector, onOpenPatientDrawer } from "@features/table";

function PatientToolbar({ ...props }) {
  const { onAddPatient, selectedPatient } = props;
  // selectors
  const dispatch = useAppDispatch();
  const { patientId, patientAction } = useAppSelector(tableActionSelector);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const { direction } = useAppSelector(configSelector);

  // useEffect hook for handling the table action drawer
  useEffect(() => {
    if (patientId && patientAction === "EDIT_PATIENT") {
      setOpenDrawer(true);
    }
  }, [patientId, patientAction]);

  const stepperData = [
    {
      title: "add-patient.personal-info",
      children: AddPatientStep1,
    },
    {
      title: "add-patient.additional-information",
      children: AddPatientStep2,
    },
    {
      title: "add-patient.fin",
      children: AddPatientStep3,
    },
  ];

  const { t, ready } = useTranslation("patient");
  if (!ready) return <>loading translations...</>;
  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        width={1}
        alignItems="center"
      >
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
      </Stack>
      <Drawer
        anchor={"right"}
        open={openDrawer}
        dir={direction}
        onClose={() => {
          setOpenDrawer(false);
          dispatch(
            onOpenPatientDrawer({
              patientId: "",
              patientAction: "",
            })
          );
        }}
        sx={{
          "& .MuiTabs-root": {
            position: "sticky",
            top: 0,
            bgcolor: (theme) => theme.palette.background.paper,
            zIndex: 11,
          },
        }}
      >
        <CustomStepper
          translationKey="patient"
          prefixKey="add-patient"
          stepperData={stepperData}
          scroll
          t={t}
          minWidth={648}
          onClose={() => {
            setOpenDrawer(false);
          }}
          onAddPatient={() => onAddPatient()}
          currentIndex={0}
          selectedPatient={selectedPatient}
        />
      </Drawer>
      {/* <Dialog
        action={DuplicateDetected}
        open={open}
        data={{ ...stepsData.step1, ...stepsData.step2 }}
        direction={direction}
        title={t("add-patient.dialog.title")}
        t={t}
        dialogSave={() => alert("save")}
        actionDialog={
          <>
            <Box
              className="modal-actions"
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button>{t("add-patient.dialog.later")}</Button>
              <Box className="btn-right">
                <Button
                  variant="text-black"
                  className="btn-cancel"
                  sx={{ ml: "auto", "& .react-svg": { marginTop: "-3px" } }}
                  startIcon={<IconUrl path="close" />}
                >
                  {" "}
                  <span className="sm-none">
                    {" "}
                    {t("add-patient.dialog.no-duplicates")}
                  </span>
                </Button>
                <Button
                  sx={{
                    ml: 1,
                    "& .react-svg svg": { width: "15px", height: "15px" },
                  }}
                  startIcon={<IconUrl path="check" />}
                >
                  <span className="sm-none"> {t("add-patient.register")}</span>
                </Button>
              </Box>
            </Box>
          </>
        }
        dialogClose={() => setOpen(false)}
      /> */}
    </>
  );
}

export default PatientToolbar;
