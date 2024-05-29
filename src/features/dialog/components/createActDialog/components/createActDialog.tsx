import {
  Autocomplete,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

function CreateActDialog({ ...props }) {
  const { data } = props;
  const { acts, t, isMobile, newFees, setNewFees, filter, devise } = data;
  return (
    <Stack spacing={1}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        spacing={1}
        width={1}
      >
        <Stack spacing={0.5} width={1}>
          <Typography variant="body2" color="text.secondary">
            {t("table.name")}{" "}
            <Typography variant="caption" color="error">
              *
            </Typography>
          </Typography>
          <Autocomplete
            size="small"
            value={newFees.act}
            onChange={(event, newValue) => {
              if (typeof newValue === "string") {
                setNewFees({
                  ...newFees,
                  act: newValue,
                });
              } else if (newValue && newValue.inputValue) {
                // Create a new value from the user input
                setNewFees({
                  ...newFees,
                  act: newValue.inputValue,
                });
              } else {
                setNewFees({
                  ...newFees,
                  act: newValue as ActModel,
                });
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
              // Suggest the creation of a new value
              const isExisting = options.some(
                (option) => inputValue === option.name
              );
              if (inputValue !== "" && !isExisting) {
                filtered.push({
                  inputValue,
                  name: `${t("add_act")} "${inputValue}"`,
                });
              }

              return filtered;
            }}
            selectOnFocus
            clearOnEscape
            handleHomeEndKeys
            id="name"
            options={acts ? acts : []}
            getOptionLabel={(option) => {
              // Value selected with enter, right from the input
              if (typeof option === "string") {
                return option;
              }
              // Add "xxx" option created dynamically
              if (option.inputValue) {
                return option.inputValue;
              }
              // Regular option
              return option.name;
            }}
            renderOption={(props, option) => <li {...props}>{option.name}</li>}
            freeSolo
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={t("placeholder_act")}
                fullWidth
              />
            )}
          />
        </Stack>
        <Stack spacing={0.5} width={1}>
          <Typography variant="body2" color="text.secondary">
            {t("table.code")}{" "}
            <Typography variant="caption" color="error">
              *
            </Typography>
          </Typography>
          <TextField
            id="outlined-basic"
            value={newFees.code}
            type={"text"}
            size="small"
            placeholder={t("table.code")}
            onChange={(ev) => {
              setNewFees({
                ...newFees,
                code: ev.target.value,
              });
            }}
            variant="outlined"
            InputProps={{
              style: {
                backgroundColor: "white",
              },
            }}
          />
        </Stack>
      </Stack>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        spacing={1}
        width={1}
      >
        <Stack spacing={0.5} width={1}>
          <Typography variant="body2" color="text.secondary">
            {t("table.contribution")}{" "}
            <Typography variant="caption" color="error">
              *
            </Typography>
          </Typography>
          <TextField
            id="outlined-basic"
            value={newFees.contribution}
            type={"text"}
            size="small"
            placeholder={t("dialog.contribution_placeholder")}
            InputProps={{
              style: {
                backgroundColor: "white",
              },
            }}
            onChange={(ev) => {
              setNewFees({
                ...newFees,
                contribution: ev.target.value,
              });
            }}
            variant="outlined"
            {...(isMobile && {
              fullWidth: true,
            })}
          />
        </Stack>
        <Stack spacing={0.5} width={1}>
          <Typography variant="body2" color="text.secondary">
            {t("table.amount")}{" "}
            <Typography variant="caption" color="error">
              *
            </Typography>
          </Typography>
          <TextField
            id="outlined-basic"
            value={newFees.fees}
            type={"number"}
            size="small"
            placeholder={t("dialog.amount_placeholder")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{devise}</InputAdornment>
              ),
              style: {
                backgroundColor: "white",
              },
            }}
            onChange={(ev) => {
              setNewFees({
                ...newFees,
                fees: ev.target.value,
              });
            }}
            variant="outlined"
          />
        </Stack>
      </Stack>
    </Stack>
  );
}

export default CreateActDialog;
