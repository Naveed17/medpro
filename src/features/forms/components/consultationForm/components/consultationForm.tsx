import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
//Component
import { Select } from "@features/forms";
import RootStyled from "./overrides/rootStyle";
import Switch from "@mui/material/Switch";
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
function ConsultationForm({ ...props }) {
  const theme = useTheme();
  const { t, formik } = props;
  const { values, getFieldProps, setFieldValue } = formik;
  const [state, setstate] = React.useState({
    value: "",
  });
  const { consultationRoom } = values;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setstate({ ...state, value: event.target.value });
  };
  return (
    <RootStyled>
      <Typography variant="body2" mb={1} mt={2}>
        {t("whoMakes")}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <FormControl
          component="fieldset"
          fullWidth
          sx={{ justifyContent: "center", alignItems: "center" }}>
          <RadioGroup
            onChange={handleChange}
            row
            aria-label="gender"
            name="row-radio-buttons-group">
            <FormControlLabel
              sx={{ mr: 1 }}
              value="practitioner"
              control={<Radio size="small" />}
              label={t("practitioner")}
            />
            <FormControlLabel
              sx={{ ml: 1 }}
              value="assistant"
              control={<Radio size="small" />}
              label={t("assistant")}
            />
          </RadioGroup>
        </FormControl>
      </Paper>
      <Box mt={3}>
        {state.value === "practitioner" && (
          <>
            <Typography variant="body2" mb={1} mt={2}>
              {t("room")}
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
                  {t("number_of_rooms")}
                </Typography>
                <Select
                  placeholder={t("selectSpecialty")}
                  value={consultationRoom.practitioner.numberOfRooms}
                  list={names}
                  getData={(v: any) =>
                    setFieldValue(
                      "consultationRoom.practitioner.numberOfRooms",
                      v
                    )
                  }
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
                  {t("perRoom")}
                </Typography>
                <TextField
                  {...getFieldProps(
                    "consultationRoom.practitioner.numberOfAccessesPerRoom"
                  )}
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder={t("placeholderRoom")}
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
                  {t("specialties")}
                </Typography>
                <Select
                  value={consultationRoom.practitioner.specialties}
                  placeholder={t("selectConcerned")}
                  list={names}
                  getData={(v: any) =>
                    setFieldValue(
                      "consultationRoom.practitioner.specialties",
                      v
                    )
                  }
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
                  placeholder={t("typeRoom")}
                  value={consultationRoom.practitioner.type}
                  list={names}
                  getData={(v: any) =>
                    setFieldValue("consultationRoom.practitioner.type", v)
                  }
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
                  {t("location")}
                </Typography>
                <Select
                  placeholder={t("placeOfConsultation")}
                  value={consultationRoom.practitioner.location}
                  list={names}
                  getData={(v: any) =>
                    setFieldValue("consultationRoom.practitioner.location", v)
                  }
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
                  {...getFieldProps(
                    "consultationRoom.practitioner.patientBase"
                  )}
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder={t("placeholderPatientBase")}
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
                  sx={{ minWidth: 140, textAlign: "right" }}
                  mr="14.5px"
                  variant="caption"
                  color="text.secondary">
                  {t("name")}
                </Typography>
                <TextField
                  {...getFieldProps("consultationRoom.practitioner.agenda")}
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
                  value={
                    consultationRoom.practitioner.rightsOnAgenda
                      .cloneExistingRights
                  }
                  list={names}
                  getData={(v: any) =>
                    setFieldValue(
                      "consultationRoom.practitioner.rightsOnAgenda.cloneExistingRights",
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
                          "consultationRoom.practitioner.rightsOnAgenda.lamiaBarnat.status"
                        )}
                        checked={
                          consultationRoom.practitioner.rightsOnAgenda
                            .lamiaBarnat.status
                        }
                      />
                    }
                    label={t("lamia_barnat")}
                  />
                </Box>
                <Select
                  placeholder={t("no_access")}
                  list={names}
                  value={
                    consultationRoom.practitioner.rightsOnAgenda.lamiaBarnat
                      .value
                  }
                  getData={(v: any) =>
                    setFieldValue(
                      "consultationRoom.practitioner.rightsOnAgenda.lamiaBarnat.value",
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
                          "consultationRoom.practitioner.rightsOnAgenda.medicalSecretary.status"
                        )}
                        inputProps={{ "aria-label": "controlled" }}
                        checked={
                          consultationRoom.practitioner.rightsOnAgenda
                            .medicalSecretary.status
                        }
                      />
                    }
                    label={t("medical_secretary")}
                  />
                </Box>
                <Select
                  placeholder={t("no_access")}
                  list={names}
                  value={
                    consultationRoom.practitioner.rightsOnAgenda
                      .medicalSecretary.value
                  }
                  getData={(v: any) =>
                    setFieldValue(
                      "consultationRoom.practitioner.rightsOnAgenda.medicalSecretary.value",
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
                          "consultationRoom.practitioner.rightsOnAgenda.aliTounsi.status"
                        )}
                        inputProps={{ "aria-label": "controlled" }}
                        checked={
                          consultationRoom.practitioner.rightsOnAgenda.aliTounsi
                            .status
                        }
                      />
                    }
                    label="Ali Tounsi"
                  />
                </Box>
                <Select
                  placeholder={t("no_access")}
                  list={names}
                  value={
                    consultationRoom.practitioner.rightsOnAgenda.aliTounsi.value
                  }
                  getData={(v: any) =>
                    setFieldValue(
                      "consultationRoom.practitioner.rightsOnAgenda.aliTounsi.value",
                      v
                    )
                  }
                />
              </Box>
            </Paper>
          </>
        )}
        {state.value === "assistant" && (
          <>
            <Typography variant="body2" mb={1} mt={2}>
              {t("room")}
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
                  {t("specialty_of_practitioner")}
                </Typography>
                <Select
                  placeholder={t("specialty_concerned")}
                  list={names}
                  value={consultationRoom.assistant.specialtyOfPractitioner}
                  getData={(v: any) =>
                    setFieldValue(
                      "consultationRoom.assistant.specialtyOfPractitioner",
                      v
                    )
                  }
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
                  list={names}
                  value={consultationRoom.assistant.place}
                  getData={(v: any) =>
                    setFieldValue("consultationRoom.assistant.place", v)
                  }
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
                  {...getFieldProps("consultationRoom.assistant.patientBase")}
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder={t("placeholderPatientBase")}
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
                  sx={{ minWidth: 140, textAlign: "right" }}
                  mr="14.5px"
                  variant="caption"
                  color="text.secondary">
                  {t("name")}
                </Typography>
                <TextField
                  {...getFieldProps("consultationRoom.assistant.agenda")}
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
                  value={
                    consultationRoom.assistant.rightsOnAgenda
                      .cloneExistingRights
                  }
                  getData={(v: any) =>
                    setFieldValue(
                      "consultationRoom.assistant.rightsOnAgenda.cloneExistingRights",
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
                          "consultationRoom.assistant.rightsOnAgenda.lamiaBarnat.status"
                        )}
                        checked={
                          consultationRoom.assistant.rightsOnAgenda.lamiaBarnat
                            .status
                        }
                      />
                    }
                    label={t("lamia_barnat")}
                  />
                </Box>
                <Select
                  placeholder={t("no_access")}
                  list={names}
                  value={
                    consultationRoom.assistant.rightsOnAgenda.lamiaBarnat.value
                  }
                  getData={(v: any) =>
                    setFieldValue(
                      "consultationRoom.assistant.rightsOnAgenda.lamiaBarnat.value",
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
                          "consultationRoom.assistant.rightsOnAgenda.medicalSecretary.status"
                        )}
                        inputProps={{ "aria-label": "controlled" }}
                        checked={
                          consultationRoom.assistant.rightsOnAgenda
                            .medicalSecretary.status
                        }
                      />
                    }
                    label={t("medical_secretary")}
                  />
                </Box>
                <Select
                  placeholder={t("no_access")}
                  list={names}
                  value={
                    consultationRoom.assistant.rightsOnAgenda.medicalSecretary
                      .value
                  }
                  getData={(v: any) =>
                    setFieldValue(
                      "consultationRoom.assistant.rightsOnAgenda.medicalSecretary.value",
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
                          "consultationRoom.assistant.rightsOnAgenda.aliTounsi.status"
                        )}
                        inputProps={{ "aria-label": "controlled" }}
                        checked={
                          consultationRoom.assistant.rightsOnAgenda.aliTounsi
                            .status
                        }
                      />
                    }
                    label="Ali Tounsi"
                  />
                </Box>
                <Select
                  placeholder={t("no_access")}
                  list={names}
                  value={
                    consultationRoom.assistant.rightsOnAgenda.aliTounsi.value
                  }
                  getData={(v: any) =>
                    setFieldValue(
                      "consultationRoom.assistant.rightsOnAgenda.aliTounsi.value",
                      v
                    )
                  }
                />
              </Box>
            </Paper>
          </>
        )}
      </Box>
    </RootStyled>
  );
}

export default ConsultationForm;
