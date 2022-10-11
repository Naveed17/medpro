import TableCell from "@mui/material/TableCell";
import { InputBase, IconButton, Skeleton, Stack, Typography, Button } from "@mui/material";
import { useTheme, Theme } from "@mui/material/styles";
import { TableRowStyled } from "@features/table";
import React, { useState } from "react";
function ActFeesRow({ ...props }) {
    const { row, editMotif, t, data } = props;
    const { isNew, setNew } = data
    const theme = useTheme() as Theme;
    const [act, setAct] = useState("")
    const [fees, setFees] = useState("");
    const [show, setShow] = useState(false)
    return (
        <TableRowStyled className={'cip-medical-proce-row'} hover>
            <TableCell>
                {
                    row ? <InputBase fullWidth placeholder={t("name_of_act")} inputProps={{ readOnly: !isNew }} value={act ? act : row?.act?.name || ""} onChange={(e) => {
                        setAct(e.target.value);
                        setShow(true)
                    }}
                    /> : <Skeleton width={160} />
                }

            </TableCell>
            <TableCell align="left">
                {
                    row ?
                        <>
                            <InputBase sx={{ maxWidth: 40 }} placeholder={t("price_of_act")} type="number" value={fees ? fees : row?.fees || ""} onChange={(e) => {
                                setFees(e.target.value);
                                setShow(true)
                            }}
                            />
                            TND </> : <Skeleton width={100} />

                }
                {
                    ((act || fees) && show) &&
                    <Button
                        onClick={() => {
                            editMotif((prev: { uuid: string, act: string, fees: number }) => ({
                                ...prev,
                                uuid: row.act.uuid,
                                act,
                                fees: +fees

                            }))
                            setNew(false);
                            setShow(false)
                        }}

                        size="small" sx={{ float: 'right' }}>
                        {t("save")}
                    </Button>
                }

            </TableCell>
        </TableRowStyled>
    );
}

export default ActFeesRow;
