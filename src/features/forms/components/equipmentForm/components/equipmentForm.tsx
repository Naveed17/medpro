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
  const { t } = props;
  const theme = useTheme();
  const [checked, setChecked] = useState<boolean>(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
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
          <Select placeholder={t("select-equipment-1")} list={names} />
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
          <Select placeholder={t("select-equipment-2")} list={names} />
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
          <Select placeholder={t("select-equipment-3")} list={names} />
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

export default EquipmentForm;
