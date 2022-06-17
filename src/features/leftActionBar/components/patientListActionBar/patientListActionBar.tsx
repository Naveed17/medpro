import {
  useState,
  MouseEvent,
  ChangeEvent,
  useCallback,
  Fragment,
} from "react";
import {
  Typography,
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  InputLabel,
  MenuItem,
  Select,
  List,
  ListItem,
  ListItemButton,
  Checkbox,
  Grid,
} from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Icon from "@themes/urlIcon";
import { rightActionData } from "./data.js";
import { FilterContainer } from "./overrides/patientListActionBarStyled";
export default function PatientListActionBar() {
  const { title, collapse } = rightActionData.filter;
  const [state, setstate] = useState({
    DOB: null,
    nextAppointmentDate: null,
    lastAppointmentDate: null,
    nextAppointmentTime: null,
    lastAppointmentTime: null,
    city: "",
    expanded: "",
  });

  const handleChangeCity = (event: ChangeEvent<HTMLInputElement>) => {
    setstate({ ...state, city: event.target.value });
  };

  const handleChange = useCallback(
    (panel: string) => (event: any, newExpanded: boolean) => {
      setstate({ ...state, expanded: newExpanded ? panel : "" });
    },
    [state.expanded]
  );
  return (
    <div>
      <FilterContainer>
        <Typography
          variant="h6"
          color="text.primary"
          sx={{ py: 5, pl: "10px", mb: "0.21em" }}
          gutterBottom
        >
          {title}
        </Typography>
        {collapse.map((item, index) => (
          <MuiAccordion
            disableGutters
            elevation={0}
            square
            expanded={state.expanded === item.heading?.title}
            onChange={handleChange(item.heading?.title)}
            key={`collapse-${index}`}
          >
            <MuiAccordionSummary
              expandIcon={<Icon path="ic-expand-more" />}
              id={title}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Icon path={item.heading?.icon} />
                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", ml: 1 }}
                >
                  {item.heading?.title}
                </Typography>
              </Box>
            </MuiAccordionSummary>
            <MuiAccordionDetails>
              {item.heading?.title === "User" && (
                <Box component="figure" sx={{ m: 0 }}>
                  <Typography variant="body2" color="text.secondary">
                    {item.gender?.heading}
                  </Typography>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      aria-label="gender"
                      name="row-radio-buttons-group"
                    >
                      {item.gender?.genders.map((g, i) => (
                        <FormControlLabel
                          sx={{ ml: i === 1 ? "5px" : 0 }}
                          key={`gender-${i}`}
                          value={g}
                          control={<Radio />}
                          label={g}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                  {item.textField?.labels.map((lab, i) => (
                    <Fragment key={`userfilter-label-${i}`}>
                      {lab.label === "Name" || lab.label === "Number phone" ? (
                        <>
                          <InputLabel shrink htmlFor={lab.label} sx={{ mt: 2 }}>
                            {lab.label}
                          </InputLabel>
                          <TextField fullWidth placeholder={lab.placeholder} />
                        </>
                      ) : (
                        <>
                          <InputLabel shrink htmlFor={lab.label} sx={{ mt: 2 }}>
                            {lab.label}
                          </InputLabel>

                          {/* <DatePicker /> */}
                        </>
                      )}
                    </Fragment>
                  ))}
                </Box>
              )}
              {item.heading?.title === "Place" && (
                <Box component="figure" sx={{ m: 0 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {item.city?.heading}
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <Select
                      labelId="demo-simple-select-label"
                      id={item.city?.heading}
                      value={state.city}
                      onChange={() => handleChangeCity}
                      displayEmpty={true}
                      sx={{ color: "text.secondary" }}
                      renderValue={(value) =>
                        value?.length
                          ? Array.isArray(value)
                            ? value.join(", ")
                            : value
                          : item.city?.placeholder
                      }
                    >
                      {item.city?.cities.map((c, i) => (
                        <MenuItem key={`city-${i}`} value={c}>
                          {c}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <nav aria-label="main mailbox folders">
                    <List>
                      <ListItem disablePadding sx={{ px: 0 }}>
                        <ListItemButton
                          disableRipple
                          sx={{
                            p: 0,
                            pl: 1,
                            ":hover": { backgroundColor: "transparent" },
                          }}
                        >
                          <FormControlLabel
                            control={<Checkbox />}
                            label="All"
                            sx={{ mr: "7px" }}
                          />
                          <Typography
                            component="small"
                            variant="caption"
                            sx={{ fontSize: "9px" }}
                            color="primary.main"
                          >
                            ({item.city?.cities.length})
                          </Typography>
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding sx={{ px: 0 }}>
                        <ListItemButton
                          disableRipple
                          sx={{
                            p: 0,
                            pl: 1,
                            ":hover": { backgroundColor: "transparent" },
                          }}
                        >
                          <FormControlLabel
                            control={<Checkbox />}
                            label="All"
                            sx={{ mr: "7px" }}
                          />
                          <Typography
                            component="small"
                            variant="caption"
                            sx={{ fontSize: "9px" }}
                            color="primary.main"
                          >
                            ({item.city?.cities.length})
                          </Typography>
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding sx={{ px: 0 }}>
                        <ListItemButton
                          disableRipple
                          sx={{
                            p: 0,
                            pl: 1,
                            ":hover": { backgroundColor: "transparent" },
                          }}
                        >
                          <FormControlLabel
                            control={<Checkbox />}
                            label="All"
                            sx={{ mr: "7px" }}
                          />
                          <Typography
                            component="small"
                            variant="caption"
                            sx={{ fontSize: "9px" }}
                            color="primary.main"
                          >
                            ({item.city?.cities.length})
                          </Typography>
                        </ListItemButton>
                      </ListItem>
                    </List>
                  </nav>
                </Box>
              )}
              {item.heading?.title === "Appointment" && (
                <Box component="figure" sx={{ m: 0 }}>
                  <Typography variant="body2" color="text.secondary">
                    {item.type?.heading}
                  </Typography>
                  <Box sx={{ display: "flex" }}>
                    {item.type?.types.map((t, i) => (
                      <Box
                        key={`appo-type${i}`}
                        component="label"
                        htmlFor={`${t.text}-${i}`}
                        color="text.secondary"
                        sx={{
                          display: "flex",
                          fontSize: (theme) => theme.typography.body2,
                          alignItems: "center",
                          ml: i === 1 ? 1 : 0,
                        }}
                      >
                        <Checkbox id={`${t.text}-${i}`} />
                        <Icon path={t.icon} className={`${t.text}-icon-${i}`} />
                        {t.text}
                      </Box>
                    ))}
                  </Box>
                  <Box>
                    <InputLabel shrink sx={{ mt: 2 }}>
                      {"Next Appointment"}
                    </InputLabel>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        {/* <DatePicker /> */}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        {/* <TimePicker /> */}
                      </Grid>
                    </Grid>
                  </Box>
                  <Box>
                    <InputLabel shrink sx={{ mt: 2 }}>
                      {"Last Appointment"}
                    </InputLabel>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        {/* <DatePicker /> */}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        {/* <TimePicker /> */}
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              )}
            </MuiAccordionDetails>
          </MuiAccordion>
        ))}
      </FilterContainer>
    </div>
  );
}
