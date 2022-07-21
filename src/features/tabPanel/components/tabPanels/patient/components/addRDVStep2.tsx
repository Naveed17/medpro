import React from "react";
import { useTranslation } from "next-i18next";

import {
  Box,
  Typography,
  TextField,
  Stack,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
  Button,
} from "@mui/material";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

function AddRDVStep2({ ...props }) {
  const { onClickCancel, onNext } = props;
  const [age, setAge] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
  const { t, ready } = useTranslation("patient", {
    keyPrefix: "add-appointment",
  });
  if (!ready) return <>loading translations...</>;

  return (
    <div>
      <Box className="inner-section">
        <Typography variant="h6" color="text.primary">
          {t("book-a-slot")}
        </Typography>
        <Typography
          variant="body1"
          color="text.primary"
          fontWeight={500}
          mt={2}
          mb={1}
          sx={{ textTransform: "uppercase" }}
        >
          Instruction pour le patient
        </Typography>
        <TextField
          id="le-patient"
          placeholder="Tapez instruction pour le patient"
          multiline
          rows={4}
          fullWidth
        />
        <Typography
          variant="body1"
          color="text.primary"
          fontWeight={500}
          mt={4}
          mb={1}
          sx={{ textTransform: "uppercase" }}
        >
          Instruction pour le patient
        </Typography>
        <Stack spacing={2} flexDirection="row" alignItems="center">
          <Typography variant="body1" color="text.primary" minWidth={150}>
            SMS de rappel en{" "}
          </Typography>
          <FormControl fullWidth size="small">
            <Select id="demo-simple-select" value={age} onChange={handleChange}>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Stack spacing={2} flexDirection="row" alignItems="center" mt={1}>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Programmer un SMS de rappel pour le patient"
            />
          </FormGroup>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <Select id="demo-simple-select" value={age} onChange={handleChange}>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>{" "}
          <Typography variant="body1" color="text.primary" px={1.2} mt={0}>
            to
          </Typography>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <Select id="demo-simple-select" value={age} onChange={handleChange}>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>
      <Paper
        sx={{
          borderRadius: 0,
          borderWidth: "0px",
          textAlign: "right",
        }}
        className="action"
      >
        <Button
          size="medium"
          variant="text-primary"
          color="primary"
          onClick={() => onClickCancel()}
          sx={{
            mr: 1,
          }}
        >
          {t("cancel")}
        </Button>
        <Button
          onClick={() => onNext(2)}
          size="medium"
          variant="contained"
          color="primary"
        >
          {t("next")}
        </Button>
      </Paper>
    </div>
  );
}
export default AddRDVStep2;
