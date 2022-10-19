import TableCell from "@mui/material/TableCell";
import { InputBase, Skeleton, Button, useTheme } from "@mui/material";
import { TableRowStyled } from "@features/table";
import React, { useState } from "react";

function ActFeesRow({ ...props }) {
  const theme = useTheme();
  const { row, editMotif, t, data, index } = props;
  const { isNew } = data;
  const [act, setAct] = useState("");
  const [fees, setFees] = useState("");
  const [show, setShow] = useState(false);
  const [isFocus, setIsfocus] = useState(false);
  return (
    <TableRowStyled
      hover
      className={row?.uuid === "NEWROW" && index === 0 ? "new-row" : ""}>
      <TableCell>
        {row ? (
          <InputBase
            fullWidth
            autoFocus={index === 0}
            placeholder={t("name_of_act")}
            style={{fontSize: 13}}
            inputProps={{ readOnly: !isNew || row?.uuid !== "NEWROW" }}
            value={act ? act : row?.act?.name || ""}
            onChange={(e) => {
              setAct(e.target.value);
              setShow(true);
            }}
          />
        ) : (
          <Skeleton width={160} />
        )}
      </TableCell>
      <TableCell align="left">
        {row ? (
          <>
            <InputBase
              onFocus={() => setIsfocus(true)}
              onBlur={() => setIsfocus(false)}
              sx={{
                maxWidth: 80,
                height: 30,
                borderRadius: 2,
                paddingLeft: 0.5,
                paddingRight: 0.5,
                color: theme.palette.text.primary,
                mr: 1,
                input: {
                  textAlign: "center",
                  padding: theme.spacing(0.3),
                  "&::-webkit-outer-spin-button,&::-webkit-inner-spin-button": {
                    "-webkit-appearance": "none",
                    margin: 0,
                  },
                },
                ...(isFocus && {
                  backgroundColor: "white",
                  border: 1,
                  borderColor: theme.palette.divider,
                }),
              }}
              placeholder={'--'}
              type="number"
              value={fees ? fees : row?.fees || ""}
              onChange={(e) => {
                setFees(e.target.value);
                setShow(true);
              }}
            />
            TND{" "}
          </>
        ) : (
          <Skeleton width={100} />
        )}
        {(act || fees) && show && (
          <Button
            onClick={() => {
              editMotif(
                (prev: { uuid: string; act: string; fees: number }) => ({
                  ...prev,
                  uuid: row.act.uuid,
                  act,
                  fees: +fees,
                })
              );
              setShow(false);
            }}
            size="small"
            sx={{ float: "right" }}>
            {t("save")}
          </Button>
        )}
      </TableCell>
    </TableRowStyled>
  );
}

export default ActFeesRow;
