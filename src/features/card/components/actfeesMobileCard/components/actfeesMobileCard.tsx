import React, { useState, useEffect } from "react";
import ActFeesCardStyled from "./overrides/actfeesCardStyle";
import {
  CardContent,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  Grid,
  IconButton,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import IconUrl from "@themes/urlIcon";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { DefaultCountry } from "@lib/constants";
function ActfeesMobileCard({ ...props }) {
  const { data, editMotif, t, handleSelected } = props;
  const [fees, setFees] = useState("");
  const [name, setName] = useState("");
  const [edit, setEdit] = useState("");

  useEffect(() => {
    setFees(data?.fees);
    setName(data?.act?.name);
  }, [data]);

  const { data: session } = useSession();
  const { data: user } = session as Session;

  const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
  const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
  const devise = doctor_country.currency?.name;
  return (
    <ActFeesCardStyled>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            {edit === data?.uuid && !data?.act.isVerified ? (
              <TextField
                placeholder={"--"}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  data.act.name = e.target.value;
                }}
              />
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}>
                {data?.act?.name}
              </Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            <Stack direction="row" alignItems="center">
              {edit === data?.uuid ? (
                <TextField
                  fullWidth
                  sx={{ mr: 1 }}
                  placeholder={"--"}
                  value={fees}
                  onChange={(e) => {
                    if (!isNaN(Number(e.target.value))) {
                      setFees(e.target.value);
                      data.fees = Number(e.target.value);
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">{devise}</InputAdornment>
                    ),
                    style: { backgroundColor: "white" },
                    inputProps: { min: 0 },
                  }}
                />
              ) : (
                <Typography fontSize={14} letterSpacing={1}>
                  {data?.fees} <span style={{ fontSize: 9 }}>{devise}</span>
                </Typography>
              )}
              <Stack direction="row" spacing={1} ml="auto">
                {edit === data.uuid ? (
                  <IconButton
                    size="small"
                    disabled={fees?.length === 0}
                    color={"primary"}
                    sx={{ mr: { md: 1 } }}
                    onClick={() => {
                      editMotif(data, fees, name);
                      setTimeout(() => {
                        setEdit("");
                      }, 1000);
                    }}>
                    <CheckIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                ) : (
                  <IconButton
                    size="small"
                    sx={{ mr: { md: 1 } }}
                    onClick={() => {
                      setEdit(data.uuid);
                    }}>
                    <IconUrl path="setting/edit" />
                  </IconButton>
                )}
                <IconButton
                  onClick={() => {
                    handleSelected(data);
                  }}
                  size="small"
                  sx={{ mr: { md: 1 } }}>
                  <IconUrl path="setting/icdelete" />
                </IconButton>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </ActFeesCardStyled>
  );
}

export default ActfeesMobileCard;
