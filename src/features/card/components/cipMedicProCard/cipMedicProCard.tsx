import {Checkbox, Collapse, IconButton, Stack, Typography} from "@mui/material";
import CipMedicProCardStyled from './overrides/cipMedicProCardStyle';
import InputBaseStyled from "./overrides/inputBaseStyle";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import {useState} from "react";

function CipMedicProCard({...props}) {
    const {row, devise, edit, handleEvent} = props;
    const [selected, setSelected] = useState<string>("");
    return (
        <CipMedicProCardStyled>
            <Stack spacing={row.selected ? 2 : 0}>
                <Stack direction='row' alignItems='center'>
                    <Checkbox
                        sx={{
                            width: 'auto',
                            height: 'auto',
                            padding: 0,
                            mr: 1,
                        }}
                        color="primary"
                        onChange={() => {
                            edit(row, "check");
                            handleEvent()
                        }}
                        checked={row.selected}
                    />
                    <Typography>
                        {row.act.name}
                    </Typography>
                    <Typography ml='auto' fontWeight={600}
                    >{row.qte ? row.fees * row.qte : row.fees}</Typography> {devise}
                </Stack>

                <Collapse in={row.selected}>
                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                        <Stack alignItems="center" direction="row" className="counter-btn">
                            <IconButton
                                sx={{
                                    svg: {
                                        width: 16,
                                        height: 16
                                    }
                                }}
                                size="small"
                                disabled={row.qte <= 1}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    row.qte = row.qte - 1;
                                    edit(row, "change");
                                    handleEvent()
                                }}>
                                <RemoveIcon/>
                            </IconButton>

                            <InputBaseStyled
                                placeholder={"1"}
                                value={row.qte}
                                onClick={(e) => e.stopPropagation()}
                                onFocus={() => {
                                    setSelected(row.uuid + "qte");
                                }}
                                onBlur={() => {
                                    handleEvent()
                                    setSelected("");
                                }}
                                autoFocus={selected === row.uuid + "qte"}
                                onChange={(e) => {
                                    if (!isNaN(Number(e.currentTarget.value))) {
                                        edit({...row, qte: Number(e.currentTarget.value)}, "change");
                                    }
                                }}
                            />

                            <IconButton
                                sx={{
                                    svg: {
                                        width: 16,
                                        height: 16
                                    }
                                }}
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    row.qte = row.qte + 1;
                                    edit(row, "change");
                                    handleEvent()
                                }}>
                                <AddIcon width={1} height={1}/>
                            </IconButton>
                        </Stack>
                        <InputBaseStyled
                            size="small"
                            id={row.uuid}
                            value={row.fees}
                            placeholder={"--"}
                            autoFocus={selected === row.uuid}
                            onFocus={() => {
                                setSelected(row.uuid);
                            }}
                            onBlur={() => {
                                handleEvent()
                                setSelected("");
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e: any) => {
                                if (!isNaN(e.currentTarget.value)) {
                                    row.fees = Number(e.currentTarget.value);
                                    edit(row, "change", e.currentTarget.value);
                                }
                            }}
                        />
                    </Stack>
                </Collapse>
            </Stack>

        </CipMedicProCardStyled>


    )
}

export default CipMedicProCard
