import React, { useState } from "react";
import { Box, Typography, Paper, TextField, MenuItem } from "@mui/material";
import Icon from "@themes/urlIcon";
import { Select } from "@features/forms";
import RootStyled from "./overrides/rootStyle";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
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
function PractitionerForm({ ...props }) {
  const { t } = props;
  const [checked, setChecked] = useState<boolean>(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  return (
    <RootStyled>
      <Typography variant="body2" mb={1} mt={2}>
        {t("practitioner")}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box
          className="form-label-main"
          sx={{ display: "flex", alignItems: "center", mb: "1.25rem" }}>
          <Typography
            sx={{ minWidth: 140, textAlign: "right" }}
            mr={2}
            variant="caption"
            color="text.secondary">
            {t("practitionerSpecialty")}
          </Typography>
          <Select placeholder={t("placeholderSpecialty")} list={names} />
        </Box>
        <Box
          className="form-label-main"
          sx={{ display: "flex", alignItems: "center", mb: "1.25rem" }}>
          <Typography
            sx={{ minWidth: 140, textAlign: "right" }}
            mr={2}
            variant="caption"
            color="text.secondary">
            {t("practitioner")}
          </Typography>
          <Select placeholder="Veuillez choisir le praticien" list={names} />
        </Box>
        <Box
          className="form-label-main"
          sx={{ display: "flex", alignItems: "center", mb: "1.25rem" }}>
          <Typography
            sx={{ minWidth: 140, textAlign: "right" }}
            mr={2}
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
        <Box
          className="form-label-main"
          sx={{ display: "flex", alignItems: "center", mb: "9.5px" }}>
          <Typography
            sx={{ minWidth: 132, width: 132, textAlign: "right" }}
            mr="14.5px"
            variant="caption"
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
    </RootStyled>
  );
}

export default PractitionerForm;
