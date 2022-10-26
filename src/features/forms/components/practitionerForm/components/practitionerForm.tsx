import React from "react";

import {
  Box,
  Typography,
  Paper,
  FormControl,
  TextField,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Icon from "@themes/urlIcon";
import { Select } from "@features/forms";
import { useTheme } from "@mui/material/styles";
// Component
const AddForm = styled(Box)(({ theme }) => ({
  "& .right-top": {
    backgroundColor: "rgba(6, 150, 214, 0.12)",
    borderRadius: "10px 10px 0px 0px",
    padding: "8px 14px",
    display: "flex",
    alignItems: "center",
  },
  "& .right-items": {
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
  },
  "& .form-label-main": {
    [theme.breakpoints.down("md")]: {
      display: "block",
      "& .MuiTypography-root": {
        minWidth: "auto",
        width: "auto",
        textAlign: "left",
      },
      fieldset: {
        display: "block",
      },
      "& .name": {
        display: "block",
      },
    },
  },
}));
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
function PractitionerForm() {
  const theme = useTheme();
  return (
    <AddForm>
      <Typography variant="body2" mb={1} mt={2}>
        Practitioner
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
            Spécialité du praticien
          </Typography>
          <Select
            placeholder="Please select the specialty of the participant"
            list={names}
          />
        </Box>
        <Box
          className="form-label-main"
          sx={{ display: "flex", alignItems: "center", mb: "1.25rem" }}>
          <Typography
            sx={{ minWidth: 140, textAlign: "right" }}
            mr={2}
            variant="caption"
            color="text.secondary">
            Praticien
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
            Lieu
          </Typography>
          <Select
            placeholder="Veuillez choisir le lieu de consultation"
            list={names}
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
            Base patient
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            placeholder="Veuillez choisir le base patient"
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
        Agenda
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
            Nom
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            placeholder="Veuillez renseigner le nom de l’agenda"
          />
        </Box>
      </Paper>
    </AddForm>
  );
}

export default PractitionerForm;
