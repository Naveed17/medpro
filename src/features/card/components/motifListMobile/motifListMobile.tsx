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
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={6}>
 <Typography
          variant={"subtitle2"}
          color="primary.main"
          className="title">
          {data?.name}
        </Typography>
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
                onClick={() => editMotif(data,"edit")}
                size="small"
                >
                <IconUrl path="setting/edit" />
              </IconButton>
               <IconButton
              size="small"
              onClick={() => editMotif(data, "delete")}>
              <IconUrl path="setting/icdelete" />
            </IconButton>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </RootStyled>
  );
}

export default MotifListMobile;
