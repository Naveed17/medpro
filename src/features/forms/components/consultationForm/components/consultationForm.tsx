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
  const { t } = props;
  const [state, setstate] = React.useState({
    value: "",
  });
  const [checked, setChecked] = useState<boolean>(false);
  const handleChangeSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
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
                <Select placeholder={t("selectSpecialty")} list={names} />
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
                <Select placeholder={t("selectConcerned")} list={names} />
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
                <Select placeholder={t("typeRoom")} list={names} />
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
                <Select placeholder={t("placeOfConsultation")} list={names} />
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
                        onChange={handleChangeSwitch}
                        checked={checked}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label={t("lamia_barnat")}
                  />
                </Box>
                <Select placeholder={t("no_access")} list={names} />
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
                        onChange={handleChangeSwitch}
                        checked={checked}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label={t("medical_secretary")}
                  />
                </Box>
                <Select placeholder={t("no_access")} list={names} />
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
                        onChange={handleChangeSwitch}
                        checked={checked}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label="Ali Tounsi"
                  />
                </Box>
                <Select placeholder={t("no_access")} list={names} />
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
                <Select placeholder={t("specialty_concerned")} list={names} />
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
                <Select placeholder={t("consultationPlace")} list={names} />
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
                        onChange={handleChangeSwitch}
                        checked={checked}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label={t("lamia_barnat")}
                  />
                </Box>
                <Select placeholder={t("no_access")} list={names} />
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
                        onChange={handleChangeSwitch}
                        checked={checked}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label={t("medical_secretary")}
                  />
                </Box>
                <Select placeholder={t("no_access")} list={names} />
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
                        onChange={handleChangeSwitch}
                        checked={checked}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label="Ali Tounsi"
                  />
                </Box>
                <Select placeholder={t("no_access")} list={names} />
              </Box>
            </Paper>
          </>
        )}
      </Box>
    </RootStyled>
  );
}

export default ConsultationForm;
