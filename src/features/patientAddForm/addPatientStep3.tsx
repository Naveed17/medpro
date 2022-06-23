import React from "react";
import { Button, Stack, Typography, Box } from "@mui/material";
// import useSettings from "@settings/useSettings";
import Icon from "@themes/urlIcon";
//redux
export default function addPatientStep3() {
  // const settings = useSettings();
  // const { popupData } = useSelector((state) => state.actionState);
  // const {
  //     ModalType,
  //     modalSet,
  //     modalDataSet,
  //     popupSet,
  // } = settings;
  // const handleDuplicate = () => {
  //     popupSet(false)
  //     ModalType('DUPLICATE_DETECTED_MODAL')
  //     modalSet(true)
  //     modalDataSet({ ...popupData.step1, ...popupData.step2 })
  // }
  return (
    <Stack justifyContent="center" alignItems="center" height={1}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Patient ajouté
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit,sed do eiusmod
        tempor
      </Typography>
      <Stack direction="row" spacing={2} mt={5}>
        <Button variant="text-primary">Ajouter un autre patient</Button>
        <Button
          // onClick={handleDuplicate}
          variant="contained"
          color="warning"
          sx={{
            textAlign: "left",
            justifyContent: "flex-start",
            "& svg": {
              width: 16,
              height: 16,
              "& path": { fill: (theme) => theme.palette.text.primary },
            },
          }}
          startIcon={<Icon path="ic-agenda-+" />}
        >
          Ajouter RDV
        </Button>
      </Stack>
    </Stack>
  );
}
