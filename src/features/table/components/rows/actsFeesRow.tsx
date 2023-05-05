import TableCell from "@mui/material/TableCell";
import {
  Box,
  IconButton,
  InputAdornment,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  Theme,
} from "@mui/material";
import { TableRowStyled } from "@features/table";
import React, { useEffect, useState } from "react";
import IconUrl from "@themes/urlIcon";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { DefaultCountry } from "@app/constants";

function ActFeesRow({ ...props }) {
  const { row, editMotif, data, t } = props;
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );
  const [fees, setFees] = useState("");
  const [name, setName] = useState("");
  const [edit, setEdit] = useState("");

  useEffect(() => {
    setFees(row?.fees);
    setName(row?.act?.name);
  }, [row]);

  const { data: session } = useSession();
  const { data: user } = session as Session;

  const medical_entity = (user as UserDataResponse)
    .medical_entity as MedicalEntityModel;
  const doctor_country = medical_entity.country
    ? medical_entity.country
    : DefaultCountry;
  const devise = doctor_country.currency?.name;

  return (
    <TableRowStyled>
      <TableCell>
        {edit === row?.uuid && !row?.act.isVerified ? (
          <TextField
            placeholder={"--"}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              row.act.name = e.target.value;
            }}
          />
        ) : (
          row?.act?.name
        )}
      </TableCell>
      <TableCell align={"center"}>
        {edit === row?.uuid ? (
          <TextField
            placeholder={"--"}
            value={fees}
            onChange={(e) => {
              if (!isNaN(Number(e.target.value))) {
                setFees(e.target.value);
                row.fees = Number(e.target.value);
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{devise}</InputAdornment>
              ),
              style: { width: isMobile ? 85 : 150, backgroundColor: "white" },
              inputProps: { min: 0 },
            }}
          />
        ) : (
          <Typography fontSize={14} letterSpacing={1}>
            {row?.fees} <span style={{ fontSize: 9 }}>{devise}</span>
          </Typography>
        )}
      </TableCell>
      <TableCell align="right">
        {row ? (
          <Box display="flex" sx={{ float: "right" }} alignItems="center">
            {edit === row.uuid ? (
              <IconButton
                size="small"
                disabled={fees?.length === 0}
                color={"primary"}
                sx={{ mr: { md: 1 } }}
                onClick={() => {
                  editMotif(row, fees, name);
                  setTimeout(() => {
                    setEdit("");
                  }, 1000);
                }}>
                {!isMobile && <IconUrl path="setting/edit" />}

                <Typography fontSize={11} ml={1}>
                  {t("save")}
                </Typography>
              </IconButton>
            ) : (
              <IconButton
                size="small"
                sx={{ mr: { md: 1 } }}
                onClick={() => {
                  setEdit(row.uuid);
                }}>
                <IconUrl path="setting/edit" />
              </IconButton>
            )}
            <IconButton
              onClick={() => {
                data.handleSelected(row);
              }}
              size="small"
              sx={{ mr: { md: 1 } }}>
              <IconUrl path="setting/icdelete" />
            </IconButton>
          </Box>
        ) : (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="flex-end">
            <Skeleton variant="text" width={50} />
            <Skeleton variant="text" width={50} />
          </Stack>
        )}
      </TableCell>
    </TableRowStyled>
  );
}

export default ActFeesRow;
