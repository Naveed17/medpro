import { useMemo  } from "react";
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
import { useTranslation } from "next-i18next";
function MotifListMobile({ ...props }) {
  const { data,  durations, handleChange, editMotif } = props;
  const { t, ready } = useTranslation("common");
  const duration = useMemo (() => {
    if(data.duration < 60){
      return data.duration  + " " + t("times.minutes");
    }
    if(data.duration > 59 && data.duration < 120){
      return data.duration / 60  + " " + t("times.hour");
    }
    if(data.duration > 119){
      return data.duration / 60  + " " + t("times.hours");
    }
}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  , [data.duration]);
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
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={6}>
       <Typography>
          {duration}
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
