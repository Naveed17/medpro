import TableCell from "@mui/material/TableCell";
import {
  Button,
  Checkbox,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import { TableRowStyled } from "@features/table";
import React, { useState } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import InputBaseStyled from "../overrides/inputBaseStyled";
import IconUrl from "@themes/urlIcon";

function InventoryRow({ ...props }) {
  const { row, data, editMotif, handleClick, selected, isItemSelected } = props;

  const theme = useTheme() as Theme;

  const [selectedRow, setSelected] = useState<string>("");

  return (
    <TableRowStyled hover role="checkbox" tabIndex={-1}>
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          checked={selected.some((uuid: any) => uuid === row.uuid)}
          inputProps={{
            "aria-labelledby": row.uuid,
          }}
          onChange={(ev) => {
            ev.stopPropagation();
            handleClick(row.uuid);
          }}
        />
      </TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell align={"center"}>
        {isItemSelected ? (
          <Stack alignItems="center" direction="row" className="counter-btn">
            <IconButton
              size="small"
              sx={{ display: { xs: "none", md: "inline-flex" } }}
              disabled={row.qte <= 1}
              onClick={(e) => {
                e.stopPropagation();
                row.qte = row.qte - 1;
                editMotif(row, "change");
              }}
            >
              <RemoveIcon width={1} height={1} />
            </IconButton>

            <InputBaseStyled
              placeholder={"1"}
              value={row.qte}
              onClick={(e) => e.stopPropagation()}
              onFocus={() => {
                setSelected(row.uuid + "qte");
              }}
              onBlur={() => {
                setSelected("");
              }}
              autoFocus={selectedRow === row.uuid + "qte"}
              onChange={(e) => {
                if (!isNaN(Number(e.currentTarget.value))) {
                  editMotif(
                    { ...row, qte: Number(e.currentTarget.value) },
                    "change"
                  );
                }
              }}
            />

            <IconButton
              size="small"
              sx={{ display: { xs: "none", md: "inline-flex" } }}
              onClick={(e) => {
                e.stopPropagation();
                row.qte = row.qte + 1;
                editMotif(row, "change");
              }}
            >
              <AddIcon />
            </IconButton>
          </Stack>
        ) : (
          <>
            <Button
              disabled
              sx={{
                backgroundColor: "transparent !important",
                borderColor: "transparent",
                color: theme.palette.text.primary + " !important",
                mr: 1,
              }}
              size="small"
            >
              {row.qte > 0 ? row.qte : "--"}
            </Button>
          </>
        )}
      </TableCell>
      <TableCell align="center">
        {isItemSelected ? (
          <>
            <InputBaseStyled
              size="small"
              id={row.uuid}
              value={row.before_amount}
              placeholder={"--"}
              autoFocus={selectedRow === row.uuid}
              onFocus={() => {
                setSelected(row.uuid);
              }}
              onBlur={() => {
                setSelected("");
              }}
              onClick={(e) => e.stopPropagation()}
              onChange={(e: any) => {
                if (!isNaN(e.currentTarget.value)) {
                  row.before_amount = Number(e.currentTarget.value);
                  editMotif(row, "change", e.currentTarget.value);
                }
              }}
            />
          </>
        ) : (
          <>
            <Button
              disabled
              sx={{
                backgroundColor: "transparent !important",
                borderColor: "transparent",
                color: theme.palette.text.primary + " !important",
              }}
              size="small"
            >
              {row.before_amount}
            </Button>
          </>
        )}
        {data.devise}
      </TableCell>
      <TableCell align="center">
        {isItemSelected ? (
          <>
            <InputBaseStyled
              size="small"
              id={row.uuid}
              value={row.after_amount}
              placeholder={"--"}
              autoFocus={selectedRow === row.uuid}
              onFocus={() => {
                setSelected(row.uuid);
              }}
              onBlur={() => {
                setSelected("");
              }}
              onClick={(e) => e.stopPropagation()}
              onChange={(e: any) => {
                if (!isNaN(e.currentTarget.value)) {
                  row.after_amount = Number(e.currentTarget.value);
                  editMotif(row, "change", e.currentTarget.value);
                }
              }}
            />
          </>
        ) : (
          <>
            <Button
              disabled
              sx={{
                backgroundColor: "transparent !important",
                borderColor: "transparent",
                color: theme.palette.text.primary + " !important",
              }}
              size="small"
            >
              {row.after_amount}
            </Button>
          </>
        )}
        {data.devise}
      </TableCell>
      <TableCell align={"center"}>
        <Typography fontWeight={600}>
          {row.qte * row.after_amount} {data.devise}
        </Typography>
      </TableCell>
      <TableCell align="right">
        {row ? (
          <>
            <IconButton
              size="small"
              sx={{ mr: { md: 1 } }}
              onClick={() => editMotif(row, "edit")}
            >
              <IconUrl path="setting/edit" />
            </IconButton>
            <IconButton
              size="small"
              sx={{ mr: { md: 1 } }}
              onClick={() => editMotif(row, "delete")}
            >
              <IconUrl path="setting/icdelete" />
            </IconButton>
          </>
        ) : (
          <Skeleton width={30} height={40} sx={{ m: "auto" }} />
        )}
      </TableCell>
    </TableRowStyled>
  );
}

export default InventoryRow;
