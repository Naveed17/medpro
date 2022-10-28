import React, { useState } from "react";

import {
  Box,
  Typography,
  Paper,
  FormControl,
  TextField,
  MenuItem,
} from "@mui/material";
import RootStyled from "./overrides/rootStyle";
import { useTheme } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

//Component
import { Select } from "@features/forms";

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];
function EquipmentForm({ ...props }) {
  const { t, formik } = props;
  const { values, getFieldProps, setFieldValue } = formik;
  const theme = useTheme();
  const { equipmentRoom } = values;
  return (
    <RootStyled>
      <Typography variant="body2" mb={1} mt={2}>
        {t("equipment")}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box
          className="form-label-main"
          sx={{ display: "flex", alignItems: "center", mb: "1.25rem" }}>
          <Typography
            sx={{ minWidth: 140, textAlign: "right" }}
            mr="14.5px"
            variant="caption"
            color="text.secondary">
            {t("speciality")}
          </Typography>
          <Select
            placeholder={t("select-equipment-1")}
            value={equipmentRoom.specialties}
            list={names}
            getData={(v: any) => setFieldValue("equipmentRoom.specialties", v)}
          />
        </Box>
        <Box
          className="form-label-main"
          sx={{ display: "flex", alignItems: "center", mb: "1.25rem" }}>
          <Typography
            sx={{ minWidth: 140, textAlign: "right" }}
            mr="14.5px"
            variant="caption"
            color="text.secondary">
            {t("type")}
          </Typography>
          <Select
            placeholder={t("select-equipment-2")}
            list={names}
            value={equipmentRoom.type}
            getData={(v: any) => setFieldValue("equipmentRoom.type", v)}
          />
        </Box>
        <Box
          className="form-label-main"
          sx={{ display: "flex", alignItems: "center", mb: "1.25rem" }}>
          <Typography
            sx={{ minWidth: 140, textAlign: "right" }}
            mr="14.5px"
            variant="caption"
            color="text.secondary">
            {t("place")}
          </Typography>
          <Select
            placeholder={t("consultationPlace")}
            value={equipmentRoom.place}
            list={names}
            getData={(v: any) => setFieldValue("equipmentRoom.place", v)}
          />
        </Box>
        <Box
          className="form-label-main"
          sx={{ display: "flex", alignItems: "center", mb: "1.25rem" }}>
          <Typography
            sx={{ minWidth: 140, textAlign: "right" }}
            mr="14.5px"
            variant="caption"
            color="text.secondary">
            {t("patientBase")}
          </Typography>
          <TextField
            {...getFieldProps("equipmentRoom.patientBase")}
            variant="outlined"
            size="small"
            fullWidth
            placeholder={t("placeholderPatientBase")}
          />
        </Box>
        <Box
          className="form-label-main"
          sx={{ display: "flex", alignItems: "center", mb: "1.25rem" }}>
          <Typography
            sx={{ maxWidth: { lg: 140, xs: "100%" }, textAlign: "right" }}
            mr="14.5px"
            variant="caption"
            color="text.secondary">
            {t("pattern")}
          </Typography>
          <Select
            placeholder={t("select-equipment-3")}
            list={names}
            value={equipmentRoom.pattern}
            getData={(v: any) => setFieldValue("equipmentRoom.pattern", v)}
          />
        </Box>
      </Paper>
      <Typography variant="body2" mb={1} mt={4}>
        {t("agenda")}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box
          className="form-label-main"
          sx={{ display: "flex", alignItems: "center", mb: "1.25rem" }}>
          <Typography
            sx={{ maxWidth: { lg: 140, xs: "100%" }, textAlign: "right" }}
            mr="14.5px"
            variant="caption"
            color="text.secondary">
            {t("name")}
          </Typography>
          <TextField
            {...getFieldProps("equipmentRoom.agenda")}
            variant="outlined"
            size="small"
            fullWidth
            placeholder={t("placeholderName")}
          />
        </Box>
      </Paper>
      <Typography variant="body2" mb={1} mt={4}>
        {t("rightsOfAgenda")}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box
          className="form-label-main"
          sx={{ display: "flex", alignItems: "center", mb: "1.25rem" }}>
          <Typography
            sx={{ maxWidth: { lg: 140, xs: "100%" }, width: "100%" }}
            mr="14.5px"
            variant="caption"
            color="text.secondary">
            {t("clone_existing_rights")}
          </Typography>
          <Select
            placeholder={t("clone_existing_rights_placeholder")}
            list={names}
            value={equipmentRoom.rightsOnAgenda.cloneExistingRights}
            getData={(v: any) =>
              setFieldValue(
                "equipmentRoom.rightsOnAgenda.cloneExistingRights",
                v
              )
            }
          />
        </Box>
        <Box
          className="form-label-main"
          sx={{ display: "flex", alignItems: "center", mb: "1.25rem" }}>
          <Box
            sx={{ maxWidth: { lg: 140, xs: "100%" }, width: "100%" }}
            mr="14.5px">
            <FormControlLabel
              control={
                <Switch
                  {...getFieldProps(
                    "equipmentRoom.rightsOnAgenda.lamiaBarnat.status"
                  )}
                  checked={equipmentRoom.rightsOnAgenda.lamiaBarnat.status}
                />
              }
              label={t("lamia_barnat")}
            />
          </Box>
          <Select
            placeholder={t("no_access")}
            list={names}
            value={equipmentRoom.rightsOnAgenda.lamiaBarnat.value}
            getData={(v: any) =>
              setFieldValue("equipmentRoom.rightsOnAgenda.lamiaBarnat.value", v)
            }
          />
        </Box>
        <Box
          className="form-label-main"
          sx={{ display: "flex", alignItems: "center", mb: "1.25rem" }}>
          <Box
            sx={{ maxWidth: { lg: 140, xs: "100%" }, width: "100%" }}
            mr="14.5px">
            <FormControlLabel
              control={
                <Switch
                  {...getFieldProps(
                    "equipmentRoom.rightsOnAgenda.medicalSecretary.status"
                  )}
                  inputProps={{ "aria-label": "controlled" }}
                  checked={equipmentRoom.rightsOnAgenda.medicalSecretary.status}
                />
              }
              label={t("medical_secretary")}
            />
          </Box>
          <Select
            placeholder={t("no_access")}
            list={names}
            value={equipmentRoom.rightsOnAgenda.medicalSecretary.value}
            getData={(v: any) =>
              setFieldValue(
                "equipmentRoom.rightsOnAgenda.medicalSecretary.value",
                v
              )
            }
          />
        </Box>
        <Box
          className="form-label-main"
          sx={{ display: "flex", alignItems: "center", mb: "1.25rem" }}>
          <Box
            sx={{ maxWidth: { lg: 140, xs: "100%" }, width: "100%" }}
            mr="14.5px">
            <FormControlLabel
              control={
                <Switch
                  {...getFieldProps(
                    "equipmentRoom.rightsOnAgenda.aliTounsi.status"
                  )}
                  inputProps={{ "aria-label": "controlled" }}
                  checked={equipmentRoom.rightsOnAgenda.aliTounsi.status}
                />
              }
              label="Ali Tounsi"
            />
          </Box>
          <Select
            placeholder={t("no_access")}
            list={names}
            value={equipmentRoom.rightsOnAgenda.aliTounsi.value}
            getData={(v: any) =>
              setFieldValue("equipmentRoom.rightsOnAgenda.aliTounsi.value", v)
            }
          />
        </Box>
      </Paper>
    </RootStyled>
  );
}

export default EquipmentForm;
