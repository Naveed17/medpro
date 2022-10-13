import TableCell from "@mui/material/TableCell";
import {InputBase, Skeleton, Button} from "@mui/material";
import {TableRowStyled} from "@features/table";
import React, {useState} from "react";

function ActFeesRow({...props}) {
    const {row, editMotif, t, data} = props;
    const {isNew} = data;
    const [act, setAct] = useState("");
    const [fees, setFees] = useState("");
    const [show, setShow] = useState(false);

    return (
        <TableRowStyled hover>
            <TableCell>
                {row ? (
                    <InputBase
                        fullWidth
                        placeholder={t("name_of_act")}
                        inputProps={{readOnly: !isNew || row?.uuid !== 'NEWROW'}}
                        autoFocus
                        value={act ? act : row?.act?.name || ""}
                        onChange={(e) => {
                            setAct(e.target.value);
                            setShow(true);
                        }}
                    />
                ) : (
                    <Skeleton width={160}/>
                )}
            </TableCell>
            <TableCell align="left">
                {row ? (
                    <>
                        <InputBase
                            sx={{maxWidth: 40}}
                            placeholder={t("price_of_act")}
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
                    <Skeleton width={100}/>
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
                        sx={{float: "right"}}>
                        {t("save")}
                    </Button>
                )}
            </TableCell>
        </TableRowStyled>
    );
}

export default ActFeesRow;
