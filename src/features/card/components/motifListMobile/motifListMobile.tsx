import {
  Typography,
  IconButton,
  Stack,
  Box,
  Select,
  Switch,
  MenuItem,
  Grid,
} from "@mui/material";
import RootStyled from "./overrides/rootStyled";
import IconUrl from "@themes/urlIcon";
function MotifListMobile({ ...props }) {
  const { data, t, durations, handleChange, editMotif } = props;
  return (
    <RootStyled
      sx={{
        "&:before": {
          bgcolor: data?.color,
          width: ".4rem",
        },
      }}>
      <Box className="card-main">
        <Typography
          variant={"subtitle2"}
          color="primary.main"
          className="title">
          {data?.name}
        </Typography>
        <Grid container spacing={1} alignItems="flex-end">
          <Grid item xs={6}>
            <Typography gutterBottom variant="body2" fontWeight={500}>
              {t("table.duration")}
            </Typography>
            <Select
              fullWidth
              size="small"
              id="demo-select-small"
              value={data.duration}
              onChange={(ev) => {
                handleChange(data, "duration", ev.target.value);
              }}
              name="duration">
              {durations.map((duration: any) => (
                <MenuItem key={duration.value} value={duration.value}>
                  {duration.date + " " + t("times." + duration.unity)}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={6}>
            <Stack
              width={1}
              direction="row"
              spacing={1}
              justifyContent="flex-end"
              alignItems="center">
              <Switch
                name="active"
                onChange={(e) => handleChange(data, "active", "")}
                checked={data.isEnabled}
              />
              <IconButton
                onClick={() => editMotif(data)}
                size="small"
                sx={{ mr: { md: 1 } }}>
                <IconUrl path="setting/edit" />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </RootStyled>
  );
}

export default MotifListMobile;
