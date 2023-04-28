import React from "react";
import Switch from "@mui/material/Switch";
import TableCell from "@mui/material/TableCell";
import {
  IconButton,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Skeleton,
  Box,
  Stack,
} from "@mui/material";
import Lable from "@themes/overrides/Lable";
import IconUrl from "@themes/urlIcon";
import { TableRowStyled } from "@features/table";
import { uniqueId } from "lodash";
import { useTranslation } from "next-i18next";
import { ModelDot } from "@features/modelDot";

function MotifRow({ ...props }) {
  const { row, tableHeadData, active, handleChange, editMotif, ids, data } =
    props;
  const durations: DurationModel[] = data.durations;
  const delay: DurationModel[] = data.delay;
  const { t, ready } = useTranslation("common");
  return (
    <TableRowStyled key={uniqueId}>
      <TableCell>
        {row ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}>
            <ModelDot
              color={row.color}
              selected={false}
              marginRight={15}></ModelDot>

            <Typography variant="body1" color="text.primary">
              {row.name}
            </Typography>
          </Box>
        ) : (
          <Skeleton variant="text" width={100} />
        )}
      </TableCell>
      <TableCell align="center">
        {row ? (
          <Switch
            name="active"
            onChange={(e) => handleChange(row, "active", "")}
            checked={row.isEnabled}
          />
        ) : (
          <Skeleton width={50} height={40} sx={{ m: "auto" }} />
        )}
      </TableCell>
      <TableCell align="right">
        {row ? (
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <IconButton
              size="small"
              sx={{ mr: { md: 1 } }}
              onClick={() => editMotif(row, "edit")}>
              <IconUrl path="setting/edit" />
            </IconButton>
            <IconButton
              size="small"
              sx={{ mr: { md: 1 } }}
              onClick={() => editMotif(row, "delete")}>
              <IconUrl path="setting/icdelete" />
            </IconButton>
          </Stack>
        ) : (
          <Skeleton width={30} height={40} sx={{ m: "auto" }} />
        )}
      </TableCell>
    </TableRowStyled>
  );
}

export default MotifRow;
