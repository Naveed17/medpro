import React from "react";
import Typography from "@mui/material/Typography";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { StaticDatePicker } from "@features/staticDatePicker";
import Grid from "@mui/material/Grid";

const listData = [
  { id: 1, title: "Première consultation", color: "#1BC47D" },
  { id: 2, title: "Consultation de suivi", color: "#0696D6" },
  { id: 3, title: "Troubles de la respiration", color: "#E83B68" },
  { id: 4, title: "Echo", color: "#F1AC44" },
];
function AddRDVStep1() {
  const [age, setAge] = React.useState("");
  const [date, setdate] = React.useState<Date | null>(new Date());

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
  return (
    <div>
      <Typography variant="h6" color="text.primary">
        Réservez un créneau
      </Typography>
      <Typography variant="body1" color="text.primary" mt={3} mb={1}>
        Motif de consultation
      </Typography>
      <FormControl fullWidth size="small">
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          onChange={handleChange}
          sx={{
            "& .MuiSelect-select svg": {
              display: "none",
            },
          }}
        >
          {listData.map((v) => (
            <MenuItem value={v.id}>
              <FiberManualRecordIcon
                fontSize="small"
                sx={{ mr: 1, color: v.color }}
              />{" "}
              {v.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography
        variant="body1"
        color="text.primary"
        fontWeight={500}
        mt={5}
        mb={0.5}
        sx={{ textTransform: "uppercase", fontWeight: 500 }}
      >
        Motif de consultation
      </Typography>
      <Typography variant="body1" color="text.primary">
        Choisissez le praticien qui affecte cette consultation
      </Typography>
      <br />
      <br />
      <br />
      <br />
      <Typography
        variant="body1"
        color="text.primary"
        fontWeight={500}
        mt={5}
        mb={0.5}
        sx={{ textTransform: "uppercase", fontWeight: 500 }}
      >
        Créneau horaire
      </Typography>
      <Typography variant="body1" color="text.primary" mb={1}>
        Veuillez choisir les dates du RDV
      </Typography>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <StaticDatePicker
            onChange={(newDate: Date) => setdate(newDate)}
            value={date}
            loading={true}
            selected={date}
          />
        </Grid>
      </Grid>
    </div>
  );
}
export default AddRDVStep1;
