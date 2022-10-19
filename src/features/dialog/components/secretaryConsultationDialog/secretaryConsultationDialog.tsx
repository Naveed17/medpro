import React, { useState } from "react";
import {
  Avatar,
  TextField,
  Typography,
  Stack,
  InputAdornment,
  Button,
  Checkbox,
  InputBase,
  IconButton,
} from "@mui/material";
import RootStyled from "./overrides/rootSyled";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
const limit = 255;
function SecretaryConsultationDialog({ ...props }) {
  const {
    data: { t },
  } = props;
  const [value, setvalue] = useState("");
  const [checked, setChecked] = useState(false);
  const [meeting, setMeeting] = useState<number>(1);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setvalue(event.target.value.slice(0, limit));
  };
  return (
    <RootStyled>
      <Stack
        alignItems="center"
        spacing={2}
        maxWidth={{ xs: "100%", md: "80%" }}
        mx="auto"
        width={1}>
        <Typography variant="subtitle1">
          {t("finish_the_consutation")}
        </Typography>
        <Typography>{t("type_the_instruction_for_the_secretary")}</Typography>
        <TextField
          fullWidth
          multiline
          value={value}
          onChange={handleChange}
          placeholder={t("type_instruction_for_the_secretary")}
          rows={4}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {value.length} / {limit}
              </InputAdornment>
            ),
          }}
        />
        <Button
          className="counter-btn"
          disableRipple
          color="info"
          variant="outlined"
          onClick={() => setChecked(!checked)}>
          <Checkbox checked={checked} />
          {t("plan_a_meeting")}
          {checked && (
            <>
              <InputBase
                inputProps={{
                  readOnly: true,
                }}
                value={meeting}
                startAdornment={
                  <IconButton
                    size="small"
                    disabled={meeting <= 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMeeting(meeting - 1);
                    }}>
                    <RemoveIcon />
                  </IconButton>
                }
                endAdornment={
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMeeting(meeting + 1);
                      if (meeting === 4) {
                        setMeeting(4);
                      }
                    }}>
                    <AddIcon />
                  </IconButton>
                }
              />

              {t("day")}
            </>
          )}
        </Button>
      </Stack>
    </RootStyled>
  );
}

export default SecretaryConsultationDialog;
