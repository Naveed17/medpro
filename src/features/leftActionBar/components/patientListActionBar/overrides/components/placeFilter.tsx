import { useState, ChangeEvent, useEffect } from "react";
import {
  Typography,
  Box,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  List,
  ListItem,
  FormGroup,
  Checkbox,
} from "@mui/material";
import { useRouter } from "next/router";
import _ from "lodash";
import { useIsMountedRef } from "@app/hooks";
function PlaceFilter({ ...props }) {
  const { item, t } = props;
  const router = useRouter();
  const isMounted = useIsMountedRef();
  const { query } = router;
  const { states, city } = query;
  const [state, setstate] = useState({
    city: "",
    states: [],
  });
  const handleChangeCity = (event: ChangeEvent<HTMLInputElement>) => {
    setstate({ ...state, city: event.target.value });
    router.push({
      query: { ...router.query, city: event.target.value },
    });
  };

  const handleChange = (props, e) => {
    var data = state.states;
    if (e.target.checked) {
      data = [...data, props.toLowerCase()];
      setstate({ ...state, states: [...state.states, props.toLowerCase()] });
      router.push({
        query: {
          ...router.query,
          states: [...state.states, props.toLowerCase()].join("_"),
        },
      });
    } else {
      const index = data.indexOf(props.toLowerCase());
      data.splice(index, 1);
      if (data.length > 0) {
        const filtered = state.states.filter(
          (gen) => gen !== props.toLowerCase()
        );
        setstate({ ...state, states: filtered });
        router.push({
          query: { ...router.query, states: filtered.join("_") },
        });
      } else {
        const query = _.omit(router.query, "states");
        router.push({
          query,
        });
      }
    }
  };
  useEffect(() => {
    if (isMounted.current) {
      if (_.has(router.query, "states")) {
        setstate({
          ...state,
          states: [...state.states, ...states.split("_")],
        });
      }
    }
  }, [query, isMounted]);
  console.log(state.states, "states");
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
          onChange={handleChangeCity}
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

      <FormControl sx={{ mt: 1 }} component="fieldset" variant="standard">
        <FormGroup>
          {item.city?.cities.map((c: string, i: number) => (
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={state.states.includes(c.toLowerCase())}
                  onChange={(e) => handleChange(c.toLowerCase(), e)}
                  name={c.toLowerCase()}
                />
              }
              label={
                <Typography
                  sx={{
                    fontSize: 10,
                    span: {
                      ml: 1,
                      color: (theme) => theme.palette.primary.main,
                    },
                  }}
                >
                  {c}
                  <span>(6)</span>
                </Typography>
              }
            />
          ))}
        </FormGroup>
      </FormControl>
      {/* <List>
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
                label={
                  <Typography variant="body2" color="text.secondary">
                    </Typography>
                }
                sx={{ mr: "7px" }}
              />
              {/* <Typography
                component="small"
                variant="caption"
                sx={{ fontSize: "9px" }}
                color="primary.main"
              >
                ({item.city?.cities.length})
              </Typography> */}
      {/* </ListItemButton> */}
    </Box>
  );
}
export default PlaceFilter;
