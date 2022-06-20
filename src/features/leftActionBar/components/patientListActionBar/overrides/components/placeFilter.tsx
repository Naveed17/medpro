import { useState, ChangeEvent } from "react";
import {
  Typography,
  Box,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  List,
  ListItem,
  ListItemButton,
  Checkbox,
} from "@mui/material";

export default function PlaceFilter({ ...props }) {
  const { item, t } = props;
  const [state, setstate] = useState({
    DOB: null,
    nextAppointmentDate: null,
    lastAppointmentDate: null,
    nextAppointmentTime: null,
    lastAppointmentTime: null,
    city: item.city?.cities[0],
    expanded: "",
  });
  const handleChangeCity = (event: ChangeEvent<HTMLInputElement>) => {
    setstate({ ...state, city: event.target.value });
  };

  return (
    <Box component="figure" sx={{ m: 0 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {t(`filter.${item.city?.heading}`)}
      </Typography>
      <FormControl size="small" fullWidth>
        <Select
          labelId="demo-simple-select-label"
          id={item.city?.heading}
          value={state.city}
          onChange={() => handleChangeCity}
          displayEmpty={true}
          sx={{ color: "text.secondary" }}
          renderValue={(value: string[]) =>
            value?.length
              ? Array.isArray(value)
                ? value.join(", ")
                : value
              : item.city?.placeholder
          }
        >
          {item.city?.cities.map((c: string, i: number) => (
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
  );
}
